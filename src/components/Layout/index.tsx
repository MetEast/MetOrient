import React from 'react';
import { Box } from '@mui/material';
import TopNavbar from '../Navbar/TopNavbar';
import BottomNavbar from '../Navbar/BottomNavbar';
import Footer from '../Footer';
import Container from '../Container';
import MintNFTDlgContainer from 'src/components/TransactionDialogs/MintNFT';
import SignInDlgContainer from '../SignInDialog';
import ProgressBar from '../ProgressBar';
import { useDialogContext } from 'src/context/DialogContext';
import CreateBlindBoxDlgContainer from '../TransactionDialogs/CreateBlindBox';

const Layout: React.FC = ({ children }): JSX.Element => {
    const [dialogState] = useDialogContext();

    return (
        <>
            <SignInDlgContainer />
            <ProgressBar isFinished={(dialogState.mintProgress === 0 || dialogState.mintProgress === 100)} progress={ dialogState.mintProgress } />
            <Box
                sx={{
                    width: '100%',
                    paddingY: 3,
                    position: 'fixed',
                    top: 0,
                    background: '#FFFFFF',
                    zIndex: 20,
                    display: { xs: 'none', sm: 'block' },
                }}
            >
                <Container>
                    <TopNavbar />
                </Container>
            </Box>
            <Box paddingTop={{ xs: 4, sm: 12 }} paddingBottom={{ xs: 9, sm: 2 }}>
                <Container>
                    {children}
                    <Footer marginTop={5} />
                </Container>
            </Box>
            <Box
                sx={{
                    width: '100%',
                    position: 'fixed',
                    bottom: 0,
                    background: 'white',
                    zIndex: 20,
                    display: { xs: 'block', sm: 'none' },
                }}
            >
                <Container>
                    <BottomNavbar />
                </Container>
            </Box>
            <MintNFTDlgContainer />
            <CreateBlindBoxDlgContainer />
        </>
    );
};

export default Layout;
