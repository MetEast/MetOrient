import React, { useState, useMemo } from 'react';
import { Stack, Typography } from '@mui/material';
import { AdminTableColumn, AdminBannersItemType } from 'src/types/admin-table-data-types';
import Table from 'src/components/Admin/Table';
import { Icon } from '@iconify/react';
import { PrimaryButton } from 'src/components/Buttons/styles';
import ModalDialog from 'src/components/ModalDialog';
import CreateBanner from 'src/components/TransactionDialogs/CreateBanner/CreateBanner';

const AdminBanners: React.FC = (): JSX.Element => {
    const [createBannerDlgOpen, setCreateBannerDlgOpen] = useState<boolean>(false);

    const columns: AdminTableColumn[] = [
        {
            id: 'banner_id',
            label: 'Banner ID',
            width: 100,
        },
        {
            id: 'image',
            label: 'Image',
            cell: (props) => (
                <Stack borderRadius={2} width={60} overflow="hidden">
                    <img src={props.value} alt="" />
                </Stack>
            ),
        },
        {
            id: 'url',
            label: 'URL',
            cell: (props) => (
                <Typography display="inline-block" fontSize={14} fontWeight={500} color="#1890FF">
                    {props.value}
                </Typography>
            ),
        },
        {
            id: 'sort',
            label: 'Sort',
        },
        {
            id: 'location',
            label: 'Location',
        },
        {
            id: 'status',
            label: 'Status',
            cell: (props) => (
                <Typography
                    display="inline-block"
                    fontSize={14}
                    fontWeight={500}
                    paddingX={1}
                    paddingY={0.5}
                    borderRadius={2}
                    color="#1EA557"
                    sx={{ background: '#C9F5DC' }}
                >
                    {props.value}
                </Typography>
            ),
        },
        {
            id: 'created',
            label: 'Created',
            width: 160,
        },
        {
            id: 'others',
            label: '',
            cell: (props) => (
                <Stack direction="row" spacing={1}>
                    <PrimaryButton size="small" btn_type="pink" sx={{ minWidth: 40 }}>
                        <Icon icon="ph:trash" fontSize={20} color="#EB5757" />
                    </PrimaryButton>
                    <PrimaryButton size="small" btn_type="secondary" sx={{ minWidth: 40 }}>
                        <Icon icon="ph:pencil-simple" fontSize={20} color="#1890FF" />
                    </PrimaryButton>
                </Stack>
            ),
        },
    ];

    const data: AdminBannersItemType[] = useMemo(
        () =>
            [...Array(111).keys()].map(
                (item) =>
                    ({
                        id: item,
                        banner_id: item + 1,
                        image: '/assets/images/explore/singlenft-template4.png',
                        url: 'https://meteast.io/banner',
                        sort: 10,
                        location: 'Blind Box',
                        status: 'online',
                        created: '2022-06-18  08:50:00',
                    } as AdminBannersItemType),
            ),
        [],
    );

    const [tabledata] = useState(data);

    return (
        <>
            <Stack height="100%" spacing={4}>
                <Stack direction="row" alignItems="flex-end" columnGap={1}>
                    <PrimaryButton
                        size="small"
                        sx={{ paddingX: 3 }}
                        onClick={() => {
                            setCreateBannerDlgOpen(true);
                        }}
                    >
                        <Icon icon="ph:plus" fontSize={20} color="white" style={{ marginBottom: 2, marginRight: 4 }} />
                        {`New Banner`}
                    </PrimaryButton>
                </Stack>
                <Table tabledata={tabledata} columns={columns} />
            </Stack>
            <ModalDialog
                open={createBannerDlgOpen}
                onClose={() => {
                    setCreateBannerDlgOpen(false);
                }}
            >
                <CreateBanner
                    onClose={() => {
                        setCreateBannerDlgOpen(false);
                    }}
                />
            </ModalDialog>
        </>
    );
};

export default AdminBanners;
