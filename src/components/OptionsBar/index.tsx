import React, { useState } from 'react';
import { Box, Stack } from '@mui/material';
import SearchField from '../SearchField';
import { TypeSelectItem } from 'src/types/select-types';
import { FilterButton, FiltersBox, SortByBtn, GridButton } from './styles';
import { SpacingProps } from '@mui/system';
import { Icon } from '@iconify/react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Select from 'src/components/Select';
import FilterCard from './FilterCard';

interface OptionsBarProps extends SpacingProps {
    handleKeyWordChange: (value: string) => void;
    handlerFilterChange: (status: number, minPrice: string, maxPrice: string, opened: boolean) => void;
    sortOptions: TypeSelectItem[];
    sortSelected?: TypeSelectItem;
    handleSortChange: (value: string) => void;
    productViewMode: string;
    setProductViewMode: (value: 'grid1' | 'grid2') => void;
}

const OptionsBar: React.FC<OptionsBarProps> = ({
    handleKeyWordChange,
    handlerFilterChange,
    sortOptions,
    sortSelected,
    handleSortChange,
    productViewMode,
    setProductViewMode,
    ...otherProps
}): JSX.Element => {
    const theme = useTheme();
    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
    const matchDownLg = useMediaQuery(theme.breakpoints.down('lg'));
    const onlyShowIcon = matchDownMd ? true : false;

    const [sortBySelectOpen, isSortBySelectOpen] = useState(false);
    const [showFiltersCard, setShowFiltersCard] = useState<boolean>(false);

    return (
        <Stack direction="row" spacing={{ xs: 1, md: 2 }} sx={{ height: 40 }} {...otherProps}>
            <SearchField
                placeholder="Search name, description, address and tokenID"
                handleChange={handleKeyWordChange}
            />
            <Select
                titlebox={
                    <SortByBtn fullWidth isopen={sortBySelectOpen ? 1 : 0}>
                        <Icon icon="ph:sort-ascending" fontSize={24} />
                        {!onlyShowIcon && (
                            <>
                                {sortSelected ? sortSelected.label : 'SORT BY'}
                                <Icon icon="ph:caret-down" className="arrow-icon" style={{ marginBottom: 2 }} />
                            </>
                        )}
                    </SortByBtn>
                }
                selectedItem={sortSelected}
                options={sortOptions}
                isOpen={sortBySelectOpen ? 1 : 0}
                setIsOpen={isSortBySelectOpen}
                handleClick={handleSortChange}
                // width={260}
                min_width={onlyShowIcon ? 'auto' : 240}
                listitemsbox_width={onlyShowIcon ? 160 : 240}
            />
            <Box
                position="relative"
                onMouseEnter={() => setShowFiltersCard(true)}
                onMouseLeave={() => setShowFiltersCard(false)}
            >
                <FilterButton onClick={() => setShowFiltersCard(!showFiltersCard)}>
                    <Icon
                        icon="ph:funnel"
                        fontSize={20}
                        color="#1890FF"
                        style={{ marginRight: onlyShowIcon ? 0 : 4 }}
                    />
                    {!onlyShowIcon && `Filter`}
                </FilterButton>
                <FiltersBox display={showFiltersCard ? 'flex' : 'none'}>
                    <FilterCard
                        changeHandler={(status: number, minPrice: string, maxPrice: string, opened: boolean) => {
                            handlerFilterChange(status, minPrice, maxPrice, opened);
                            if (!opened) setShowFiltersCard(opened);
                        }}
                    />
                </FiltersBox>
            </Box>
            <Box display="flex" borderRadius={3} sx={{ background: '#E8F4FF' }}>
                <GridButton
                    size="small"
                    selected={productViewMode === 'grid2'}
                    onClick={() => setProductViewMode('grid2')}
                >
                    <Icon icon="ph:dots-nine" fontSize={20} />
                </GridButton>
                <GridButton
                    size="small"
                    selected={productViewMode === 'grid1'}
                    onClick={() => setProductViewMode('grid1')}
                >
                    <Icon icon="ph:squares-four" fontSize={20} />
                </GridButton>
            </Box>
        </Stack>
    );
};

export default OptionsBar;
