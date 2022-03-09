import { styled, Stack } from '@mui/material';

export const Container = styled(Stack)`
    width: 400px;
    padding: 32px;
    box-shadow: 0px 4px 40px -26px rgba(0, 20, 39, 0.4);
    border-radius: 32px;
    background: white;
    ${(props) => props.theme.breakpoints.down('sm')} {
        width: 100%;
        padding: 20px;
        border-radius: 0;
        justify-content: center;
    }
`;
