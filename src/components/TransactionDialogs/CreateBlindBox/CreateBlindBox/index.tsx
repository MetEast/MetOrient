import React, { useState, useCallback, useEffect } from 'react';
import { Stack, Typography, Grid, Box } from '@mui/material';
import { useStyles, DateTimeInput } from './styles';
import { DialogTitleTypo, PageNumberTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import CustomTextField from 'src/components/TextField';
import WarningTypo from '../../components/WarningTypo';
import ELAPriceInput from '../../components/ELAPriceInput';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import UploadSingleFile from 'src/components/Upload/UploadSingleFile';
import ModalDialog from 'src/components/ModalDialog';
import SearchBlindBoxItems from '../SearchBlindBoxItems';

export interface ComponentProps {}

const CreateBlindBox: React.FC<ComponentProps> = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const classes = useStyles();

    const [blindboxTitle, setBlindboxTitle] = useState<string>(dialogState.crtBlindTitle);
    const [blindboxTitleError, setBlindboxTitleError] = useState(false);
    const [blindboxDescription, setBlindboxDescription] = useState<string>(dialogState.crtBlindDescription);
    const [blindboxDescriptionError, setBlindboxDescriptionError] = useState(false);
    const [blindboxImage, setBlindboxImage] = useState<File>(dialogState.crtBlindImage);
    const [blindboxImageError, setBlindboxImageError] = useState(false);

    const [stateFile, setStateFile] = useState(dialogState.crtBlindTitle === '' ? null : {raw: dialogState.crtBlindImage, preview: URL.createObjectURL(dialogState.crtBlindImage)});
    const [blindboxStatus, setBlindboxStatus] = useState<'offline' | 'online'>(dialogState.crtBlindStatus);
    const [blindboxQuantity, setBlindboxQuantity] = useState<number>(dialogState.crtBlindQuantity);
    const [blindboxQuantityError, setBlindboxQuantityError] = useState(-1);
    const [blindboxPrice, setBlindboxPrice] = useState<number>(dialogState.crtBlindPrice);
    const [blindboxPriceError, setBlindBoxPriceError] = useState(false);
    const [blindboxPurchases, setBlindboxPurchases] = useState<number>(dialogState.crtBlindPurchases);
    const [blindboxPurchasesError, setBlindboxPurchasesError] = useState(false);
    const [saleBegins, setSaleBegins] = React.useState<string>(dialogState.crtBlindSaleBegin);
    const [saleBeginsError, setSaleBeginsError] = useState(false);
    // const [saleEnds, setSaleEnds] = useState<string>(dialogState.crtBlindEnd);
    // const [saleEndsError, setSaleEndsError] = useState(false);
    const [selectDlgOpened, setSelectDlgOpened] = useState<boolean>(false);

    const handleFileChange = (files: Array<File>) => {
        handleDropSingleFile(files);
        if (files !== null && files.length > 0) {
            setBlindboxImage(files[0]);
            setBlindboxImageError(false);
        }
    };

    const handleDropSingleFile = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setStateFile({ ...file, preview: URL.createObjectURL(file) });
        }
    }, []);

    useEffect(() => {
        const tokenIds: string[] = dialogState.crtBlindTokenIds.split(';').filter((item: string) => item.length > 0);
        setBlindboxQuantity(tokenIds.length);
        if (blindboxQuantityError >= 0) {
            setBlindboxQuantityError(tokenIds.length);
        }
    }, [dialogState.crtBlindTokenIds]);

    return (
        <>
            <Stack
                spacing={5}
                minWidth={{ xs: 360, sm: 580, md: 700 }}
                maxHeight={{ xs: 'auto', md: '70vh' }}
                sx={{ overflowY: 'auto', overflowX: 'hidden' }}
                className={classes.container}
            >
                <Stack alignItems="center">
                    <PageNumberTypo>1 of 2</PageNumberTypo>
                    <DialogTitleTypo>Create Mystery Box</DialogTitleTypo>
                </Stack>
                <Box>
                    <Grid container columnSpacing={4} rowGap={3}>
                        <Grid item xs={12} sm={6} display="flex" flexDirection="column" rowGap={3}>
                            <CustomTextField
                                title="Title"
                                inputValue={blindboxTitle}
                                placeholder="Enter Title"
                                error={blindboxTitleError}
                                errorText="Title can not be empty."
                                changeHandler={(value: string) => setBlindboxTitle(value)}
                            />
                            <CustomTextField
                                title="Description"
                                inputValue={blindboxDescription}
                                placeholder="Enter Description"
                                error={blindboxDescriptionError}
                                errorText="Description can not be empty."
                                multiline
                                rows={3}
                                changeHandler={(value: string) => setBlindboxDescription(value)}
                            />
                            <Stack height="100%" spacing={1}>
                                <Typography fontSize={12} fontWeight={700}>
                                    Main Image
                                </Typography>
                                <UploadSingleFile
                                    file={stateFile}
                                    onDrop={handleFileChange}
                                    sx={{
                                        width: '100%',
                                        height: { xs: '200px', sm: '100%' },
                                        marginTop: '1rem',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                    }}
                                />
                                {blindboxImageError && (
                                    <Typography fontSize={12} fontWeight={500} color="#EB5757">
                                        Image file should be selected.
                                    </Typography>
                                )}
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} display="flex" flexDirection="column" rowGap={2}>
                            <Stack spacing={0.5}>
                                <Typography fontSize={12} fontWeight={700}>
                                    Items
                                </Typography>
                                <PrimaryButton fullWidth size="small" onClick={() => setSelectDlgOpened(true)}>
                                    Choose NFTs to add
                                </PrimaryButton>
                            </Stack>
                            <Stack direction="row" spacing={3}>
                                <CustomTextField
                                    disabled
                                    inputValue={blindboxQuantity.toString() || ''}
                                    error={blindboxQuantityError === 0}
                                    errorText="Select at least 1 NFT"
                                    title="Number of NFT"
                                    placeholder="es. 1000"
                                    changeHandler={(value: string) => setBlindboxQuantity(parseInt(value))}
                                />
                                <CustomTextField
                                    title="Max Num of Purchases"
                                    inputValue={blindboxPurchases.toString()}
                                    placeholder="es. 1000"
                                    error={blindboxPurchasesError}
                                    errorText="Max number of Purchases cannot be empty"
                                    number={true}
                                    changeHandler={(value: string) =>
                                        setBlindboxPurchases(parseInt(value === '' ? '0' : value))
                                    }
                                />
                            </Stack>
                            <Stack spacing={1}>
                                <Typography fontSize={12} fontWeight={700}>
                                    Status
                                </Typography>
                                <Stack direction="row" spacing={1}>
                                    <PrimaryButton
                                        fullWidth
                                        size="small"
                                        sx={{
                                            background: blindboxStatus === 'offline' ? 'auto' : '#E8F4FF',
                                            color: blindboxStatus === 'offline' ? 'auto' : '#1890FF',
                                        }}
                                        onClick={() => setBlindboxStatus('offline')}
                                    >
                                        Offline
                                    </PrimaryButton>
                                    <PrimaryButton
                                        fullWidth
                                        size="small"
                                        sx={{
                                            background: blindboxStatus === 'online' ? 'auto' : '#E8F4FF',
                                            color: blindboxStatus === 'online' ? 'auto' : '#1890FF',
                                        }}
                                        onClick={() => setBlindboxStatus('online')}
                                    >
                                        Online
                                    </PrimaryButton>
                                </Stack>
                            </Stack>
                            <ELAPriceInput title="Price" handleChange={setBlindboxPrice} />
                            {blindboxPriceError && (
                                <Typography fontSize={12} fontWeight={500} color="#EB5757">
                                    Invalid Price
                                </Typography>
                            )}
                            <Stack spacing={0.5}>
                                <Typography fontSize={12} fontWeight={700}>
                                    Sale Begins
                                </Typography>
                                <DateTimeInput
                                    type="datetime-local"
                                    value={saleBegins}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setSaleBegins(event.target.value);
                                    }}
                                ></DateTimeInput>
                                {saleBeginsError && (
                                    <Typography fontSize={12} fontWeight={500} color="#EB5757">
                                        Invalid Date Format
                                    </Typography>
                                )}
                            </Stack>
                            {/* <Stack spacing={0.5}>
                                <Typography fontSize={12} fontWeight={700}>
                                    Sale Ends
                                </Typography>
                                <DateTimeInput
                                    type="datetime-local"
                                    value={saleEnds}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setSaleEnds(event.target.value);
                                    }}
                                ></DateTimeInput>
                                {saleEndsError && (
                                    <Typography fontSize={12} fontWeight={500} color="#EB5757">
                                        Invalid Date Format
                                    </Typography>
                                )}
                            </Stack> */}
                        </Grid>
                    </Grid>
                </Box>
                <Stack alignItems="center" spacing={1}>
                    <Typography fontSize={14} fontWeight={600}>
                        Available: {signInDlgState.walletBalance} ELA
                    </Typography>
                    <Stack width="100%" direction="row" spacing={2}>
                        <SecondaryButton
                            fullWidth
                            onClick={() => {
                                setDialogState({
                                    ...dialogState,
                                    createBlindBoxDlgOpened: false,
                                    createBlindBoxDlgStep: 0,
                                    crtBlindTitle: '',
                                    crtBlindDescription: '',
                                    crtBlindImage: new File([''], ''),
                                    crtBlindTokenIds: '',
                                    crtBlindStatus: 'offline',
                                    crtBlindQuantity: 0,
                                    crtBlindPrice: 0,
                                    crtBlindSaleBegin: '',
                                    // crtBlindSaleEnd: '',
                                    crtBlindPurchases: 0,
                                });
                            }}
                        >
                            Back
                        </SecondaryButton>
                        <PrimaryButton
                            fullWidth
                            onClick={() => {
                                if (
                                    dialogState.crtBlindTokenIds !== '' &&
                                    blindboxTitle !== '' &&
                                    blindboxDescription !== '' &&
                                    blindboxImage !== null &&
                                    blindboxQuantity > 0 &&
                                    blindboxPrice > 0 &&
                                    saleBegins !== '' &&
                                    // saleEnds !== '' &&
                                    blindboxPurchases > 0
                                ) {
                                    setDialogState({
                                        ...dialogState,
                                        createBlindBoxDlgStep: 1,
                                        crtBlindTitle: blindboxTitle,
                                        crtBlindDescription: blindboxDescription,
                                        crtBlindImage: blindboxImage,
                                        crtBlindStatus: blindboxStatus,
                                        crtBlindQuantity: blindboxQuantity,
                                        crtBlindPrice: blindboxPrice,
                                        crtBlindSaleBegin: saleBegins,
                                        // crtBlindSaleEnd: saleEnds,
                                        crtBlindPurchases: blindboxPurchases,
                                    });
                                } else {
                                    setBlindboxTitleError(blindboxTitle === '');
                                    setBlindboxDescriptionError(blindboxDescription === '');
                                    setBlindboxPurchasesError(blindboxPurchases === 0);
                                    setSaleBeginsError(isNaN(Date.parse(saleBegins)));
                                    // setSaleEndsError(isNaN(Date.parse(saleEnds)));
                                    setBlindboxImageError(blindboxImage === undefined);
                                    setBlindBoxPriceError(isNaN(blindboxPrice) || blindboxPrice === 0);
                                    setBlindboxQuantityError(blindboxQuantity);
                                }
                            }}
                        >
                            Confirm
                        </PrimaryButton>
                    </Stack>
                    <WarningTypo width={260}>
                        In case of payment problems, please contact the official customer service
                    </WarningTypo>
                </Stack>
            </Stack>
            <ModalDialog
                open={selectDlgOpened}
                onClose={() => {
                    setSelectDlgOpened(false);
                }}
            >
                <SearchBlindBoxItems
                    onClose={() => {
                        setSelectDlgOpened(false);
                    }}
                />
            </ModalDialog>
        </>
    );
};

export default CreateBlindBox;
