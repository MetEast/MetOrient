import { styled, Typography, Button } from '@mui/material';

export const FilterItemTypography = styled(Typography)`
    border: 1px solid var(--color-base);
    color: var(--color-base);
    border-radius: 8px;
    padding-left: 8px;
    padding-right: 8px;
    padding-top: 2px;
    padding-bottom: 2px;
    margin-left: 8px;
    margin-right: 8px;
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    line-height: 1rem;
`;

export const FilterButton = styled(Button)<{ selected: boolean }>`
    padding: 0 16px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;
    background: ${({ selected }) => (selected ? '#e8f4ff' : 'white')};
    color: ${({ selected }) => (selected ? '#1890ff' : 'black')};
    p {
        margin: 8px 0 8px 8px;
        padding: 4px 12px;
        border-radius: 8px;
        background: ${({ selected }) => (selected ? '#1890FF' : '#E8F4FF')};
        color: ${({ selected }) => (selected ? 'white' : '#1890FF')};
    }
`;
