import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo } from '../../styles';
import { SecondaryButton, PinkButton } from 'src/components/Buttons/styles';
import { useSignInContext } from 'src/context/SignInContext';
import { defaultDlgState, useDialogContext } from 'src/context/DialogContext';
import { useSnackbar } from 'notistack';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import { isInAppBrowser } from 'src/services/wallet';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { callContractMethod } from 'src/components/ContractMethod';
import { blankContractMethodParam } from 'src/constants/init-constants';

export interface ComponentProps {}

const CancelBid: React.FC<ComponentProps> = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const { enqueueSnackbar } = useSnackbar();
    const [onProgress, setOnProgress] = useState<boolean>(false);
    const walletConnectProvider: WalletConnectProvider = isInAppBrowser()
        ? window.elastos.getWeb3Provider()
        : essentialsConnector.getWalletConnectProvider();
    const { library } = useWeb3React<Web3Provider>();
    const walletConnectWeb3 = new Web3(
        signInDlgState.loginType === '1' ? (walletConnectProvider as any) : (library?.provider as any),
    );

    const handleCancelBid = () => {
        if (dialogState.cancelBidTxFee > signInDlgState.walletBalance) {
            enqueueSnackbar('Insufficient balance!', {
                variant: 'error',
                anchorOrigin: { horizontal: 'right', vertical: 'top' },
            });
            return;
        }
        setOnProgress(true);
        setDialogState({
            ...dialogState,
            waitingConfirmDlgOpened: true,
            waitingConfirmDlgTimer: setTimeout(() => {
                setDialogState({
                    ...defaultDlgState,
                    errorMessageDlgOpened: true,
                });
            }, 120000),
        });

        callContractMethod(walletConnectWeb3, {
            ...blankContractMethodParam,
            contractType: 2,
            method: 'cancelOrder',
            price: '0',
            orderId: dialogState.cancelBidOrderId,
        })
            .then((txHash: string) => {
                enqueueSnackbar('Cancel bid succeed!', {
                    variant: 'success',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                setDialogState({
                    ...dialogState,
                    cancelSaleDlgOpened: true,
                    cancelSaleDlgStep: 1,
                    cancelSaleTxHash: txHash,
                    waitingConfirmDlgOpened: false,
                });
            })
            .catch((error) => {
                enqueueSnackbar(`Cancel bid error.`, {
                    variant: 'error',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                setDialogState({
                    ...dialogState,
                    cancelSaleDlgOpened: false,
                    waitingConfirmDlgOpened: false,
                    errorMessageDlgOpened: true,
                });
            })
            .finally(() => {
                setOnProgress(false);
            });
    };

    return (
        <Stack spacing={5} width={320}>
            <Stack alignItems="center">
                <DialogTitleTypo>Are you sure?</DialogTitleTypo>
                <Typography fontSize={16} fontWeight={400} marginTop={1}>
                    Do you really want to cancel your bid?
                </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <SecondaryButton
                    fullWidth
                    onClick={() => {
                        setDialogState({
                            ...dialogState,
                            cancelBidTxFee: 0,
                            cancelBidOrderId: '',
                            cancelBidTxHash: '',
                            cancelBidDlgOpened: false,
                            cancelBidDlgStep: 0,
                        });
                    }}
                >
                    Back
                </SecondaryButton>
                <PinkButton fullWidth disabled={onProgress} onClick={handleCancelBid}>
                    Cancel Bid
                </PinkButton>
            </Stack>
        </Stack>
    );
};

export default CancelBid;
