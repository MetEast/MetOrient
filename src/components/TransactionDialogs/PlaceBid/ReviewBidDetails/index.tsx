import React, { useState } from 'react';
import { Stack, Typography, Grid } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo, DetailedInfoTitleTypo, DetailedInfoLabelTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import WarningTypo from '../../components/WarningTypo';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import { useSnackbar } from 'notistack';
import { AbiItem } from 'web3-utils';
import { METEAST_MARKET_CONTRACT_ABI, METEAST_MARKET_CONTRACT_ADDRESS } from 'src/contracts/METMarket';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import ModalDialog from 'src/components/ModalDialog';
import WaitingConfirm from '../../Others/WaitingConfirm';

export interface ComponentProps {}

const ReviewBidDetails: React.FC<ComponentProps> = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const { enqueueSnackbar } = useSnackbar();
    const [loadingDlgOpened, setLoadingDlgOpened] = useState<boolean>(false);

    const callBidForOrder = async (_orderId: string, _value: string, _didUri: string) => {
        const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
        const walletConnectWeb3 = new Web3(walletConnectProvider as any);
        const accounts = await walletConnectWeb3.eth.getAccounts();

        const contractAbi = METEAST_MARKET_CONTRACT_ABI;
        const contractAddress = METEAST_MARKET_CONTRACT_ADDRESS;
        const marketContract = new walletConnectWeb3.eth.Contract(contractAbi as AbiItem[], contractAddress);

        const gasPrice = await walletConnectWeb3.eth.getGasPrice();
        console.log('Gas price:', gasPrice);

        console.log('Sending transaction with account address:', accounts[0]);
        const transactionParams = {
            from: accounts[0],
            gasPrice: gasPrice,
            gas: 5000000,
            value: _value, // correct?
        };
        let txHash = '';

        setLoadingDlgOpened(true);
        const timer = setTimeout(() => setLoadingDlgOpened(false), 120000);
        marketContract.methods
            .bidForOrder(_orderId, _value, _didUri)
            .send(transactionParams)
            .on('transactionHash', (hash: any) => {
                console.log('transactionHash', hash);
                txHash = hash;
                setLoadingDlgOpened(false);
                clearTimeout(timer);
            })
            .on('receipt', (receipt: any) => {
                console.log('receipt', receipt);
                enqueueSnackbar('Place bid succeed!', {
                    variant: 'success',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                setDialogState({ ...dialogState, placeBidDlgOpened: true, placeBidDlgStep: 2, placeBidTxHash: txHash });
            })
            .on('error', (error: any, receipt: any) => {
                console.error('error', error);
                enqueueSnackbar('Place bid error!', {
                    variant: 'warning',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                setLoadingDlgOpened(false);
                clearTimeout(timer);
                setDialogState({ ...dialogState, placeBidDlgOpened: false, errorMessageDlgOpened: true });
            });
    };

    const handlePlaceBid = () => {
        callBidForOrder(
            dialogState.placeBidOrderId,
            BigInt(dialogState.placeBidAmount * 1e18).toString(),
            signInDlgState.didUri
        );
    };
    return (
        <>
            <Stack spacing={5} width={340}>
                <Stack alignItems="center">
                    <PageNumberTypo>2 of 2</PageNumberTypo>
                    <DialogTitleTypo>Review Bid Details</DialogTitleTypo>
                </Stack>
                <Stack alignItems="center" paddingX={6} paddingY={4} borderRadius={4} sx={{ background: '#F0F1F2' }}>
                    <Grid container rowSpacing={0.5}>
                        <Grid item xs={6}>
                            <DetailedInfoTitleTypo>Item</DetailedInfoTitleTypo>
                        </Grid>
                        <Grid item xs={6}>
                            <DetailedInfoLabelTypo>{dialogState.placeBidName}</DetailedInfoLabelTypo>
                        </Grid>
                        <Grid item xs={6}>
                            <DetailedInfoTitleTypo>Bid Amount</DetailedInfoTitleTypo>
                        </Grid>
                        <Grid item xs={6}>
                            <DetailedInfoLabelTypo>{dialogState.placeBidAmount} ELA</DetailedInfoLabelTypo>
                        </Grid>
                        <Grid item xs={6}>
                            <DetailedInfoTitleTypo>Expires in</DetailedInfoTitleTypo>
                        </Grid>
                        <Grid item xs={6}>
                            <DetailedInfoLabelTypo>{dialogState.placeBidExpire.value}</DetailedInfoLabelTypo>
                        </Grid>
                        <Grid item xs={6}>
                            <DetailedInfoTitleTypo>Tx Fees</DetailedInfoTitleTypo>
                        </Grid>
                        <Grid item xs={6}>
                            <DetailedInfoLabelTypo>{dialogState.placeBidTxFee} ELA</DetailedInfoLabelTypo>
                        </Grid>
                        <Grid item xs={6}>
                            <DetailedInfoTitleTypo>Total</DetailedInfoTitleTypo>
                        </Grid>
                        <Grid item xs={6}>
                            <DetailedInfoLabelTypo sx={{ fontWeight: 700 }}>
                                {dialogState.placeBidAmount + dialogState.placeBidTxFee} ELA
                            </DetailedInfoLabelTypo>
                        </Grid>
                    </Grid>
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
                                    placeBidDlgOpened: true,
                                    placeBidDlgStep: 0,
                                    placeBidAmount: 0,
                                    placeBidExpire: { label: '', value: '' },
                                    placeBidTxHash: '',
                                });
                            }}
                        >
                            Back
                        </SecondaryButton>
                        <PrimaryButton fullWidth onClick={handlePlaceBid}>
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

export default ReviewBidDetails;
