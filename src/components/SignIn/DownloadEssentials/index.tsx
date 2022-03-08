import React from 'react';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import { Typography, Stack, Button } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { Icon } from '@iconify/react';
import { useSignInContext } from 'src/context/SignInContext';

export interface ComponentProps {}

const GooglePlayLink = 'https://play.google.com/store/apps/details?id=org.elastos.essentials.app&hl=en_US&gl=US';
const AppStoreLink = 'https://apps.apple.com/us/app/elastos-essentials/id1568931743';

const DownloadEssentials: React.FC<ComponentProps> = (): JSX.Element => {
    const [signInDlgState, setSignInDlgState] = useSignInContext();

    return (
        <Stack alignItems="center" width={360} paddingX={4} boxSizing="border-box">
            <DialogTitleTypo>Download Essentials</DialogTitleTypo>
            <Typography width="80%" fontSize={16} fontWeight={400} textAlign="center" marginTop={1}>
                Web3.0 super wallet with Decentralized Identifier (DID)
            </Typography>
            <PrimaryButton
                fullWidth
                sx={{ marginTop: 4 }}
                onClick={() => {
                    window.open(GooglePlayLink, '_blank');
                }}
            >
                <img src="/assets/icons/googleplay.svg" alt="" style={{ marginRight: 8 }} />
                GOOGLE PLAY
            </PrimaryButton>
            <SecondaryButton
                fullWidth
                sx={{ marginTop: 2 }}
                onClick={() => {
                    window.open(AppStoreLink, '_blank');
                }}
            >
                <img src="/assets/icons/appstore.svg" alt="" style={{ marginRight: 8 }} />
                APP STORE
            </SecondaryButton>
            <Button
                sx={{ fontSize: 14, fontWeight: 700, marginTop: 3, color: '#1890FF' }}
                onClick={() => {
                    setSignInDlgState({
                        ...signInDlgState,
                        signInDlgOpened: true,
                        downloadEssentialsDlgOpened: false,
                    });
                }}
            >
                <Icon icon="ph:caret-left-bold" fontSize={16} style={{ marginBottom: 1, marginRight: 4 }} />
                Back
            </Button>
            <Typography fontSize={12} fontWeight={500} color="#B2B7BE" textAlign="center" marginTop={2}>
                We do not own your private keys and cannot access your funds without your confirmation
            </Typography>
        </Stack>
    );
};

export default DownloadEssentials;
