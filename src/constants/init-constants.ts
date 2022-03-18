import { AdminNFTItemType, AdminUsersItemType, AdminBannersItemType } from 'src/types/admin-table-data-types';
import { TypeContractMethodPram } from 'src/types/mint-types';
import {
    TypeProduct,
    TypeNFTTransaction,
    TypeBlindBoxSelectItem,
    TypeSingleNFTBid,
    TypeNFTHisotry,
    TypeYourEarning,
    enumBlindBoxNFTType,
    enumSingleNFTType,
    enumMyNFTType,
    enumTransactionType,
    enumBadgeType,
} from 'src/types/product-types';

export const blankPageBanners: string[] = [
    '/assets/images/banners/banner1.png',
    '/assets/images/banners/banner2.png',
    '/assets/images/banners/banner3.png',
];

export const blankNFTItem: TypeProduct = {
    tokenId: '',
    name: '',
    image: '',
    price_ela: 0,
    price_usd: 0,
    likes: 0,
    views: 0,
    author: '',
    authorDescription: '',
    authorImg: '',
    authorAddress: '',
    description: '',
    tokenIdHex: '',
    royalties: 0,
    createTime: '',
    holderName: '',
    holder: '',
    type: enumSingleNFTType.BuyNow,
    isLike: false,
};

export const blankMyNFTItem: TypeProduct = {
    tokenId: '',
    name: '',
    image: '',
    price_ela: 0,
    price_usd: 0,
    likes: 0,
    views: 0,
    author: '',
    authorDescription: '',
    authorImg: '',
    authorAddress: '',
    description: '',
    tokenIdHex: '',
    royalties: 0,
    createTime: '',
    holderName: '',
    holder: '',
    type: enumMyNFTType.Created,
    isLike: false,
};

export const blankNFTTxs: TypeNFTTransaction = {
    type: enumTransactionType.Bid,
    user: '',
    price: 0,
    time: '',
    txHash: '',
};

export const blankNFTBid: TypeSingleNFTBid = { user: '', price: 0, time: '', orderId: '' };

export const blankMyEarning: TypeYourEarning = {
    avatar: '',
    title: '',
    time: '',
    price: 0,
    badge: enumBadgeType.Other,
};

export const blankMyNFTHistory: TypeNFTHisotry = {
    type: '',
    user: '',
    price: 0,
    time: '',
    saleType: enumTransactionType.ForSale,
    txHash: '',
};

export const blankBBItem: TypeProduct = {
    tokenId: '',
    name: '',
    image: '',
    price_ela: 0,
    price_usd: 0,
    likes: 0,
    views: 0,
    author: '',
    authorDescription: '',
    authorImg: '',
    authorAddress: '',
    description: '',
    tokenIdHex: '',
    royalties: 0,
    createTime: '',
    holderName: '',
    holder: '',
    type: enumBlindBoxNFTType.ComingSoon,
    isLike: false,
    sold: 0,
    instock: 0,
};

export const blankBBCandidate: TypeBlindBoxSelectItem = {
    id: 0,
    tokenId: '',
    nftIdentity: '',
    projectTitle: '',
    projectType: '',
    url: '',
};

export const blankAdminNFTItem: AdminNFTItemType = {
    id: 0,
    tokenId: '',
    token_id: '',
    nft_title: '',
    nft_image: '',
    selling_price: 0,
    nft_owner: '',
    nft_creator: '',
    orderId: '',
    created_date: '',
    listed_date: '',
    likes: 0,
    views: 0,
    sale_type: enumBadgeType.BuyNow,
    status: 'Online',
};

export const blankAdminUserItem: AdminUsersItemType = {
    id: 0,
    address: '',
    username: '',
    avatar: '',
    status: 0,
    remarks: '',
};

export const blankAdminBannerItem: AdminBannersItemType = {
    id: 0, // required
    banner_id: 0,
    image: '',
    url: '',
    sort: 0,
    location: '',
    status: '',
    created: '',
};

export const blankContractMethodParam: TypeContractMethodPram = {
    contractType: 1,
    method: '',
    price: '0',
    tokenId: '',
    tokenIds: [],
    tokenUri: '',
    royaltyFee: 0,
    orderId: '',
    orderIds: [],
    didUri: '',
    _price: '0',
    _prices: [],
    quoteToken: '',
    quoteTokens: [],
    isBlindBox: false,
    endTime: '',
    operator: '',
    approved: false,
    address: '',
};
