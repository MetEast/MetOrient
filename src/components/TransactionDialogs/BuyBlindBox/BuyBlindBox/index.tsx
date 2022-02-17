import React, { useState } from 'react';
import { Stack, TextField, Typography } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo } from '../../styles';
import { IconBtn } from './styles';
import ELAPrice from 'src/components/ELAPrice';
import { Icon } from '@iconify/react';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import { useDialogContext } from 'src/context/DialogContext';

export interface ComponentProps {}

const BuyBlindBox: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    const [amount, setAmount] = useState<number>(1);

    return (
        <Stack spacing={5} width={320}>
            <Stack alignItems="center">
                <PageNumberTypo>1 of 2</PageNumberTypo>
                <DialogTitleTypo>Buy Blind Box</DialogTitleTypo>
            </Stack>
            <Stack alignItems="center">
                <Typography fontSize={14} fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                    Item
                </Typography>
                <Typography fontSize={18} fontWeight={700}>
                    {dialogState.buyBlindBoxName}
                </Typography>
                <ELAPrice price_ela={dialogState.buyBlindBoxPriceEla} price_ela_fontsize={14} />
                <Typography fontSize={14} fontWeight={700} marginTop={4} sx={{ textTransform: 'uppercase' }}>
                    Quantity
                </Typography>
                <Stack direction="row" spacing={1} marginTop={1}>
                    <IconBtn
                        onClick={() => {
                            amount >= 1 && setAmount(amount - 1);
                        }}
                    >
                        <Icon icon="ph:minus" color="#1890FF" />
                    </IconBtn>
                    <TextField
                        value={amount}
                        sx={{
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                                width: 60,
                                height: 40,
                                '& fieldset': {
                                    borderWidth: 0,
                                },
                                '&.Mui-focused fieldset': {
                                    borderWidth: 0,
                                },
                                '& input': {
                                    textAlign: 'center',
                                },
                            },
                        }}
                    />
                    <IconBtn
                        onClick={() => {
                            setAmount(amount + 1);
                        }}
                    >
                        <Icon icon="ph:plus" color="#1890FF" />
                    </IconBtn>
                </Stack>
                <Typography fontSize={14} fontWeight={700} marginTop={4} sx={{ textTransform: 'uppercase' }}>
                    Subtotal
                </Typography>
                <ELAPrice price_ela={dialogState.buyBlindBoxPriceEla * amount} price_usd={dialogState.buyBlindBoxPriceUsd * amount} />
            </Stack>
            <Stack direction="row" spacing={2}>
                <SecondaryButton
                    fullWidth
                    onClick={() => {
                        setDialogState({ ...dialogState, buyBlindBoxDlgOpened: false });
                    }}
                >
                    close
                </SecondaryButton>
                <PrimaryButton
                    fullWidth
                    onClick={() => {
                        setDialogState({ ...dialogState, buyBlindBoxDlgStep: 1, buyBlindBoxDlgOpened: true, buyBlindBoxAmount: amount });
                    }}
                >
                    Confirm
                </PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default BuyBlindBox;
