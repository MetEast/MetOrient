import React from 'react';
import { Box, Typography, Stack, IconButton, Link, Button } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { TypeMenuItem } from 'src/types/layout-types';
import PageButton from './PageButton';
import { useNavigate } from 'react-router-dom';
import { useSignInContext } from 'src/context/SignInContext';
import { Icon } from '@iconify/react';
import { useDialogContext } from 'src/context/DialogContext';
import { essentialsConnector, isUsingEssentialsConnector } from '../ConnectWallet/EssentialsConnectivity';
import { PrimaryButton } from 'src/components/Buttons/styles';
import { NotificationTypo } from './styles';
import ModalDialog from 'src/components/ModalDialog';

// dialogs for test
// import BuyBlindBox from 'src/components/TransactionDialogs/BuyBlindBox/BuyBlindBox';
// import OrderSummary from 'src/components/TransactionDialogs/BuyBlindBox/OrderSummary';
// import PurchaseSuccess from 'src/components/TransactionDialogs/BuyBlindBox/PurchaseSuccess';
// import BlindBoxContents from 'src/components/TransactionDialogs/BuyBlindBox/BlindBoxContents';
// import MintNFT from 'src/components/TransactionDialogs/MintNFT/MintNFT';
// import CheckNFTDetails from 'src/components/TransactionDialogs/MintNFT/CheckNFTDetails';
// import NFTMinted from 'src/components/TransactionDialogs/MintNFT/NFTMinted';
// import PlaceBid from 'src/components/TransactionDialogs/PlaceBid/PlaceBid';
// import ReviewBidDetails from 'src/components/TransactionDialogs/PlaceBid/ReviewBidDetails';
// import BidPlaceSuccess from 'src/components/TransactionDialogs/PlaceBid/BidPlaceSuccess';
// import UpdateBid from 'src/components/TransactionDialogs/UpdateBid/UpdateBid';
// import BidUpdateSuccess from 'src/components/TransactionDialogs/UpdateBid/BidUpdateSuccess';
// import CancelBid from 'src/components/TransactionDialogs/CancelBid/CancelBid';
// import CancelBidSuccess from 'src/components/TransactionDialogs/CancelBid/CancelBidSuccess';
// import ChangePrice from 'src/components/TransactionDialogs/ChangePrice/ChangePrice';
// import PriceChangeSuccess from 'src/components/TransactionDialogs/ChangePrice/PriceChangeSuccess';
// import CancelSale from 'src/components/TransactionDialogs/CancelSale/CancelSale';
// import CancelSaleSuccess from 'src/components/TransactionDialogs/CancelSale/CancelSaleSuccess';
// import EnterSaleDetails from 'src/components/TransactionDialogs/ListNFT/EnterSaleDetails';
// import CheckSaleDetails from 'src/components/TransactionDialogs/ListNFT/CheckSaleDetails';
// import ArtworkIsNowForSale from 'src/components/TransactionDialogs/ListNFT/ArtworkIsNowForSale';
// import AcceptBid from 'src/components/TransactionDialogs/AcceptBid/AcceptBid';
// import SaleSuccess from 'src/components/TransactionDialogs/AcceptBid/SaleSuccess';
// import BuyNow from 'src/components/TransactionDialogs/BuyNow/BuyNow';
// import PurchaseSuccess from 'src/components/TransactionDialogs/BuyNow/PurchaseSuccess';
import WaitingConfirm from 'src/components/TransactionDialogs/Others/WaitingConfirm';
// import ErrorMessage from 'src/components/TransactionDialogs/Others/ErrorMessage';
// import CreateBlindBox from 'src/components/TransactionDialogs/CreateBlindBox/CreateBlindBox';
// import CheckBlindBoxDetails from 'src/components/TransactionDialogs/CreateBlindBox/CheckBlindBoxDetails';
// import BlindBoxCreateSuccess from 'src/components/TransactionDialogs/CreateBlindBox/BlindBoxCreateSuccess';
// import CreateBanner from 'src/components/TransactionDialogs/CreateBanner/CreateBanner';
// import YourEarnings from 'src/components/profile/YourEarnings';
// import AllTransactions from 'src/components/profile/AllTransactions';
// import ReceivedBids from 'src/components/profile/ReceivedBids';
// import AllBids from 'src/components/TransactionDialogs/AllBids/AllBids';
// import NoBids from 'src/components/TransactionDialogs/AllBids/NoBids';

interface ComponentProps {
    mobile?: boolean;
}

