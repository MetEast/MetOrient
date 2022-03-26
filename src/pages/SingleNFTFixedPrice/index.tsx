import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Stack, Grid, Box, Typography, Skeleton } from '@mui/material';
import ProductPageHeader from 'src/components/ProductPageHeader';
import { enumBadgeType } from 'src/types/product-types';
import ProductImageContainer from 'src/components/ProductImageContainer';
import ProductSnippets from 'src/components/ProductSnippets';
import ProductBadge from 'src/components/ProductBadge';
import { PrimaryButton, PinkButton } from 'src/components/Buttons/styles';
import ELAPrice from 'src/components/ELAPrice';
import NFTTransactionTable from 'src/components/NFTTransactionTable';
import PriceHistoryView from 'src/components/PriceHistoryView';
import { TypeNFTTransaction, TypeProduct } from 'src/types/product-types';
import { getMintCategory } from 'src/services/common';
import { getELA2USD, getMyFavouritesList, getNFTItem, getNFTLatestTxs } from 'src/services/fetch';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import BuyNow from 'src/components/TransactionDialogs/BuyNow/BuyNow';
import PurchaseSuccess from 'src/components/TransactionDialogs/BuyNow/PurchaseSuccess';
import ChangePrice from 'src/components/TransactionDialogs/ChangePrice/ChangePrice';
import PriceChangeSuccess from 'src/components/TransactionDialogs/ChangePrice/PriceChangeSuccess';
import CancelSale from 'src/components/TransactionDialogs/CancelSale/CancelSale';
import CancelSaleSuccess from 'src/components/TransactionDialogs/CancelSale/CancelSaleSuccess';
import Container from 'src/components/Container';
import { blankNFTItem } from 'src/constants/init-constants';
import ProjectDescription from 'src/components/SingleNFTMoreInfo/ProjectDescription';
import AboutAuthor from 'src/components/SingleNFTMoreInfo/AboutAuthor';
import ChainDetails from 'src/components/SingleNFTMoreInfo/ChainDetails';

