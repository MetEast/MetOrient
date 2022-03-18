import React, { useEffect, useState } from 'react';
import { SignInState, useSignInContext } from 'src/context/SignInContext';
import ModalDialog from 'src/components/ModalDialog';
import ConnectDID from 'src/components/SignIn/ConnectDID';
import DownloadEssentials from 'src/components/SignIn/DownloadEssentials';
import jwtDecode from 'jwt-decode';
import { DID } from '@elastosfoundation/elastos-connectivity-sdk-js';
import {
    essentialsConnector,
    isUsingEssentialsConnector,
    initConnectivitySDK,
} from 'src/components/ConnectWallet/EssentialsConnectivity';
import { injected, walletconnect } from 'src/components/ConnectWallet/connectors';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { useCookies } from 'react-cookie';
import { useSnackbar } from 'notistack';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    getEssentialsWalletBalance,
    getDidUri,
    resetWalletConnector,
    getWalletBalance,
    isInAppBrowser,
    getChainGasPrice,
} from 'src/services/wallet';
import { UserTokenType } from 'src/types/auth-types';
import { useDialogContext } from 'src/context/DialogContext';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import Web3 from 'web3';
import { Web3Provider } from '@ethersproject/providers';
import SnackMessage from 'src/components/SnackMessage';

export interface ComponentProps {}

const SignInDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    // alert(1)
    const navigate = useNavigate();
    const location = useLocation();
    const [signInDlgState, setSignInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const [cookies, setCookies] = useCookies(['METEAST_LINK', 'METEAST_TOKEN']);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { activate, active, library, chainId, account } = useWeb3React<Web3Provider>();
    const [activatingConnector, setActivatingConnector] = useState<InjectedConnector | WalletConnectConnector | null>(
        null,
    );
    const [walletConnectProvider] = useState<WalletConnectProvider>(essentialsConnector.getWalletConnectProvider());
    // const [walletConnectProvider] = useState<WalletConnectProvider>(
    //     isInAppBrowser() ? window.elastos.getWeb3Provider() : essentialsConnector.getWalletConnectProvider(),
    // );

    const [_signInState, _setSignInState] = useState<SignInState>(signInDlgState);
    let linkType = cookies.METEAST_LINK;

    const showSucceedSnackBar = () => {
        enqueueSnackbar('', {
            anchorOrigin: { horizontal: 'right', vertical: 'top' },
            autoHideDuration: 3000,
            content: (key) => <SnackMessage id={key} message="Login succeed." variant="success" />,
        });
    };

    // ------------------------------ MM Connection ------------------------------ //
    const signInWithWallet = async (wallet: string) => {
        let currentConnector: any = null;
        if (wallet === 'MM') {
            currentConnector = injected;
            await activate(currentConnector);
        } else if (wallet === 'WC') {
            currentConnector = walletconnect;
            resetWalletConnector(currentConnector);
            await activate(currentConnector);
        }
        const retAddress = await currentConnector?.getAccount();
        if (retAddress !== undefined && retAddress !== null) {
            let unmounted = false;
            const reqBody = {
                isMetaMask: 1,
                did: retAddress,
                name: '',
                avatar: '',
                description: '',
            };
            fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
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
                            if (currentConnector === injected) {
                                linkType = 2;
                            } else if (currentConnector === walletconnect) {
                                linkType = 3;
                            }
                            setActivatingConnector(currentConnector);
                            const token = data.token;
                            setCookies('METEAST_LINK', linkType, { path: '/', sameSite: 'none', secure: true });
                            setCookies('METEAST_TOKEN', token, { path: '/', sameSite: 'none', secure: true });
                            const user: UserTokenType = jwtDecode(token);
                            console.log('Sign in with MM: setting user to:', user);
                            _setSignInState((prevState: SignInState) => {
                                const _state = { ...prevState };
                                _state.isLoggedIn = true;
                                _state.loginType = '2';
                                _state.signInDlgOpened = false;
                                _state.walletAccounts = [retAddress];
                                _state.token = token;
                                _state.userDid = user.did;
                                if (user.name !== '' && user.name !== undefined) _state.userName = user.name;
                                if (user.description !== '' && user.description !== undefined)
                                    _state.userDescription = user.description;
                                if (user.avatar !== '' && user.avatar !== undefined) _state.userAvatar = user.avatar;
                                if (user.coverImage !== '' && user.coverImage !== undefined)
                                    _state.userCoverImage = user.coverImage;
                                _state.userRole = parseInt(user.role);
                                return _state;
                            });
                            showSucceedSnackBar();
                        }
                    } else {
                        console.log(data);
                    }
                })
                .catch((error) => {
                    if (!unmounted) {
                        console.log(error);
                        enqueueSnackbar(
                            `Failed to call the backend API. Check your connectivity and make sure ${process.env.REACT_APP_BACKEND_URL} is reachable.`,
                            { variant: 'error', anchorOrigin: { horizontal: 'right', vertical: 'top' } },
                        );
                        try {
                            currentConnector
                                .deactivate()
                                .then((res: any) => {})
                                .catch((e: any) => {
                                    console.log(e);
                                });
                        } catch (e) {
                            console.error('Error while trying to disconnect wallet connect session', e);
                        }
                    }
                });
            return () => {
                unmounted = true;
            };
        }
    };

    const signOutWithWallet = async () => {
        if (activatingConnector !== null) activatingConnector.deactivate();
        document.cookie += `METEAST_LINK=; Path=/; Expires=${new Date().toUTCString()};`;
        document.cookie += `METEAST_TOKEN=; Path=/; Expires=${new Date().toUTCString()};`;
        setActivatingConnector(null);
        if (location.pathname.indexOf('/profile') !== -1 || location.pathname.indexOf('/mynft') !== -1) {
            navigate('/');
        }
        window.location.reload();
    };

    // ------------------------------ EE Connection ------------------------------ //
    const signInWithEssentials = async () => {
        initConnectivitySDK();
        const didAccess = new DID.DIDAccess();
        let presentation;
        console.log('Trying to sign in using the connectivity SDK');
        try {
            // presentation = await didAccess.getCredentials({
            //     claims: {
            //         name: false,
            //         avatar: {
            //             required: false,
            //             reason: 'For test',
            //         },
            //         description: {
            //             required: false,
            //             reason: 'For test',
            //         },
            //     },
            // });
            presentation = await didAccess.requestCredentials({
                claims: [
                    DID.simpleIdClaim('Your name', 'name', false),
                    DID.simpleIdClaim('Your description', 'description', false),
                ],
            });
        } catch (e) {
            console.warn('Error while getting credentials', e);
            try {
                await essentialsConnector.getWalletConnectProvider().disconnect();
            } catch (e) {
                console.error('Error while trying to disconnect wallet connect session', e);
            }
            return;
        }

        if (presentation) {
            let unmounted = false;
            const did = presentation.getHolder().getMethodSpecificId() || '';
            fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(presentation.toJSON()),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.code === 200) {
                        if (!unmounted) {
                            const token = data.token;
                            linkType = '1';
                            setCookies('METEAST_LINK', '1', { path: '/', sameSite: 'none', secure: true });
                            setCookies('METEAST_TOKEN', token, { path: '/', sameSite: 'none', secure: true });
                            const user: UserTokenType = jwtDecode(token);
                            console.log('Sign in with EE: setting user to:', user);
                            console.log(did);
                            _setSignInState((prevState: SignInState) => {
                                const _state = { ...prevState };
                                _state.isLoggedIn = true;
                                _state.loginType = '1';
                                _state.userDid = user.did;
                                if (user.name !== '' && user.name !== undefined) _state.userName = user.name;
                                if (user.description !== '' && user.description !== undefined)
                                    _state.userDescription = user.description;
                                if (user.avatar !== '' && user.avatar !== undefined) _state.userAvatar = user.avatar;
                                if (user.coverImage !== '' && user.coverImage !== undefined)
                                    _state.userCoverImage = user.coverImage;
                                _state.userRole = parseInt(user.role);
                                _state.signInDlgOpened = false;
                                if (isInAppBrowser()) {
                                    const inAppProvider: any = window.elastos.getWeb3Provider();
                                    _state.walletAccounts = [inAppProvider.address];
                                    const inAppWeb3 = new Web3(inAppProvider as any);
                                    inAppWeb3.eth.getBalance(inAppProvider.address).then((balance: string) => {
                                        _state.walletBalance = parseFloat((parseFloat(balance) / 1e18).toFixed(2));
                                    });
                                    inAppWeb3.eth.getChainId().then((chainId: number) => {
                                        _state.chainId = chainId;
                                    });
                                }
                                return _state;
                            });
                            showSucceedSnackBar();
                        }
                    } else {
                        console.log(data);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    enqueueSnackbar(
                        `Failed to call the backend API. Check your connectivity and make sure ${process.env.REACT_APP_BACKEND_URL} is reachable.`,
                        { variant: 'error', anchorOrigin: { horizontal: 'right', vertical: 'top' } },
                    );
                    try {
                        essentialsConnector
                            .getWalletConnectProvider()
                            .disconnect()
                            .then((res) => {})
                            .catch((e) => {
                                console.log(e);
                            });
                    } catch (e) {
                        console.error('Error while trying to disconnect wallet connect session', e);
                    }
                });
            return () => {
                unmounted = true;
            };
        }
    };

    const signOutWithEssentialsWithoutRefresh = async () => {
        console.log('Signing out user. Deleting session info, auth token');
        setSignInDlgState({ ...signInDlgState, isLoggedIn: false });
        document.cookie += `METEAST_LINK=; Path=/; Expires=${new Date().toUTCString()};`;
        document.cookie += `METEAST_TOKEN=; Path=/; Expires=${new Date().toUTCString()};`;
        try {
            if (isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession())
                await essentialsConnector.getWalletConnectProvider().disconnect();
            if (isInAppBrowser() && (await window.elastos.getWeb3Provider().isConnected()))
                await window.elastos.getWeb3Provider().disconnect();
        } catch (e) {
            console.error('Error while disconnecting the wallet', e);
        }
    };

    const signOutWithEssentials = async () => {
        console.log('Signing out user. Deleting session info, auth token');
        setSignInDlgState({ ...signInDlgState, isLoggedIn: false, loginType: '', signOut: false });
        document.cookie += `METEAST_LINK=; Path=/; Expires=${new Date().toUTCString()};`;
        document.cookie += `METEAST_TOKEN=; Path=/; Expires=${new Date().toUTCString()};`;
        try {
            if (isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession())
                await essentialsConnector.getWalletConnectProvider().disconnect();
            if (isInAppBrowser() && (await window.elastos.getWeb3Provider().isConnected()))
                await window.elastos.getWeb3Provider().disconnect();
        } catch (e) {
            console.error('Error while disconnecting the wallet', e);
        }
        if (location.pathname.indexOf('/profile') !== -1 || location.pathname.indexOf('/mynft') !== -1) {
            navigate('/');
        }
        window.location.reload();
    };

    // ------------------------------ Event Listener ------------------------------ //
    useEffect(() => {
        // EE
        const handleEEAccountsChanged = (accounts: string[]) => {
            getEssentialsWalletBalance().then((balance: string) => {
                _setSignInState((prevState: SignInState) => {
                    const _state = { ...prevState };
                    _state.walletAccounts = accounts;
                    _state.walletBalance = parseFloat((parseFloat(balance) / 1e18).toFixed(2));
                    return _state;
                });
            });
        };
        const handleEEChainChanged = (chainId: number) => {
            _setSignInState((prevState: SignInState) => {
                const _state = { ...prevState };
                _state.chainId = chainId;
                return _state;
            });
        };
        const handleEEDisconnect = (code: number, reason: string) => {
            console.log('Disconnect code: ', code, ', reason: ', reason);
            signOutWithEssentials();
        };
        const handleEEError = (code: number, reason: string) => {
            console.error(code, reason);
        };

        if (isInAppBrowser()) {
            _setSignInState((prevState: SignInState) => {
                const _state = { ...prevState };
                const inAppProvider: any = window.elastos.getWeb3Provider();
                _state.walletAccounts = [inAppProvider.address];
                const inAppWeb3 = new Web3(inAppProvider as any);
                inAppWeb3.eth.getBalance(inAppProvider.address).then((balance: string) => {
                    _state.walletBalance = parseFloat((parseFloat(balance) / 1e18).toFixed(2));
                });
                inAppWeb3.eth.getChainId().then((chainId: number) => {
                    _state.chainId = chainId;
                });
                return _state;
            });
        } else {
            // Subscribe to accounts change
            walletConnectProvider.on('accountsChanged', handleEEAccountsChanged);
            // Subscribe to chainId change
            walletConnectProvider.on('chainChanged', handleEEChainChanged);
            // Subscribe to session disconnection
            walletConnectProvider.on('disconnect', handleEEDisconnect);
            // Subscribe to session disconnection
            walletConnectProvider.on('error', handleEEError);
        }
        // MM
        if (linkType === undefined) {
            if (active) {
                // alert('new sign in');
                if (account) {
                    const timer = setTimeout(() => {
                        getWalletBalance(library, account).then((balance: string) => {
                            _setSignInState((prevState: SignInState) => {
                                const _state = { ...prevState };
                                _state.walletBalance = parseFloat((parseFloat(balance) / 1e18).toFixed(2));
                                clearTimeout(timer);
                                return _state;
                            });
                        });
                    }, 100);
                }
            } else {
                // alert('log out');
            }
        } else if (linkType === '2') {
            if (!active) {
                if (activatingConnector !== null) {
                    // alert('disconnect');
                    signOutWithWallet();
                } else {
                    // alert('refresh');
                    const timer = setTimeout(async () => {
                        if (linkType === '2') {
                            setActivatingConnector(injected);
                            await activate(injected);
                        } else if (linkType === '3') {
                            setActivatingConnector(walletconnect);
                            await activate(walletconnect);
                        }
                        clearTimeout(timer);
                    }, 0);
                }
            } else {
                if (library) {
                    // alert('library');
                    _setSignInState((prevState: SignInState) => {
                        const _state = { ...prevState };
                        _state.chainId = chainId || 0;
                        _state.walletAccounts = account ? [account] : [];
                        return _state;
                    });
                    if (account) {
                        // must be placed here
                        getWalletBalance(library, account).then((balance: string) => {
                            _setSignInState((prevState: SignInState) => {
                                const _state = { ...prevState };
                                _state.walletBalance = parseFloat((parseFloat(balance) / 1e18).toFixed(2));
                                return _state;
                            });
                        });
                    }
                } else {
                    // alert('no library');
                }
            }
        }
        return () => {
            if (walletConnectProvider.removeListener) {
                walletConnectProvider.removeListener('accountsChanged', handleEEAccountsChanged);
                walletConnectProvider.removeListener('chainChanged', handleEEChainChanged);
                walletConnectProvider.removeListener('disconnect', handleEEDisconnect);
                walletConnectProvider.removeListener('error', handleEEError);
            }
        };
    }, [walletConnectProvider, chainId, account, active, library]);

    // signInDlgContext track
    useEffect(() => {
        const user: UserTokenType =
            cookies.METEAST_TOKEN === undefined
                ? { did: '', name: '', description: '', avatar: '', coverImage: '', role: '', exp: 0, iat: 0 }
                : jwtDecode(cookies.METEAST_TOKEN);
        getDidUri(user.did, '', user.name).then((didUri: string) => {
            setSignInDlgState({
                ..._signInState,
                token: cookies.METEAST_TOKEN,
                didUri: didUri,
                userDid: user.did,
                userName: user.name,
                userDescription: user.description,
                userAvatar: user.avatar,
                userCoverImage: user.coverImage,
                userRole: parseInt(user.role),
            });
        });
    }, [_signInState]);

    // listen for disconnect
    useEffect(() => {
        if (signInDlgState.isLoggedIn && signInDlgState.signOut) {
            if (signInDlgState.loginType === '1') signOutWithEssentials();
            else signOutWithWallet();
        }
    }, [signInDlgState]);

    // update wallet balance after every transactions
    useEffect(() => {
        if (linkType === '1') {
            getEssentialsWalletBalance().then((balance: string) => {
                _setSignInState((prevState: SignInState) => {
                    const _state = { ...prevState };
                    _state.walletBalance = parseFloat((parseFloat(balance) / 1e18).toFixed(2));
                    return _state;
                });
            });
        } else {
            _setSignInState((prevState: SignInState) => {
                const _state = { ...prevState };
                _state.chainId = chainId || 0;
                if (!account) _state.walletBalance = 0;
                else
                    getWalletBalance(library, account).then((balance: string) => {
                        _state.walletBalance = parseFloat((parseFloat(balance) / 1e18).toFixed(2));
                    });
                return _state;
            });
        }

        if (linkType === '1' || (library && linkType === '2')) {
            getChainGasPrice(
                new Web3(linkType === '1' ? (walletConnectProvider as any) : (library?.provider as any)),
            ).then((gasPriceUnit: string) => {
                const estimatedFee: number = (parseFloat(gasPriceUnit) * 5000000) / 1e18;
                setDialogState({
                    ...dialogState,
                    mintTxFee: estimatedFee,
                    sellTxFee: estimatedFee,
                    buyNowTxFee: estimatedFee,
                    changePriceTxFee: estimatedFee,
                    cancelSaleTxFee: estimatedFee,
                    acceptBidTxFee: estimatedFee,
                    placeBidTxFee: estimatedFee,
                    updateBidTxFee: estimatedFee,
                    cancelBidTxFee: estimatedFee,
                    crtBlindTxFee: estimatedFee,
                    buyBlindTxFee: estimatedFee,
                });
            });
        }
    }, [
        library,
        dialogState.createNFTDlgStep,
        dialogState.buyNowDlgStep,
        dialogState.changePriceDlgStep,
        dialogState.cancelSaleDlgStep,
        dialogState.acceptBidDlgStep,
        dialogState.placeBidDlgStep,
        dialogState.updateBidDlgStep,
        dialogState.cancelBidDlgStep,
        dialogState.createBlindBoxDlgStep,
        dialogState.buyBlindBoxDlgStep,
        dialogState.createNFTDlgOpened,
        dialogState.buyNowDlgOpened,
        dialogState.changePriceDlgOpened,
        dialogState.cancelSaleDlgOpened,
        dialogState.acceptBidDlgOpened,
        dialogState.placeBidDlgOpened,
        dialogState.updateBidDlgOpened,
        dialogState.cancelBidDlgOpened,
        dialogState.createBlindBoxDlgOpened,
        dialogState.buyBlindBoxDlgOpened,
    ]);

    if (linkType === '1') initConnectivitySDK();

    console.log('--------accounts: ', signInDlgState);

    return (
        <>
            <ModalDialog
                open={signInDlgState.signInDlgOpened}
                onClose={() => {
                    setSignInDlgState({ ...signInDlgState, signInDlgOpened: false });
                }}
            >
                <ConnectDID
                    onConnect={async (wallet: string) => {
                        _setSignInState({ ..._signInState, signInDlgOpened: true });
                        if (wallet === 'EE') {
                            if (isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession()) {
                                await signOutWithEssentialsWithoutRefresh();
                                await signInWithEssentials();
                            } else {
                                await signInWithEssentials();
                            }
                        } else signInWithWallet(wallet);
                        // showSucceedSnackBar();
                    }}
                />
            </ModalDialog>
            <ModalDialog
                open={signInDlgState.downloadEssentialsDlgOpened}
                onClose={() => {
                    setSignInDlgState({ ...signInDlgState, downloadEssentialsDlgOpened: false });
                }}
            >
                <DownloadEssentials />
            </ModalDialog>
        </>
    );
};

export default SignInDlgContainer;
