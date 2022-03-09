import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Web3 from 'web3';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { Stack, Grid, Typography, Box } from '@mui/material';
import ProductPageHeader from 'src/components/ProductPageHeader';
import ProductImageContainer from 'src/components/ProductImageContainer';
import ProductSnippets from 'src/components/ProductSnippets';
import ProductBadge from 'src/components/ProductBadge';
import ELAPrice from 'src/components/ELAPrice';
import { PrimaryButton } from 'src/components/Buttons/styles';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import BlindBoxContents from 'src/components/TransactionDialogs/BuyBlindBox/BlindBoxContents';
import BuyBlindBox from 'src/components/TransactionDialogs/BuyBlindBox/BuyBlindBox';
import OrderSummary from 'src/components/TransactionDialogs/BuyBlindBox/OrderSummary';
import PurchaseSuccess from 'src/components/TransactionDialogs/BuyBlindBox/PurchaseSuccess';
import {
    enumBadgeType,
    enumBlindBoxNFTType,
    TypeProduct,
    TypeProductFetch,
    TypeBlindListLikes,
} from 'src/types/product-types';
import { getELA2USD } from 'src/services/fetch';
import { getImageFromAsset, getTime, reduceHexAddress } from 'src/services/common';
import { isInAppBrowser } from 'src/services/wallet';
import Container from 'src/components/Container';
import { blankBBItem } from 'src/constants/init-constants';
import ProjectDescription from 'src/components/SingleNFTMoreInfo/ProjectDescription';
import AboutAuthor from 'src/components/SingleNFTMoreInfo/AboutAuthor';

