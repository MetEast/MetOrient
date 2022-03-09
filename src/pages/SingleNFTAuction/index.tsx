import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Stack, Grid, Typography } from '@mui/material';
import { enumBadgeType, TypeProduct, TypeNFTTransaction, TypeSingleNFTBid } from 'src/types/product-types';
import ProductPageHeader from 'src/components/ProductPageHeader';
import ProductImageContainer from 'src/components/ProductImageContainer';
import ProductSnippets from 'src/components/ProductSnippets';
import ProductBadge from 'src/components/ProductBadge';
import ELAPrice from 'src/components/ELAPrice';
import { PrimaryButton, PinkButton, SecondaryButton } from 'src/components/Buttons/styles';
import SingleNFTBidsTable from 'src/components/SingleNFTBidsTable';
import NFTTransactionTable from 'src/components/NFTTransactionTable';
import PriceHistoryView from 'src/components/PriceHistoryView';
import { getELA2USD, getMyFavouritesList, getNFTItem, getNFTLatestBids, getNFTLatestTxs } from 'src/services/fetch';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import PlaceBid from 'src/components/TransactionDialogs/PlaceBid/PlaceBid';
import ReviewBidDetails from 'src/components/TransactionDialogs/PlaceBid/ReviewBidDetails';
import BidPlaceSuccess from 'src/components/TransactionDialogs/PlaceBid/BidPlaceSuccess';
import ChangePrice from 'src/components/TransactionDialogs/ChangePrice/ChangePrice';
import PriceChangeSuccess from 'src/components/TransactionDialogs/ChangePrice/PriceChangeSuccess';
import CancelSale from 'src/components/TransactionDialogs/CancelSale/CancelSale';
import CancelSaleSuccess from 'src/components/TransactionDialogs/CancelSale/CancelSaleSuccess';
import AllTransactions from 'src/components/profile/AllTransactions';
import AllBids from 'src/components/TransactionDialogs/AllBids/AllBids';
import Web3 from 'web3';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { TypeSelectItem } from 'src/types/select-types';
import NoBids from 'src/components/TransactionDialogs/AllBids/NoBids';
import { isInAppBrowser } from 'src/services/wallet';
import Container from 'src/components/Container';
import { blankNFTItem } from 'src/constants/init-constants';
import ProjectDescription from 'src/components/SingleNFTMoreInfo/ProjectDescription';
import AboutAuthor from 'src/components/SingleNFTMoreInfo/AboutAuthor';
import ChainDetails from 'src/components/SingleNFTMoreInfo/ChainDetails';

