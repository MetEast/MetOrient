import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { SecondaryButton } from 'src/components/Buttons/styles';
import ELAPrice from 'src/components/ELAPrice';
import ProductBadge from 'src/components/ProductBadge';
import { enumBadgeType } from 'src/types/product-types';

export interface ComponentProps {
    onClose: () => void;
}

const YourEarnings: React.FC<ComponentProps> = ({ onClose }): JSX.Element => {
    const earnings = [
        {
            avatar: '/assets/images/avatar-template.png',
            title: 'Scuplting with the Heart',
            time: '2022/02/02 10:00',
            price: 24,
            badge: enumBadgeType.Badge,
        },
        {
            avatar: '/assets/images/avatar-template.png',
            title: 'Art for Everyone',
            time: '2022/02/02 10:00',
            price: 2.23,
            badge: enumBadgeType.Royalties,
        },
        {
            avatar: '/assets/images/avatar-template.png',
            title: 'Painting with Passion',
            time: '2022/02/02 10:00',
            price: 82,
            badge: enumBadgeType.Badge,
        },
        {
            avatar: '/assets/images/avatar-template.png',
            title: 'A Life on Canvas',
            time: '2022/02/02 10:00',
            price: 2400,
            badge: enumBadgeType.Badge,
        },
        {
            avatar: '/assets/images/avatar-template.png',
            title: 'Beautiful Abstract',
            time: '2022/02/02 10:00',
            price: 10,
            badge: enumBadgeType.Royalties,
        },
        {
            avatar: '/assets/images/avatar-template.png',
            title: 'Black Rage',
            time: '2022/02/02 10:00',
            price: 199,
            badge: enumBadgeType.Badge,
        },
        {
            avatar: '/assets/images/avatar-template.png',
            title: 'Colorful Colors',
            time: '2022/02/02 10:00',
            price: 40.3,
            badge: enumBadgeType.Badge,
        },
    ];

    return (
        <Stack spacing={5} width={{ xs: 360, md: 520 }}>
            <Stack>
                <DialogTitleTypo sx={{ textAlign: 'center' }}>Your Earnings</DialogTitleTypo>
            </Stack>
            <Stack spacing={3} maxHeight={{ xs: 400, md: '100%' }} sx={{ overflowY: 'auto', overflowX: 'hidden' }}>
                {earnings.map((item, index) => (
                    <Stack direction="row" justifyContent="space-between" spacing={3}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <img src={item.avatar} width={40} height={40} style={{ borderRadius: '100px' }} alt="" />
                            <Box>
                                <Typography fontSize={18} fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                                    {item.title}
                                </Typography>
                                <Typography fontSize={14} fontWeight={500}>
                                    {item.time}
                                </Typography>
                            </Box>
                        </Stack>
                        <Stack alignItems="flex-end">
                            <ELAPrice price_ela={item.price} price_ela_fontsize={14} />
                            <ProductBadge badgeType={item.badge} />
                        </Stack>
                    </Stack>
                ))}
            </Stack>
            <SecondaryButton fullWidth onClick={onClose}>
                Close
            </SecondaryButton>
        </Stack>
    );
};

export default YourEarnings;
