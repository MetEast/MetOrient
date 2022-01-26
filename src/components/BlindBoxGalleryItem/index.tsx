import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TypeProduct } from 'src/types/product-types';
import { ProductImageContainer, LikeBtn } from './styles';
import { Box, Typography, Grid } from '@mui/material';
import ProductBadgeContainer from '../ProductBadgeContainer';
import { Icon } from '@iconify/react';
import ELAPrice from 'src/components/ELAPrice';
import ProductSnippets from 'src/components/ProductSnippets';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import authAtom from 'src/recoil/auth';
import { useCookies } from "react-cookie";
import { useSnackbar } from 'notistack';

export interface BlindBoxGalleryItemProps {
    product: TypeProduct;
    onlyShowImage?: boolean;
    index: number;
    updateLikes: (index: number, type: string) => void;
}

const BlindBoxGalleryItem: React.FC<BlindBoxGalleryItemProps> = ({ product, onlyShowImage = false, index, updateLikes }): JSX.Element => {
    const navigate = useNavigate();
    const auth = useRecoilValue(authAtom);
    const [didCookies, setDidCookie, removeDidCookie] = useCookies(["did"]);
    const [tokenCookies, setTokenCookie, removeTokenCookie] = useCookies(["token"]);
    const [likeState, setLikeState] = useState(product.isLike);
    const { enqueueSnackbar } = useSnackbar();

    const changeLikeState = (event: React.MouseEvent) => {
        event.preventDefault(); // 
        event.stopPropagation(); // 
        if(auth.isLoggedIn) {
            let reqUrl = `${process.env.REACT_APP_BACKEND_URL}/`;
            reqUrl += likeState ? 'decTokenLikes' : 'incTokenLikes'; 
            const reqBody = {"token": tokenCookies.token, "tokenId": product.tokenId, "did": didCookies.did};
            // change state first
            updateLikes(index, likeState ? 'dec' : 'inc');
            setLikeState(!likeState);
            //
            fetch(reqUrl,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(reqBody)
              }).then(response => response.json()).then(data => {
                if (data.code === 200) {
                    enqueueSnackbar('Succeed!', { variant: "success", anchorOrigin: {horizontal: "right", vertical: "top"} })
                } else {
                  console.log(data);
                }
              }).catch((error) => {
                console.log(error);
            });
        }
        else {
            navigate('/login');
        }
    };

    return (
        <Box>
            <Link to={`/blind-box/product/${product.tokenId}`}>
                <ProductImageContainer param={onlyShowImage}>
                    <img src={product.image} alt="" />
                    {!onlyShowImage && (
                        <LikeBtn onClick={changeLikeState}>
                            {likeState ? <Icon icon="ph:heart-fill" fontSize={20} color="red" /> : <Icon icon="ph:heart" fontSize={20} color="black" />}
                        </LikeBtn>
                    )}
                </ProductImageContainer>
            </Link>
            {!onlyShowImage && (
                <Grid container spacing={1}>
                    <Grid item order={1} width={'100%'} >
                        <Typography noWrap fontWeight={700} fontSize={{ xs: 16, lg: 32 }}>{product.name}</Typography>
                    </Grid>
                    <Grid item order={{xs: 4, sm: 4, md: 2 }} width={'100%'} display={{xs: 'none', sm: 'none', md: 'block' }}>
                        <ProductSnippets sold={product.sold} likes={product.likes} />
                    </Grid>
                    <Grid item order={3} width={'100%'} >
                        <ProductBadgeContainer nfttype={product.type} content={product.endTime} />
                    </Grid>
                    <Grid item order={{xs: 2, sm: 2, md: 4 }} width={'100%'} >
                        <ELAPrice price_ela={product.price_ela} price_usd={product.price_usd} />
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default BlindBoxGalleryItem;