const SingleNFTAuction: React.FC = (): JSX.Element => {
    const [signInDlgState, setSignInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const params = useParams();
    const [productDetail, setProductDetail] = useState<TypeProduct>(blankNFTItem);
    const [transactionsList, setTransactionsList] = useState<Array<TypeNFTTransaction>>([]);
    const [bidsList, setBidsList] = useState<Array<TypeSingleNFTBid>>([]);
    const [myBidsList, setMyBidsList] = useState<Array<TypeSingleNFTBid>>([]);
    const [transactionSortBy, setTransactionSortBy] = useState<TypeSelectItem>();
    const [bidSortBy, setBidSortBy] = useState<TypeSelectItem>();
    const walletConnectProvider: WalletConnectProvider = isInAppBrowser()
        ? window.elastos.getWeb3Provider()
        : essentialsConnector.getWalletConnectProvider();
    const walletConnectWeb3 = new Web3(walletConnectProvider as any);

    // -------------- Fetch Data -------------- //
    useEffect(() => {
        let unmounted = false;
        const getFetchData = async () => {
            const ELA2USD = await getELA2USD();
            const likeList = await getMyFavouritesList(signInDlgState.isLoggedIn, signInDlgState.userDid);
            const _NFTItem = await getNFTItem(params.id, ELA2USD, likeList);
            if (!unmounted) {
                setProductDetail(_NFTItem);
            }
        };
        getFetchData().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [signInDlgState.isLoggedIn, signInDlgState.userDid, params.id]);

    useEffect(() => {
        let unmounted = false;
        const getFetchData = async () => {
            const _NFTTxs = await getNFTLatestTxs(params.id, '', 1, 5);
            if (!unmounted) {
                setTransactionsList(_NFTTxs.txs);
            }
        };
        getFetchData().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [transactionSortBy, params.id]);

    useEffect(() => {
        let unmounted = false;
        const getFetchData = async () => {
            const _NFTBids = await getNFTLatestBids(params.id, signInDlgState.walletAccounts[0], 1, 5);
            if (!unmounted) {
                setMyBidsList(_NFTBids.mine);
                setBidsList(_NFTBids.others);
            }
        };
        getFetchData().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [bidSortBy, signInDlgState.walletAccounts, params.id]);
    // -------------- Fetch Data -------------- //

    useEffect(() => {
        const setPlaceBidTxFee = async () => {
            const gasPrice: string = await walletConnectWeb3.eth.getGasPrice();
            setDialogState({ ...dialogState, placeBidTxFee: (parseFloat(gasPrice) * 5000000) / 1e18 });
        };
        setPlaceBidTxFee();
    }, [dialogState.placeBidDlgStep]);

    // -------------- Likes & Views -------------- //
    const updateProductLikes = (type: string) => {
        setProductDetail((prevState: TypeProduct) => {
            const prodDetail: TypeProduct = { ...prevState };
            if (type === 'inc') {
                prodDetail.likes++;
            } else if (type === 'dec') {
                prodDetail.likes--;
            }
            return prodDetail;
        });
    };

    useEffect(() => {
        let unmounted = false;
        const updateProductViews = (tokenId: string) => {
            if (signInDlgState.isLoggedIn && tokenId) {
                const reqUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/incTokenViews`;
                const reqBody = {
                    token: signInDlgState.token,
                    tokenId: tokenId,
                    did: signInDlgState.userDid,
                };
                fetch(reqUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(reqBody),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.code === 200) {
                            if (!unmounted) {
                                setProductDetail((prevState: TypeProduct) => {
                                    const prodDetail: TypeProduct = { ...prevState };
                                    prodDetail.views += 1;
                                    return prodDetail;
                                });
                            }
                        } else {
                            console.log(data);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        };
        updateProductViews(productDetail.tokenId);
        return () => {
            unmounted = true;
        };
    }, [productDetail.tokenId]);

    return (
        <Container sx={{ paddingTop: { xs: 4, sm: 0 } }}>
            <ProductPageHeader />
            <Grid container marginTop={6} columnSpacing={5}>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <ProductImageContainer product={productDetail} updateLikes={updateProductLikes} />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Typography fontSize={{ md: 56, sm: 42, xs: 32 }} fontWeight={700}>
                        {productDetail.name}
                    </Typography>
                    <ProductSnippets
                        nickname={productDetail.author}
                        likes={productDetail.likes}
                        views={productDetail.views}
                    />
                    <Stack direction="row" alignItems="center" spacing={1} marginTop={3}>
                        <Grid container spacing={1}>
                            <Grid item xs={'auto'}>
                                <ProductBadge badgeType={enumBadgeType.OnAuction} />
                            </Grid>
                            {productDetail.status !== 'HAS BIDS' && (
                                <Grid item xs={'auto'}>
                                    <ProductBadge badgeType={enumBadgeType.ReservePriceNotMet} />
                                </Grid>
                            )}
                            <Grid item xs={12} sm={'auto'}>
                                {productDetail.isExpired ? (
                                    <ProductBadge badgeType={enumBadgeType.SaleEnded} />
                                ) : (
                                    <ProductBadge badgeType={enumBadgeType.SaleEnds} content={productDetail.endTime} />
                                )}
                            </Grid>
                        </Grid>
                    </Stack>
                    <ELAPrice
                        price_ela={productDetail.price_ela}
                        price_usd={productDetail.price_usd}
                        detail_page={true}
                        marginTop={3}
                    />
                    {signInDlgState.walletAccounts !== [] &&
                        productDetail.holder !== signInDlgState.walletAccounts[0] &&
                        !productDetail.isExpired && (
                            <PrimaryButton
                                sx={{ marginTop: 3, width: '100%' }}
                                onClick={() => {
                                    if (signInDlgState.isLoggedIn) {
                                        setDialogState({
                                            ...dialogState,
                                            placeBidDlgOpened: true,
                                            placeBidDlgStep: 0,
                                            placeBidName: productDetail.name,
                                            placeBidOrderId: productDetail.orderId || '',
                                            placeBidMinLimit: productDetail.price_ela,
                                        });
                                    } else {
                                        setSignInDlgState({ ...signInDlgState, signInDlgOpened: true });
                                    }
                                }}
                            >
                                Place Bid
                            </PrimaryButton>
                        )}
                    {signInDlgState.walletAccounts !== [] &&
                        productDetail.holder === signInDlgState.walletAccounts[0] &&
                        bidsList.length === 0 && (
                            <Stack direction="row" alignItems="center" spacing={2} marginTop={3}>
                                <PinkButton
                                    sx={{ width: '100%', height: 40 }}
                                    onClick={() => {
                                        if (signInDlgState.isLoggedIn) {
                                            setDialogState({
                                                ...dialogState,
                                                cancelSaleDlgOpened: true,
                                                cancelSaleDlgStep: 0,
                                                cancelSaleOrderId: productDetail.orderId || '',
                                            });
                                        } else {
                                            setSignInDlgState({ ...signInDlgState, signInDlgOpened: true });
                                        }
                                    }}
                                >
                                    Cancel Sale
                                </PinkButton>
                                <SecondaryButton
                                    sx={{ width: '100%', height: 40 }}
                                    onClick={() => {
                                        if (signInDlgState.isLoggedIn) {
                                            setDialogState({
                                                ...dialogState,
                                                changePriceDlgOpened: true,
                                                changePriceDlgStep: 0,
                                                changePriceCurPrice: productDetail.price_ela,
                                                changePriceOrderId: productDetail.orderId || '',
                                            });
                                        } else {
                                            setSignInDlgState({ ...signInDlgState, signInDlgOpened: true });
                                        }
                                    }}
                                >
                                    Change Price
                                </SecondaryButton>
                            </Stack>
                        )}
                </Grid>
            </Grid>
            <Grid container marginTop={5} columnSpacing={10}>
                <Grid item md={4} xs={12}>
                    <Stack spacing={5}>
                        <ProjectDescription description={productDetail.description} />
                        <AboutAuthor
                            name={productDetail.author}
                            description={productDetail.authorDescription}
                            img={productDetail.authorImg}
                            address={productDetail.authorAddress}
                        />
                        <ChainDetails
                            tokenId={productDetail.tokenIdHex}
                            ownerName={productDetail.holderName}
                            ownerAddress={productDetail.holder}
                            royalties={productDetail.royalties}
                            createTime={productDetail.createTime}
                        />
                    </Stack>
                </Grid>
                <Grid item md={8} xs={12}>
                    <Stack spacing={10}>
                        <SingleNFTBidsTable
                            isLoggedIn={signInDlgState.isLoggedIn}
                            myBidsList={myBidsList}
                            bidsList={bidsList}
                        />
                        <PriceHistoryView />
                        <NFTTransactionTable transactionsList={transactionsList} />
                    </Stack>
                </Grid>
            </Grid>
            <ModalDialog
                open={dialogState.placeBidDlgOpened}
                onClose={() => {
                    setDialogState({ ...dialogState, placeBidDlgOpened: false });
                }}
            >
                {dialogState.placeBidDlgStep === 0 && <PlaceBid />}
                {dialogState.placeBidDlgStep === 1 && <ReviewBidDetails />}
                {dialogState.placeBidDlgStep === 2 && <BidPlaceSuccess />}
            </ModalDialog>
            <ModalDialog
                open={dialogState.changePriceDlgOpened}
                onClose={() => {
                    setDialogState({ ...dialogState, changePriceDlgOpened: false });
                }}
            >
                {dialogState.changePriceDlgStep === 0 && <ChangePrice />}
                {dialogState.changePriceDlgStep === 1 && <PriceChangeSuccess />}
            </ModalDialog>
            <ModalDialog
                open={dialogState.cancelSaleDlgOpened}
                onClose={() => {
                    setDialogState({ ...dialogState, cancelSaleDlgOpened: false });
                }}
            >
                {dialogState.cancelSaleDlgStep === 0 && <CancelSale />}
                {dialogState.cancelSaleDlgStep === 1 && <CancelSaleSuccess />}
            </ModalDialog>
            <ModalDialog
                open={dialogState.allBidDlgOpened}
                onClose={() => {
                    setDialogState({ ...dialogState, allBidDlgOpened: false });
                }}
            >
                {bidsList.length === 0 && myBidsList.length === 0 ? (
                    <NoBids
                        onClose={() => {
                            setDialogState({ ...dialogState, allBidDlgOpened: false });
                        }}
                    />
                ) : (
                    <AllBids
                        bidsList={bidsList}
                        myBidsList={myBidsList}
                        changeHandler={(value: TypeSelectItem | undefined) => setBidSortBy(value)}
                    />
                )}
            </ModalDialog>
            <ModalDialog
                open={dialogState.allTxDlgOpened}
                onClose={() => {
                    setDialogState({ ...dialogState, allTxDlgOpened: false });
                }}
            >
                <AllTransactions
                    transactionList={transactionsList}
                    changeHandler={(value: TypeSelectItem | undefined) => setTransactionSortBy(value)}
                />
            </ModalDialog>
        </Container>
    );
};

export default SingleNFTAuction;
