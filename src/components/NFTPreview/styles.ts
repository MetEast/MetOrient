import { styled, Box, Stack } from '@mui/material';

export const GalleryItemContainer = styled(Stack)`
    height: 100%;
    justify-content: space-between;
    /* border: 1px solid #eeeeee;
    border-radius: 8px;
    padding: 8px; */
`;

export const ProductImageContainer = styled(Stack)`
    position: relative;
    width: 100%;
    padding-top: 75%;
    cursor: pointer;
`;

export const ImageBox = styled(Box)`
    position: absolute;
    inset: 0;
    /* display: flex; */
    border: 1px solid #eeeeee;
    border-radius: 18px;
    overflow: hidden;
    /* box-shadow: 4px 8px 4px -4px rgba(2, 14, 25, 0.2); */
    /* filter: drop-shadow(0px 4px 8px rgba(7, 43, 76, 0.2)); */
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 18px;
        margin: auto;
    }
`;

export const LikeBtn = styled(Box)`
    position: absolute;
    top: 0.8vw;
    right: 0.8vw;
    width: 2.5vw;
    height: 2.5vw;
    border-radius: 100%;
    background: #ffffffcc;
    display: none;
    place-content: center;

    ${(props) => props.theme.breakpoints.up('sm')} {
        display: grid;
    }
`;
