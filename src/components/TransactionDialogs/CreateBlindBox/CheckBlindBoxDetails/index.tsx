import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo, DetailedInfoTitleTypo, DetailedInfoLabelTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import WarningTypo from '../../components/WarningTypo';
import ELAPrice from 'src/components/ELAPrice';
import { useStyles, InfoItemWrapper } from './styles';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { METEAST_CONTRACT_ABI, METEAST_CONTRACT_ADDRESS } from 'src/contracts/MET';
import { METEAST_MARKET_CONTRACT_ABI, METEAST_MARKET_CONTRACT_ADDRESS } from 'src/contracts/METMarket';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import { useSnackbar } from 'notistack';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { create } from 'ipfs-http-client';
import { createHash } from 'crypto';
import ModalDialog from 'src/components/ModalDialog';
import WaitingConfirm from '../../Others/WaitingConfirm';

const client = create({ url: process.env.REACT_APP_IPFS_UPLOAD_URL });

export interface ComponentProps {}

const CheckBlindBoxDetails: React.FC<ComponentProps> = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const { enqueueSnackbar } = useSnackbar();
    const [didCookies] = useCookies(['METEAST_DID']);
    const [tokenCookies] = useCookies(['METEAST_TOKEN']);
    const [loadingDlgOpened, setLoadingDlgOpened] = useState<boolean>(false);

    const sendIpfsImage = (f: File) =>
        new Promise((resolve, reject) => {
            const reader = new window.FileReader();
            reader.readAsArrayBuffer(f);
            reader.onloadend = async () => {
                try {
                    const fileContent = Buffer.from(reader.result as string);
                    const added = await client.add(fileContent);
                    resolve({ ...added, type: f.type } as any);
                } catch (error) {
                    reject(error);
                }
            };
        });

    const uploadBlindBoxInfo = (imgUri: string) =>
        new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('token', tokenCookies.METEAST_TOKEN);
            formData.append('did', didCookies.METEAST_DID);
            formData.append('name', dialogState.crtBlindTitle);
            formData.append('description', dialogState.crtBlindDescription);
            formData.append('authorDescription', dialogState.crtBlindAuthorDescription);
            formData.append('asset', imgUri);
            formData.append('tokenIds', dialogState.crtBlindTokenIds);
            formData.append('status', dialogState.crtBlindStatus);
            formData.append('maxQuantity', dialogState.crtBlindQuantity.toString());
            formData.append('blindPrice', dialogState.crtBlindPrice.toString());
            formData.append('saleBegin', (new Date(dialogState.crtBlindSaleBegin).getTime() / 1e3).toString());
            formData.append('saleEnd', (new Date(dialogState.crtBlindSaleEnd).getTime() / 1e3).toString());
            formData.append('maxLikes', dialogState.crtBlindLikes.toString());
            formData.append('maxViews', dialogState.crtBlindViews.toString());
            formData.append('maxPurchases', dialogState.crtBlindPurchases.toString());
            formData.append('sort', dialogState.crtBlindSort.value);
            const config = {
                headers: {
                    'content-type': 'multipart/form-data',
                },
            };
            axios
                .post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/createBlindBox`, formData, config)
                .then((response) => {
                    if (response.data.code === 200) {
                        resolve(true);
                    } else resolve(false);
                });
        });

    const callSetApprovalForAll = async (_operator: string, _approved: boolean) => {
        const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
        const walletConnectWeb3 = new Web3(walletConnectProvider as any);
        const accounts = await walletConnectWeb3.eth.getAccounts();

        let contractAbi = METEAST_CONTRACT_ABI;
        let contractAddress = METEAST_CONTRACT_ADDRESS; // Elastos Testnet
        let meteastContract = new walletConnectWeb3.eth.Contract(contractAbi as AbiItem[], contractAddress);

        const isApproval = await meteastContract.methods.isApprovedForAll(accounts[0], _operator).call();
        const _quoteToken = '0x0000000000000000000000000000000000000000'; // ELA

        if (isApproval === true) {
            console.log('Operator', _operator, ' is already approved');
            createOrder(_quoteToken);
        } else {
            let gasPrice = await walletConnectWeb3.eth.getGasPrice();
            console.log('Gas price:', gasPrice);
            console.log('Sending transaction with account address:', accounts[0]);
            let transactionParams = {
                from: accounts[0],
                gasPrice: gasPrice,
                gas: 5000000,
                value: 0,
            };
            setLoadingDlgOpened(true);
            const timer = setTimeout(() => setLoadingDlgOpened(false), 120000);
            meteastContract.methods
                .setApprovalForAll(_operator, _approved)
                .send(transactionParams)
                .on('transactionHash', (hash: any) => {
                    console.log('transactionHash', hash);
                    setLoadingDlgOpened(false);
                    clearTimeout(timer);
                })
                .on('receipt', (receipt: any) => {
                    console.log('receipt', receipt);
                    enqueueSnackbar('Set approval for all succeed!', {
                        variant: 'success',
                        anchorOrigin: { horizontal: 'right', vertical: 'top' },
                    });
                    createOrder(_quoteToken);
                })
                .on('error', (error: any, receipt: any) => {
                    console.error('error', error);
                    enqueueSnackbar('Set approval for all error!', {
                        variant: 'warning',
                        anchorOrigin: { horizontal: 'right', vertical: 'top' },
                    });
                    setLoadingDlgOpened(false);
                    clearTimeout(timer);
                    setDialogState({ ...dialogState, createBlindBoxDlgOpened: false, errorMessageDlgOpened: true });
                });
        }
    };

    const callCreateOrderForSaleBatch = async (
        _tokenIds: string[],
        _quoteTokens: string[],
        _prices: string[],
        _didUri: string,
        _isBlindBox: boolean,
    ) => {
        const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
        const walletConnectWeb3 = new Web3(walletConnectProvider as any);
        const accounts = await walletConnectWeb3.eth.getAccounts();

        let contractAbi = METEAST_MARKET_CONTRACT_ABI;
        let contractAddress = METEAST_MARKET_CONTRACT_ADDRESS;
        let marketContract = new walletConnectWeb3.eth.Contract(contractAbi as AbiItem[], contractAddress);

        let gasPrice = await walletConnectWeb3.eth.getGasPrice();
        console.log('Gas price:', gasPrice);

        console.log('Sending transaction with account address:', accounts[0]);
        let transactionParams = {
            from: accounts[0],
            gasPrice: gasPrice,
            gas: 5000000,
            value: 0,
        };
        let txHash = '';
        setLoadingDlgOpened(true);
        const timer = setTimeout(() => setLoadingDlgOpened(false), 120000);
        marketContract.methods
            .createOrderForSaleBatch(_tokenIds, _quoteTokens, _prices, _didUri, _isBlindBox)
            .send(transactionParams)
            .on('transactionHash', (hash: any) => {
                console.log('transactionHash', hash);
                txHash = hash;
                setLoadingDlgOpened(false);
                clearTimeout(timer);
            })
            .on('receipt', (receipt: any) => {
                console.log('receipt', receipt);
                enqueueSnackbar('Order for sale succeed!', {
                    variant: 'success',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                setDialogState({
                    ...dialogState,
                    crtBlindTxHash: txHash,
                    createBlindBoxDlgOpened: true,
                    createBlindBoxDlgStep: 2,
                });
            })
            .on('error', (error: any, receipt: any) => {
                console.error('error', error);
                enqueueSnackbar('Order for sale error!', {
                    variant: 'warning',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                setLoadingDlgOpened(false);
                clearTimeout(timer);
                setDialogState({ ...dialogState, createBlindBoxDlgOpened: false, errorMessageDlgOpened: true });
            });
    };

    const createOrder = async (_quoteToken: string) => {
        let _inTokenIds: string[] = dialogState.crtBlindTokenIds.split(';');
        let _inQuoteTokens: string[] = Array(_inTokenIds.length);
        let _inPrices: string[] = Array(_inTokenIds.length);
        _inQuoteTokens.fill(_quoteToken);
        _inPrices.fill(BigInt(dialogState.crtBlindPrice * 1e18).toString());
        await callCreateOrderForSaleBatch(_inTokenIds, _inQuoteTokens, _inPrices, signInDlgState.didUri, true);
    };

    const handleCreateBlindBox = () => {
        if (!dialogState.crtBlindImage) return;
        if (dialogState.crtBlindTxFee > signInDlgState.walletBalance) {
            enqueueSnackbar('Insufficient balance!', {
                variant: 'warning',
                anchorOrigin: { horizontal: 'right', vertical: 'top' },
            });
            return;
        }
        sendIpfsImage(dialogState.crtBlindImage)
            .then((added: any) => {
                const imgUri = `meteast:image:${added.path}`;
                return uploadBlindBoxInfo(imgUri);
            })
            .then((success) => {
                if (success) {
                    enqueueSnackbar('Upload data to backend servce succeed!', {
                        variant: 'success',
                        anchorOrigin: { horizontal: 'right', vertical: 'top' },
                    });
                    return callSetApprovalForAll(METEAST_MARKET_CONTRACT_ADDRESS, true);
                } else {
                    enqueueSnackbar('Upload data to backend servce error!', {
                        variant: 'warning',
                        anchorOrigin: { horizontal: 'right', vertical: 'top' },
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                enqueueSnackbar('Create Blind Box error!', {
                    variant: 'warning',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
            });
    };

    const classes = useStyles();
    return (
        <>
            <Stack
                spacing={5}
                width={400}
                maxHeight={'60vh'}
                sx={{ overflowY: 'auto', overflowX: 'hidden' }}
                className={classes.container}
            >
                <Stack alignItems="center">
                    <PageNumberTypo>2 of 2</PageNumberTypo>
                    <DialogTitleTypo>Check Blind Box Details</DialogTitleTypo>
                </Stack>
                <Stack paddingX={6} paddingY={4} spacing={1} borderRadius={4} sx={{ background: '#F0F1F2' }}>
                    <InfoItemWrapper>
                        <DetailedInfoTitleTypo>Title</DetailedInfoTitleTypo>
                        <Typography fontSize={20} fontWeight={500}>
                            {dialogState.crtBlindTitle}
                        </Typography>
                    </InfoItemWrapper>
                    <InfoItemWrapper>
                        <DetailedInfoTitleTypo>Status</DetailedInfoTitleTypo>
                        <Typography
                            fontSize={14}
                            fontWeight={500}
                            color="#1EA557"
                            sx={{
                                display: 'inline-block',
                                background: '#C9F5DC',
                                paddingX: 1,
                                paddingY: 0.5,
                                borderRadius: 2,
                            }}
                        >
                            {dialogState.crtBlindStatus}
                        </Typography>
                    </InfoItemWrapper>
                    <InfoItemWrapper>
                        <DetailedInfoTitleTypo># Of Copies</DetailedInfoTitleTypo>
                        <DetailedInfoLabelTypo>{dialogState.crtBlindQuantity}</DetailedInfoLabelTypo>
                    </InfoItemWrapper>
                    <InfoItemWrapper>
                        <DetailedInfoTitleTypo>Price</DetailedInfoTitleTypo>
                        <ELAPrice price_ela={dialogState.crtBlindPrice} price_ela_fontsize={14} />
                    </InfoItemWrapper>
                    <InfoItemWrapper>
                        <DetailedInfoTitleTypo>Sale Begins</DetailedInfoTitleTypo>
                        <DetailedInfoLabelTypo>{dialogState.crtBlindSaleBegin.replace('T', ' ')}</DetailedInfoLabelTypo>
                    </InfoItemWrapper>
                    <InfoItemWrapper>
                        <DetailedInfoTitleTypo>Sale Ends</DetailedInfoTitleTypo>
                        <DetailedInfoLabelTypo>{dialogState.crtBlindSaleEnd.replace('T', ' ')}</DetailedInfoLabelTypo>
                    </InfoItemWrapper>
                    <InfoItemWrapper>
                        <DetailedInfoTitleTypo>Max num of purchases</DetailedInfoTitleTypo>
                        <DetailedInfoLabelTypo>{dialogState.crtBlindPurchases}</DetailedInfoLabelTypo>
                    </InfoItemWrapper>
                    <InfoItemWrapper>
                        <DetailedInfoTitleTypo>Description</DetailedInfoTitleTypo>
                        <DetailedInfoLabelTypo textAlign="right">
                            {dialogState.crtBlindDescription}
                        </DetailedInfoLabelTypo>
                    </InfoItemWrapper>
                    <InfoItemWrapper>
                        <DetailedInfoTitleTypo>Author Description</DetailedInfoTitleTypo>
                        <DetailedInfoLabelTypo textAlign="right">
                            {dialogState.crtBlindAuthorDescription}
                        </DetailedInfoLabelTypo>
                    </InfoItemWrapper>
                    {/* <InfoItemWrapper>
                        <DetailedInfoTitleTypo>Items</DetailedInfoTitleTypo>
                        <DetailedInfoLabelTypo textAlign="right">{dialogState.crtBlindTokenIds}</DetailedInfoLabelTypo>
                    </InfoItemWrapper> */}
                </Stack>
                <Stack alignItems="center" spacing={1}>
                    <Typography fontSize={14} fontWeight={600}>
                        Available: {signInDlgState.walletBalance} ELA
                    </Typography>
                    <Stack direction="row" width="100%" spacing={2}>
                        <SecondaryButton
                            fullWidth
                            onClick={() => {
                                setDialogState({
                                    ...dialogState,
                                    createBlindBoxDlgStep: 0,
                                    crtBlindTitle: '',
                                    crtBlindDescription: '',
                                    crtBlindAuthorDescription: '',
                                    crtBlindImage: new File([''], ''),
                                    crtBlindTokenIds: '',
                                    crtBlindStatus: 'offline',
                                    crtBlindQuantity: 0,
                                    crtBlindPrice: 0,
                                    crtBlindSaleBegin: '',
                                    crtBlindSaleEnd: '',
                                    crtBlindLikes: 0,
                                    crtBlindViews: 0,
                                    crtBlindPurchases: 0,
                                    crtBlindSort: { label: '', value: '' },
                                });
                            }}
                        >
                            Back
                        </SecondaryButton>
                        <PrimaryButton fullWidth onClick={handleCreateBlindBox}>
                            Confirm
                        </PrimaryButton>
                    </Stack>
                    <WarningTypo width={240}>
                        In case of payment problems, please contact the official customer service
                    </WarningTypo>
                </Stack>
            </Stack>
            <ModalDialog
                open={loadingDlgOpened}
                onClose={() => {
                    setLoadingDlgOpened(false);
                }}
            >
                <WaitingConfirm />
            </ModalDialog>
        </>
    );
};

export default CheckBlindBoxDetails;