const Navbar: React.FC<ComponentProps> = ({ mobile = false }): JSX.Element => {
    const [signInDlgState, setSignInDlgState] = useSignInContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [dialogState, setDialogState] = useDialogContext();
    const [testdlgOpen, setTestdlgOpen] = React.useState<boolean>(false);
    const testDlgShow = false;

    const menuItemsList: Array<TypeMenuItem> = [
        {
            title: 'Home',
            url: '/',
            icon: <Icon icon="ph:house" fontSize={20} style={{ marginRight: mobile ? 0 : 6, marginBottom: 2 }} />,
        },
        {
            title: 'Products',
            url: '/products',
            icon: (
                <Icon icon="ph:image-square" fontSize={20} style={{ marginRight: mobile ? 0 : 6, marginBottom: 2 }} />
            ),
        },
        {
            title: 'Blind Boxes',
            url: '/blind-box',
            icon: <Icon icon="ph:cube" fontSize={20} style={{ marginRight: mobile ? 0 : 6, marginBottom: 2 }} />,
        },
    ];

    const SignOutWithEssentials = async () => {
        console.log('Signing out user. Deleting session info, auth token');
        document.cookie += `METEAST_TOKEN=; Path=/; Expires=${new Date().toUTCString()};`;
        document.cookie += `METEAST_DID=; Path=/; Expires=${new Date().toUTCString()};`;
        setSignInDlgState({ ...signInDlgState, isLoggedIn: false });
        try {
            if (isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession()) {
                await essentialsConnector.getWalletConnectProvider().disconnect();
                // await essentialsConnector.disconnectWalletConnect();
            }
        } catch (e) {
            console.log(e);
        }
        if (location.pathname.indexOf('/profile') !== -1 || location.pathname.indexOf('/mynft') !== -1) {
            navigate('/');
        }
        window.location.reload();
    };

    const pageButtons = menuItemsList.map((item, index) => (
        <PageButton
            key={`navbaritem-${index}`}
            data={item}
            isSelected={item.url === location.pathname}
            mobile={mobile}
        />
    ));

    const menuButtons = signInDlgState.isLoggedIn ? (
        <>
            <Box position="relative">
                <IconButton>
                    <Icon icon="ph:chat-circle" fontSize={20} color="black" />
                </IconButton>
                <NotificationTypo>2</NotificationTypo>
            </Box>
            <IconButton
                onClick={() => {
                    navigate('/profile');
                }}
            >
                <Icon icon="ph:user" fontSize={20} color="black" />
            </IconButton>
            <IconButton onClick={SignOutWithEssentials}>
                <Icon icon="ph:sign-out" fontSize={20} color="black" />
            </IconButton>
            <PrimaryButton
                size="small"
                onClick={() => {
                    if (signInDlgState.isLoggedIn)
                        setDialogState({ ...dialogState, createNFTDlgOpened: true, createNFTDlgStep: 0 });
                    else setSignInDlgState({ ...signInDlgState, signInDlgOpened: true });
                }}
                sx={{ paddingX: mobile ? 0 : 2, minWidth: 40 }}
            >
                <Icon icon="ph:sticker" fontSize={20} color="white" style={{ marginBottom: 2 }} />
                {!mobile && (
                    <Typography fontWeight={700} color="white" marginLeft={0.5}>
                        Create NFT
                    </Typography>
                )}
            </PrimaryButton>
            {/* <PrimaryButton
                size="small"
                sx={{ paddingX: 2 }}
                onClick={() => {
                    navigate('/admin/nfts');
                }}
            >
                {mobile ? 'admin' : 'admin area'}
                <Icon
                    icon="ph:arrow-square-out"
                    fontSize={20}
                    color="white"
                    style={{ marginLeft: 4, marginBottom: 4 }}
                />
            </PrimaryButton> */}
            <PrimaryButton
                size="small"
                sx={{ paddingX: 2 }}
                onClick={() => {
                    if (signInDlgState.isLoggedIn)
                        setDialogState({ ...dialogState, createBlindBoxDlgOpened: true, createBlindBoxDlgStep: 0 });
                    else setSignInDlgState({ ...signInDlgState, signInDlgOpened: true });
                }}
            >
                <Icon icon="ph:plus" fontSize={20} color="white" style={{ marginBottom: 4, marginRight: 4 }} />
                {mobile ? 'Blind Box' : 'New Blind Box'}
            </PrimaryButton>
        </>
    ) : (
        <PrimaryButton
            size="small"
            sx={{ paddingX: 2 }}
            onClick={() => {
                setSignInDlgState({ ...signInDlgState, signInDlgOpened: true });
            }}
        >
            <Icon icon="ph:sign-in" fontSize={20} color="white" style={{ marginRight: 4, marginBottom: 2 }} />
            Login
        </PrimaryButton>
    );

    return (
        <>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                paddingTop={mobile ? 0.5 : 0}
                paddingBottom={mobile ? 1.5 : 0}
            >
                {!mobile && (
                    <Link href="/">
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <img src="/assets/images/header/logo.svg" alt="" />
                            <Box display={{ xs: 'none', lg: 'block' }}>
                                <img src="/assets/images/header/meteast_label.svg" alt="" />
                            </Box>
                        </Stack>
                    </Link>
                )}
                {mobile ? (
                    pageButtons
                ) : (
                    <Stack direction="row" spacing={3}>
                        {pageButtons}
                    </Stack>
                )}
                {mobile ? (
                    menuButtons
                ) : (
                    <Stack direction="row" alignItems="center" spacing={2}>
                        {menuButtons}
                        {testDlgShow && (
                            <Button
                                onClick={() => {
                                    setTestdlgOpen(true);
                                }}
                            >
                                DlgTest
                            </Button>
                        )}
                    </Stack>
                )}
            </Stack>
            {testDlgShow && (
                <ModalDialog
                    open={testdlgOpen}
                    onClose={() => {
                        setTestdlgOpen(false);
                    }}
                >
                    <WaitingConfirm />
                </ModalDialog>
            )}
        </>
    );
};

export default Navbar;