const BlindBoxProduct: React.FC = (): JSX.Element => {
    const params = useParams();
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();

    const [blindBoxDetail, setBlindBoxDetail] = useState<TypeProduct>(blankBBItem);
    const walletConnectProvider: WalletConnectProvider = isInAppBrowser()
        ? window.elastos.getWeb3Provider()
        : essentialsConnector.getWalletConnectProvider();
    const walletConnectWeb3 = new Web3(walletConnectProvider as any);

    const getBlindBoxDetail = async (tokenPriceRate: number) => {
        const resBlindBoxDetail = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/getBlindboxById?blindBoxId=${params.id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            },
        );
        const dataBlindBoxDetail = await resBlindBoxDetail.json();
        const blindDetail = dataBlindBoxDetail.data.result;
        var blind: TypeProduct = { ...blankBBItem };

        if (blindDetail !== undefined) {
            const itemObject: TypeProductFetch = blindDetail;
            blind.tokenId = itemObject.blindBoxIndex.toString();
            blind.name = itemObject.name;
            blind.image = getImageFromAsset(itemObject.asset);
            blind.price_ela = parseInt(itemObject.blindPrice);
            blind.price_usd = blind.price_ela * tokenPriceRate;
            const curTimestamp = new Date().getTime() / 1000;
            blind.type =
                curTimestamp < parseInt(itemObject.saleBegin)
                    ? enumBlindBoxNFTType.ComingSoon
                    : curTimestamp <= parseInt(itemObject.saleEnd)
                    ? enumBlindBoxNFTType.SaleEnds
                    : enumBlindBoxNFTType.SaleEnded;
            blind.likes = itemObject.likes;
            blind.views = itemObject.views;
            blind.author = itemObject.createdName;
            blind.royaltyOwner = itemObject.createdAddress;
            blind.isLike = signInDlgState.isLoggedIn
                ? itemObject.list_likes.findIndex(
                      (value: TypeBlindListLikes) => value.did === `did:elastos:${signInDlgState.userDid}`,
                  ) === -1
                    ? false
                    : true
                : false;
            blind.description = itemObject.description;
            blind.authorDescription = itemObject.authorDescription || ' ';
            blind.instock = itemObject.instock || 0;
            blind.sold = itemObject.sold || 0;
            if (itemObject.saleEnd) {
                let endTime = getTime(itemObject.saleEnd);
                blind.endTime = endTime.date + ' ' + endTime.time;
            } else {
                blind.endTime = '';
            }
            blind.state = itemObject.state;
            blind.maxPurchases = parseInt(itemObject.maxPurchases);
            blind.maxQuantity = parseInt(itemObject.maxQuantity);
            blind.did = itemObject.did;
        }
        setBlindBoxDetail(blind);
    };

    const getFetchData = async () => {
        getBlindBoxDetail(await getELA2USD());
    };

    useEffect(() => {
        getFetchData();
    }, []);

    const setBuyBlindBoxTxFee = async () => {
        const gasPrice: string = await walletConnectWeb3.eth.getGasPrice();
        setDialogState({ ...dialogState, buyBlindTxFee: (parseFloat(gasPrice) * 5000000) / 1e18 });
    };

    useEffect(() => {
        setBuyBlindBoxTxFee();
    }, [dialogState.buyBlindBoxDlgStep]);

    const updateBlindBoxLikes = (type: string) => {
        setBlindBoxDetail((prevState: TypeProduct) => {
            const blindDetail: TypeProduct = { ...prevState };
            if (type === 'inc') {
                blindDetail.likes++;
            } else if (type === 'dec') {
                blindDetail.likes--;
            }
            return blindDetail;
        });
    };

    const updateBlindBoxViews = (tokenId: string) => {
        if (signInDlgState.isLoggedIn && tokenId) {
            const reqUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/incTokenViews`;
            const reqBody = {
                token: signInDlgState.token,
                blindBoxIndex: tokenId,
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
                        setBlindBoxDetail((prevState: TypeProduct) => {
                            const blindDetail: TypeProduct = { ...prevState };
                            blindDetail.views += 1;
                            return blindDetail;
                        });
                    } else {
                        console.log(data);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    useEffect(() => {
        updateBlindBoxViews(blindBoxDetail.tokenId);
    }, [blindBoxDetail.tokenId]);

    return (
        <Container sx={{ paddingTop: { xs: 4, sm: 0 } }}>
            <ProductPageHeader />
            <Grid container marginTop={5} columnSpacing={5}>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <ProductImageContainer product={blindBoxDetail} updateLikes={updateBlindBoxLikes} />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Typography fontSize={{ md: 56, sm: 42, xs: 32 }} fontWeight={700}>
                        {blindBoxDetail.name}
                    </Typography>
                    <ProductSnippets
                        nickname={blindBoxDetail.author === '' ? blindBoxDetail.royaltyOwner : blindBoxDetail.author}
                        sold={blindBoxDetail.sold}
                        instock={blindBoxDetail.instock}
                        likes={blindBoxDetail.likes}
                        views={blindBoxDetail.views}
                    />
                    <Stack direction="row" alignItems="center" spacing={1} marginTop={3}>
                        <ProductBadge
                            badgeType={
                                blindBoxDetail.type === enumBlindBoxNFTType.ComingSoon
                                    ? enumBadgeType.ComingSoon
                                    : blindBoxDetail.type === enumBlindBoxNFTType.SaleEnds
                                    ? enumBadgeType.SaleEnds
                                    : enumBadgeType.SaleEnded
                            }
                            content={blindBoxDetail.endTime}
                        />
                    </Stack>
                    <ELAPrice price_ela={blindBoxDetail.price_ela} price_usd={blindBoxDetail.price_usd} marginTop={3} />
                    {signInDlgState.walletAccounts !== [] &&
                        blindBoxDetail.holder !== signInDlgState.walletAccounts[0] &&
                        blindBoxDetail.type === enumBlindBoxNFTType.SaleEnds &&
                        blindBoxDetail.state === 'online' &&
                        signInDlgState.userDid !== blindBoxDetail.did && (
                            <PrimaryButton
                                sx={{ marginTop: 3, width: '100%' }}
                                onClick={() => {
                                    setDialogState({
                                        ...dialogState,
                                        buyBlindBoxDlgOpened: true,
                                        buyBlindBoxDlgStep: 0,
                                        buyBlindName: blindBoxDetail.name,
                                        buyBlindPriceEla: blindBoxDetail.price_ela,
                                        buyBlindPriceUsd: blindBoxDetail.price_usd,
                                        buyBlindAmount: 1,
                                        buyBlindBoxId: parseInt(blindBoxDetail.tokenId),
                                        buyBlindCreator:
                                            blindBoxDetail.author === ''
                                                ? reduceHexAddress(blindBoxDetail.royaltyOwner || '', 4)
                                                : blindBoxDetail.author,
                                        buyBlindLeftAmount:
                                            blindBoxDetail.maxPurchases !== undefined &&
                                            blindBoxDetail.sold !== undefined
                                                ? blindBoxDetail.maxPurchases - blindBoxDetail.sold
                                                : 0,
                                    });
                                }}
                            >
                                Buy Now
                            </PrimaryButton>
                        )}
                </Grid>
            </Grid>
            <Grid container marginTop={5} columnSpacing={10}>
                <Grid item xs={12} md={6}>
                    <Stack spacing={5}>
                        <ProjectDescription description={blindBoxDetail.description} />
                        <AboutAuthor
                            name={blindBoxDetail.author}
                            description={blindBoxDetail.authorDescription}
                            img={blindBoxDetail.image}
                            address={reduceHexAddress(blindBoxDetail.royaltyOwner || '', 4)}
                        />
                    </Stack>
                </Grid>
            </Grid>
            <ModalDialog
                open={dialogState.buyBlindBoxDlgOpened}
                onClose={() => {
                    setDialogState({ ...dialogState, buyBlindBoxDlgOpened: false });
                }}
            >
                {dialogState.buyBlindBoxDlgStep === 0 && <BuyBlindBox />}
                {dialogState.buyBlindBoxDlgStep === 1 && <OrderSummary />}
                {dialogState.buyBlindBoxDlgStep === 2 && <PurchaseSuccess />}
                {dialogState.buyBlindBoxDlgStep === 3 && <BlindBoxContents />}
            </ModalDialog>
        </Container>
    );
};

export default BlindBoxProduct;
