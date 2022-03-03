import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import ViewOnExplorerButton from 'src/components/Buttons/ViewOnExplorerButton';
import { useDialogContext } from 'src/context/DialogContext';

export interface ComponentProps {}

const NFTMinted: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    const navigate = useNavigate();

    return (
        <Stack spacing={5} width={320}>
            <Stack alignItems="center">
                <DialogTitleTypo>Your NFT Has Been Minted!</DialogTitleTypo>
                <Typography fontSize={16} fontWeight={400} textAlign="center">
                    Congratulations! Your artwork has officially been minted as NFT on Elastos Smart Chain (ESC)
                </Typography>
            </Stack>
            <Stack>
                <img src="/assets/images/transactionsdlg/mintnft-nft-minted.svg" alt="" />
            </Stack>
            <Stack alignItems="center" spacing={2}>
                <ViewOnExplorerButton txHash={dialogState.mintTxHash} />
                <Stack direction="row" width="100%" spacing={2}>
                    <SecondaryButton
                        fullWidth
                        onClick={() => {
                            setDialogState({
                                ...dialogState,
                                mintTitle: '',
                                // mintAuthor: '',
                                mintIntroduction: '',
                                mintCategory: { label: '', value: '' },
                                mintFile: new File([''], ''),
                                mintTXFee: 0,
                                mintTxHash: "",
                                mintTokenId: "",
                                mintTokenUri: "",
                                mintDidUri: "",
                                createNFTDlgOpened: false,
                            });
                            navigate('/profile');
                            window.location.reload();
                        }}
                    >
                        Close
                    </SecondaryButton>
                    <PrimaryButton
                        fullWidth
                        onClick={() => {
                            setDialogState({ ...dialogState, createNFTDlgOpened: true, createNFTDlgStep: 3 });
                        }}
                    >
                        Sell
                    </PrimaryButton>
                </Stack>
            </Stack>
        </Stack>
    );
};

export default NFTMinted;