const SingleNFTFixedPrice: React.FC = (): JSX.Element => {
    const params = useParams();
    const [signInDlgState, setSignInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const [productDetail, setProductDetail] = useState<TypeProduct>(blankNFTItem);
    const [transactionsList, setTransactionsList] = useState<Array<TypeNFTTransaction>>([]);
    const [showBuyNowBtn, setShowBuyNowBtn] = useState<boolean>(false);
    // -------------- Fetch Data -------------- //
    useEffect(() => {
        let unmounted = false;
        const fetchNFTItem = async () => {
            const ELA2USD = await getELA2USD();
            const likeList = await getMyFavouritesList(signInDlgState.isLoggedIn, signInDlgState.userDid);
            const _NFTItem = await getNFTItem(params.id, ELA2USD, likeList);
            if (!unmounted) {
                setProductDetail(_NFTItem);
            }
        };
        fetchNFTItem().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [signInDlgState.isLoggedIn, signInDlgState.userDid, params.id]);

    useEffect(() => {
        let unmounted = false;
        const fetchLatestTxs = async () => {
            const _NFTTxs = await getNFTLatestTxs(params.id, '', 1, 5);
            if (!unmounted) {
                setTransactionsList(_NFTTxs.txs);
            }
        };
        fetchLatestTxs().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [params.id]);
    // -------------- Fetch Data -------------- //
    useEffect(() => {
        if (signInDlgState.walletAccounts.length === 0) {
            setShowBuyNowBtn(true);
        } else {
            if (signInDlgState.walletAccounts[0] === productDetail.holder) setShowBuyNowBtn(false);
            else setShowBuyNowBtn(true);
        }
    }, [signInDlgState.walletAccounts, productDetail]);
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
    }, [productDetail.tokenId, signInDlgState.isLoggedIn, signInDlgState.token, signInDlgState.userDid]);

    return (
        <Container sx={{ paddingTop: { xs: 4, sm: 0 } }}>
            <ProductPageHeader />
            <Grid container marginTop={6} columnSpacing={5} rowGap={2}>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    {productDetail.tokenId === '' ? (
                        <Box
                            position="relative"
                            borderRadius={4}
                            overflow="hidden"
                            sx={{ width: '100%', paddingTop: '75%' }}
                        >
                            <Box position="absolute" sx={{ inset: 0 }}>
                                <Skeleton
                                    variant="rectangular"
                                    animation="wave"
                                    width="100%"
                                    height="100%"
                                    sx={{ bgcolor: '#E8F4FF' }}
                                />
                            </Box>
                        </Box>
                    ) : (
                        <ProductImageContainer product={productDetail} updateLikes={updateProductLikes} />
                    )}
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    {productDetail.tokenId === '' ? (
                        <>
                            <Skeleton
                                variant="rectangular"
                                animation="wave"
                                width="100%"
                                height={45}
                                sx={{ borderRadius: 2, bgcolor: '#E8F4FF' }}
                            />
                            <Skeleton
                                variant="rectangular"
                                animation="wave"
                                width="100%"
                                height={45}
                                sx={{ borderRadius: 2, bgcolor: '#E8F4FF', marginTop: 2 }}
                            />
                            <Skeleton
                                variant="rectangular"
                                animation="wave"
                                width="100%"
                                height={56}
                                sx={{ borderRadius: 2, bgcolor: '#E8F4FF', marginTop: 3 }}
                            />
                        </>
                    ) : (
                        <>
                            <Typography noWrap fontSize={{ md: 56, sm: 42, xs: 32 }} fontWeight={700} lineHeight={1}>
                                {productDetail.name}
                            </Typography>
                            <ProductSnippets
                                nickname={productDetail.author}
                                likes={productDetail.likes}
                                views={productDetail.views}
                                sx={{ marginTop: 1 }}
                            />
                            <Stack direction="row" alignItems="center" spacing={1} marginTop={3}>
                                <ProductBadge badgeType={enumBadgeType.BuyNow} />
                                <ProductBadge badgeType={getMintCategory(productDetail.category)} />
                            </Stack>
                            <ELAPrice
                                price_ela={productDetail.price_ela}
                                price_usd={productDetail.price_usd}
                                detail_page={true}
                                marginTop={3}
                            />
                            {productDetail.status !== 'NEW' &&
                                (showBuyNowBtn ? (
                                    <PrimaryButton
                                        sx={{ marginTop: 3, width: '100%' }}
                                        onClick={() => {
                                            if (signInDlgState.isLoggedIn) {
                                                setDialogState({
                                                    ...dialogState,
                                                    buyNowDlgOpened: true,
                                                    buyNowDlgStep: 0,
                                                    buyNowPrice: productDetail.price_ela,
                                                    buyNowName: productDetail.name,
                                                    buyNowOrderId: productDetail.orderId || '',
                                                });
                                            } else {
                                                setSignInDlgState({ ...signInDlgState, signInDlgOpened: true });
                                            }
                                        }}
                                    >
                                        buy now
                                    </PrimaryButton>
                                ) : (
                                    <Stack direction="row" alignItems="center" spacing={2} marginTop={3}>
                                        <PinkButton
                                            sx={{ width: '100%' }}
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
                                        <PrimaryButton
                                            sx={{ width: '100%' }}
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
                                        </PrimaryButton>
                                    </Stack>
                                ))}
                        </>
                    )}
                </Grid>
            </Grid>
            {productDetail.tokenId === '' ? (
                <Box position="relative" marginTop={5} sx={{ width: '100%', paddingTop: '75%' }}>
                    <Box position="absolute" sx={{ inset: 0 }}>
                        <Skeleton
                            variant="rectangular"
                            animation="wave"
                            width="100%"
                            height="100%"
                            sx={{ borderRadius: 4, bgcolor: '#E8F4FF' }}
                        />
                    </Box>
                </Box>
            ) : (
                <Grid container marginTop={5} columnSpacing={10} rowGap={5}>
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
                            <PriceHistoryView />
                            <NFTTransactionTable transactionsList={transactionsList} />
                        </Stack>
                    </Grid>
                </Grid>
            )}
            <ModalDialog
                open={dialogState.buyNowDlgOpened}
                onClose={() => {
                    setDialogState({
                        ...dialogState,
                        buyNowDlgOpened: false,
                        buyNowDlgStep: 0,
                        buyNowPrice: 0,
                        buyNowName: '',
                        buyNowOrderId: '',
                        progressBar: 0,
                    });
                }}
            >
                {dialogState.buyNowDlgStep === 0 && <BuyNow />}
                {dialogState.buyNowDlgStep === 1 && <PurchaseSuccess />}
            </ModalDialog>
            <ModalDialog
                open={dialogState.changePriceDlgOpened}
                onClose={() => {
                    setDialogState({
                        ...dialogState,
                        changePriceCurPrice: 0,
                        changePriceTxFee: 0,
                        changePriceOrderId: '',
                        changePriceTxHash: '',
                        changePriceDlgOpened: false,
                        changePriceDlgStep: 0,
                    });
                }}
            >
                {dialogState.changePriceDlgStep === 0 && <ChangePrice />}
                {dialogState.changePriceDlgStep === 1 && <PriceChangeSuccess />}
            </ModalDialog>
            <ModalDialog
                open={dialogState.cancelSaleDlgOpened}
                onClose={() => {
                    setDialogState({
                        ...dialogState,
                        cancelSaleTxFee: 0,
                        cancelSaleOrderId: '',
                        cancelSaleTxHash: '',
                        cancelSaleDlgOpened: false,
                        cancelSaleDlgStep: 0,
                    });
                }}
            >
                {dialogState.cancelSaleDlgStep === 0 && <CancelSale />}
                {dialogState.cancelSaleDlgStep === 1 && <CancelSaleSuccess />}
            </ModalDialog>
        </Container>
    );
};

export default SingleNFTFixedPrice;
