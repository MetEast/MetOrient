import React from 'react';
import { Box, Stack, Grid, Typography } from '@mui/material';
import { ViewAllBtn } from './styles';
import { TypeNFTTransaction } from 'src/types/product-types';
import SingleNFTTransactionType from 'src/components/SingleNFTTransactionType';
import ELAPrice from 'src/components/ELAPrice';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDialogContext } from 'src/context/DialogContext';

interface ComponentProps {
    transactionsList: Array<TypeNFTTransaction>;
}

const NFTTransactionTable: React.FC<ComponentProps> = ({ transactionsList }): JSX.Element => {
    const transactionsTblColumns = [
        { value: 'Type', width: 3 },
        { value: 'User', width: 3 },
        { value: 'Price', width: 4 },
        { value: 'Date', width: 2 },
    ];
    const theme = useTheme();
    const matchDownSm = useMediaQuery(theme.breakpoints.down('sm'));
    const priceAlign = matchDownSm ? true : false;
    const [dialogState, setDialogState] = useDialogContext();

    return (
        <Box>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography fontSize={22} fontWeight={700}>
                    Latest transactions
                </Typography>
                <ViewAllBtn
                    onClick={() => {
                        setDialogState({ ...dialogState, allTxDlgOpened: true });
                    }}
                >
                    View ALL
                </ViewAllBtn>
            </Stack>
            <Grid container alignItems="center" rowSpacing={2} marginTop={0}>
                {transactionsTblColumns.map((item, index) => (
                    <Grid
                        key={index}
                        item
                        xs={item.width}
                        fontSize={14}
                        fontWeight={700}
                        display={{ xs: 'none', sm: 'block' }}
                        sx={{ textTransform: 'uppercase' }}
                    >
                        {item.value}
                    </Grid>
                ))}
                {transactionsList.map((item, index) => (
                    <Grid container item key={index}>
                        <Grid item xs={6} sm={transactionsTblColumns[0].width} order={{ xs: 3, sm: 1 }}>
                            <SingleNFTTransactionType transactionType={item.type} transactionHash={item.txHash} />
                        </Grid>
                        <Grid
                            item
                            xs={6}
                            sm={transactionsTblColumns[1].width}
                            order={{ xs: 4, sm: 2 }}
                            textAlign={{ xs: 'right', sm: 'left' }}
                        >
                            <Typography fontSize={16} fontWeight={400}>
                                {item.user}
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={6}
                            sm={transactionsTblColumns[2].width}
                            order={{ xs: 2, sm: 3 }}
                            textAlign={{ xs: 'right', sm: 'left' }}
                        >
                            <ELAPrice price_ela={item.price} price_ela_fontsize={14} alignRight={priceAlign} />
                        </Grid>
                        <Grid item xs={6} sm={transactionsTblColumns[3].width} order={{ xs: 1, sm: 4 }}>
                            <Typography fontSize={12} fontWeight={500}>
                                {item.time}
                            </Typography>
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default NFTTransactionTable;
