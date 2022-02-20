import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import TopNavbar from '../Navbar/TopNavbar';
import BottomNavbar from '../Navbar/BottomNavbar';
import Footer from '../Footer';
import Container from '../Container';
import MintNFTDlgContainer from 'src/components/TransactionDialogs/MintNFT';
import generatedGitInfo from '../../generatedGitInfo.json';
import SignInDlgContainer from '../SignInDialog';
import { useCookies } from 'react-cookie';
import { useSignInContext } from 'src/context/SignInContext';

const Layout: React.FC = ({ children }): JSX.Element => {    
    const [signInDlgState, setSignInDlgState] = useSignInContext();
    const [didCookies] = useCookies(['METEAST_DID']);
    const [tokenCookies] = useCookies(['METEAST_TOKEN']);
    // useEffect(() => {
    //     // prevent sign-in again after page refresh
    //     if (
    //         tokenCookies.METEAST_TOKEN !== undefined &&
    //         didCookies.METEAST_DID !== undefined &&
    //         signInDlgState.isLoggedIn === false
    //     ) {
    //         // alert(1);
    //         setSignInDlgState({ ...signInDlgState, isLoggedIn: true });
    //     }
    // }, [didCookies, tokenCookies, signInDlgState]);

    return (
        <>
            <SignInDlgContainer />
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
            <Box position="fixed" bottom={0} right={0} padding={1} zIndex={100} sx={{ background: '#EEEEEE' }}>
                <Typography>v1 - {generatedGitInfo.gitCommitHash}</Typography>
            </Box>
            <MintNFTDlgContainer />
        </>
    );
};

export default Layout;
