import { TypeNotification } from 'src/types/notification-types';
import {
    TypeProduct,
    TypeNFTTransaction,
    TypeSingleNFTBid,
    enumBlindBoxNFTType,
    enumSingleNFTType,
    enumMyNFTType,
    enumTransactionType,
} from 'src/types/product-types';

export const dummyNotificationList: Array<TypeNotification> = [
    {
        title: 'You have a new bid!',
        content:
            'Your CryptoGirl#19 project has just been bid by a VKWR909981 user for E 100.00Your CryptoGirl#19 project has just been bid by a VKWR909981 user for E 100.00Your CryptoGirl#19 project has just been bid by a VKWR909981 user for E 100.00',
        date: '2021-09-03',
    },
    {
        title: 'You have a new bid!',
        content: 'Your CryptoGirl#19 project has just been bid by a VKWR909981 user for E 100.00',
        date: '2021-09-03',
    },
    {
        title: 'You have a new bid!',
        content: 'Your CryptoGirl#19 project has just been bid by a VKWR909981 user for E 100.00',
        date: '2021-09-03',
        isRead: true,
    },
    {
        title: 'You have a new bid!',
        content: 'Your CryptoGirl#19 project has just been bid by a VKWR909981 user for E 100.00',
        date: '2021-09-03',
        isRead: true,
    },
];

export const dummyProducts: Array<TypeProduct> = [
    {
        tokenId: '0',
        image: 'https://scalablesolutions.io/wp-content/uploads/2021/03/NFTs.png',
        name: 'Project Title',
        price_ela: 199,
        price_usd: 88,
        likes: 10,
        views: 100,
        sold: 24,
        author: 'nickName',
        type: enumBlindBoxNFTType.ComingSoon,
        endTime: '2022/02/28 10:00',
        authorDescription: '--',
        authorImg: '--',
        authorAddress: '--',
        description: '--',
        tokenIdHex: '--',
        royalties: 0,
        createTime: '--',
        holderName: '--',
        holder: '--',
        isLike: false,
    },
    {
        tokenId: '1',
        image: 'https://scalablesolutions.io/wp-content/uploads/2021/03/NFTs.png',
        name: 'Project Title',
        price_ela: 199,
        price_usd: 88,
        likes: 10,
        views: 100,
        sold: 24,
        author: 'nickName',
        type: enumBlindBoxNFTType.SaleEnds,
        endTime: '2022/02/28 10:00',
        authorDescription: '--',
        authorImg: '--',
        authorAddress: '--',
        description: '--',
        tokenIdHex: '--',
        royalties: 0,
        createTime: '--',
        holderName: '--',
        holder: '--',
        isLike: false,
    },
    {
        tokenId: '2',
        image: 'https://scalablesolutions.io/wp-content/uploads/2021/03/NFTs.png',
        name: 'Project Title',
        price_ela: 199,
        price_usd: 88,
        likes: 10,
        views: 100,
        sold: 24,
        author: 'nickName',
        type: enumBlindBoxNFTType.SaleEnded,
        authorDescription: '--',
        authorImg: '--',
        authorAddress: '--',
        description: '--',
        tokenIdHex: '--',
        royalties: 0,
        createTime: '--',
        holderName: '--',
        holder: '--',
        isLike: false,
    },
    {
        tokenId: '3',
        image: 'https://scalablesolutions.io/wp-content/uploads/2021/03/NFTs.png',
        name: 'Project Title',
        price_ela: 199,
        price_usd: 88,
        likes: 10,
        views: 100,
        sold: 24,
        author: 'nickName',
        type: enumBlindBoxNFTType.ComingSoon,
        endTime: '2022/02/28 10:00',
        authorDescription: '--',
        authorImg: '--',
        authorAddress: '--',
        description: '--',
        tokenIdHex: '--',
        royalties: 0,
        createTime: '--',
        holderName: '--',
        holder: '--',
        isLike: false,
    },
    {
        tokenId: '4',
        image: 'https://scalablesolutions.io/wp-content/uploads/2021/03/NFTs.png',
        name: 'Project Title',
        price_ela: 199,
        price_usd: 88,
        likes: 10,
        views: 100,
        sold: 24,
        author: 'nickName',
        type: enumBlindBoxNFTType.SaleEnds,
        endTime: '2022/02/28 10:00',
        authorDescription: '--',
        authorImg: '--',
        authorAddress: '--',
        description: '--',
        tokenIdHex: '--',
        royalties: 0,
        createTime: '--',
        holderName: '--',
        holder: '--',
        isLike: false,
    },
    {
        tokenId: '5',
        image: 'https://scalablesolutions.io/wp-content/uploads/2021/03/NFTs.png',
        name: 'Project Title',
        price_ela: 199,
        price_usd: 88,
        likes: 10,
        views: 100,
        sold: 24,
        author: 'nickName',
        type: enumBlindBoxNFTType.SaleEnded,
        authorDescription: '--',
        authorImg: '--',
        authorAddress: '--',
        description: '--',
        tokenIdHex: '--',
        royalties: 0,
        createTime: '--',
        holderName: '--',
        holder: '--',
        isLike: false,
    },
    {
        tokenId: '6',
        image: 'https://scalablesolutions.io/wp-content/uploads/2021/03/NFTs.png',
        name: 'Project Title',
        price_ela: 199,
        price_usd: 88,
        likes: 10,
        views: 100,
        sold: 24,
        author: 'nickName',
        type: enumBlindBoxNFTType.ComingSoon,
        endTime: '2022/02/28 10:00',
        authorDescription: '--',
        authorImg: '--',
        authorAddress: '--',
        description: '--',
        tokenIdHex: '--',
        royalties: 0,
        createTime: '--',
        holderName: '--',
        holder: '--',
        isLike: false,
    },
];

export const newNFTProducts: Array<TypeProduct> = [
    {
        tokenId: '0',
        image: '/assets/images/explore/singlenft-template1.png',
        name: 'Project Title',
        price_ela: 199,
        price_usd: 88,
        likes: 10,
        views: 100,
        sold: 24,
        author: 'nickName',
        type: enumSingleNFTType.BuyNow,
        blockNumber: 0,
        tokenIndex: '--',
        quantity: 0,
        royalties: 0,
        royaltyOwner: '--',
        holderName: '--',
        holder: '--',
        isLike: false,
        createTime: '--',
        updateTime: '--',
        tokenIdHex: '--',
        // type: "--",
        description: '--',
        thumbnail: '--',
        asset: '--',
        kind: '--',
        size: '--',
        adult: true,
        status: '--',

        instock: 0,
        endTime: '--',
        authorDescription: '--',
        authorImg: '--',
        authorAddress: '--',
    },
    {
        tokenId: '0',
        image: '/assets/images/explore/singlenft-template1.png',
        name: 'Project Title',
        price_ela: 199,
        price_usd: 88,
        likes: 10,
        views: 100,
        sold: 24,
        author: 'nickName',
        type: enumSingleNFTType.BuyNow,
        blockNumber: 0,
        tokenIndex: '--',
        quantity: 0,
        royalties: 0,
        royaltyOwner: '--',
        holderName: '--',
        holder: '--',
        isLike: false,
        createTime: '--',
        updateTime: '--',
        tokenIdHex: '--',
        // type: "--",
        description: '--',
        thumbnail: '--',
        asset: '--',
        kind: '--',
        size: '--',
        adult: true,
        status: '--',

        instock: 0,
        endTime: '--',
        authorDescription: '--',
        authorImg: '--',
        authorAddress: '--',
    },
];

export const singleNFTProducts: Array<TypeProduct> = [
    {
        tokenId: '0',
        image: '/assets/images/explore/singlenft-template1.png',
        name: 'Project Title',
        price_ela: 199,
        price_usd: 88,
        likes: 10,
        views: 100,
        sold: 24,
        author: 'nickName',
        type: enumSingleNFTType.BuyNow,
        authorDescription: '--',
        authorImg: '--',
        authorAddress: '--',
        description: '--',
        tokenIdHex: '--',
        royalties: 0,
        createTime: '--',
        holderName: '--',
        holder: '--',
        isLike: false,
    },
    {
        tokenId: '1',
        image: '/assets/images/explore/singlenft-template2.png',
        name: 'Project Title',
        price_ela: 199,
        price_usd: 88,
        likes: 10,
        views: 100,
        sold: 24,
        author: 'nickName',
        type: enumSingleNFTType.BuyNow,
        authorDescription: '--',
        authorImg: '--',
        authorAddress: '--',
        description: '--',
        tokenIdHex: '--',
        royalties: 0,
        createTime: '--',
        holderName: '--',
        holder: '--',
        isLike: false,
    },
    {
        tokenId: '2',
        image: '/assets/images/explore/singlenft-template3.png',
        name: 'Project Title',
        price_ela: 199,
        price_usd: 88,
        likes: 10,
        views: 100,
        sold: 24,
        author: 'nickName',
        type: enumSingleNFTType.OnAuction,
        authorDescription: '--',
        authorImg: '--',
        authorAddress: '--',
        description: '--',
        tokenIdHex: '--',
        royalties: 0,
        createTime: '--',
        holderName: '--',
        holder: '--',
        isLike: false,
    },
    {
        tokenId: '3',
        image: '/assets/images/explore/singlenft-template4.png',
        name: 'Project Title',
        price_ela: 199,
        price_usd: 88,
        likes: 10,
        views: 100,
        sold: 24,
        author: 'nickName',
        type: enumSingleNFTType.BuyNow,
        authorDescription: '--',
        authorImg: '--',
        authorAddress: '--',
        description: '--',
        tokenIdHex: '--',
        royalties: 0,
        createTime: '--',
        holderName: '--',
        holder: '--',
        isLike: false,
    },
    {
        tokenId: '4',
        image: '/assets/images/explore/singlenft-template1.png',
        name: 'Project Title',
        price_ela: 199,
        price_usd: 88,
        likes: 10,
        views: 100,
        sold: 24,
        author: 'nickName',
        type: enumSingleNFTType.BuyNow,
        authorDescription: '--',
        authorImg: '--',
        authorAddress: '--',
        description: '--',
        tokenIdHex: '--',
        royalties: 0,
        createTime: '--',
        holderName: '--',
        holder: '--',
        isLike: false,
    },
    {
        tokenId: '5',
        image: '/assets/images/explore/singlenft-template2.png',
        name: 'Project Title',
        price_ela: 199,
        price_usd: 88,
        likes: 10,
        views: 100,
        sold: 24,
        author: 'nickName',
        type: enumSingleNFTType.OnAuction,
        authorDescription: '--',
        authorImg: '--',
        authorAddress: '--',
        description: '--',
        tokenIdHex: '--',
        royalties: 0,
        createTime: '--',
        holderName: '--',
        holder: '--',
        isLike: false,
    },
    {
        tokenId: '6',
        image: '/assets/images/explore/singlenft-template3.png',
        name: 'Project Title',
        price_ela: 199,
        price_usd: 88,
        likes: 10,
        views: 100,
        sold: 24,
        author: 'nickName',
        type: enumSingleNFTType.BuyNow,
        authorDescription: '--',
        authorImg: '--',
        authorAddress: '--',
        description: '--',
        tokenIdHex: '--',
        royalties: 0,
        createTime: '--',
        holderName: '--',
        holder: '--',
        isLike: false,
    },
];

export const blindboxNFTProducts: Array<TypeProduct> = [
    {
        tokenId: '0',
        image: '/assets/images/blindbox/blindbox-nft-template1.png',
        name: 'Project Title',
        price_ela: 199,
        price_usd: 88,
        likes: 10,
        views: 100,
        sold: 24,
        author: 'nickName',
        type: enumBlindBoxNFTType.ComingSoon,
        endTime: '2022/02/28 10:00',
        authorDescription: '--',
        authorImg: '--',
        authorAddress: '--',
        description: '--',
        tokenIdHex: '--',
        royalties: 0,
        createTime: '--',
        holderName: '--',
        holder: '--',
        isLike: false,
    },
    {
        tokenId: '1',
        image: '/assets/images/blindbox/blindbox-nft-template1.png',
        name: 'Project Title',
        price_ela: 199,
        price_usd: 88,
        likes: 10,
        views: 100,
        sold: 24,
        author: 'nickName',
        type: enumBlindBoxNFTType.SaleEnds,
        endTime: '2022/02/28 10:00',
        authorDescription: '--',
        authorImg: '--',
        authorAddress: '--',
        description: '--',
        tokenIdHex: '--',
        royalties: 0,
        createTime: '--',
        holderName: '--',
        holder: '--',
        isLike: false,
    },
    {
        tokenId: '2',
        image: '/assets/images/blindbox/blindbox-nft-template2.png',
        name: 'Project Title',
        price_ela: 199,
        price_usd: 88,
        likes: 10,
        views: 100,
        sold: 24,
        author: 'nickName',
        type: enumBlindBoxNFTType.SaleEnded,
        authorDescription: '--',
        authorImg: '--',
        authorAddress: '--',
        description: '--',
        tokenIdHex: '--',
        royalties: 0,
        createTime: '--',
        holderName: '--',
        holder: '--',
        isLike: false,
    },
    {
        tokenId: '3',
        image: '/assets/images/blindbox/blindbox-nft-template3.png',
        name: 'Project Title',
        price_ela: 199,
        price_usd: 88,
        likes: 10,
        views: 100,
        sold: 24,
        author: 'nickName',
        type: enumBlindBoxNFTType.ComingSoon,
        endTime: '2022/02/28 10:00',
        authorDescription: '--',
        authorImg: '--',
        authorAddress: '--',
        description: '--',
        tokenIdHex: '--',
        royalties: 0,
        createTime: '--',
        holderName: '--',
        holder: '--',
        isLike: false,
    },
    {
        tokenId: '4',
        image: '/assets/images/blindbox/blindbox-nft-template4.png',
        name: 'Project Title',
        price_ela: 199,
        price_usd: 88,
        likes: 10,
        views: 100,
        sold: 24,
        author: 'nickName',
        type: enumBlindBoxNFTType.SaleEnds,
        endTime: '2022/02/28 10:00',
        authorDescription: '--',
        authorImg: '--',
        authorAddress: '--',
        description: '--',
        tokenIdHex: '--',
        royalties: 0,
        createTime: '--',
        holderName: '--',
        holder: '--',
        isLike: false,
    },
    {
        tokenId: '5',
        image: '/assets/images/blindbox/blindbox-nft-template1.png',
        name: 'Project Title',
        price_ela: 199,
        price_usd: 88,
        likes: 10,
        views: 100,
        sold: 24,
        author: 'nickName',
        type: enumBlindBoxNFTType.SaleEnded,
        authorDescription: '--',
        authorImg: '--',
        authorAddress: '--',
        description: '--',
        tokenIdHex: '--',
        royalties: 0,
        createTime: '--',
        holderName: '--',
        holder: '--',
        isLike: false,
    },
    {
        tokenId: '6',
        image: '/assets/images/blindbox/blindbox-nft-template2.png',
        name: 'Project Title',
        price_ela: 199,
        price_usd: 88,
        likes: 10,
        views: 100,
        sold: 24,
        author: 'nickName',
        type: enumBlindBoxNFTType.ComingSoon,
        endTime: '2022/02/28 10:00',
        authorDescription: '--',
        authorImg: '--',
        authorAddress: '--',
        description: '--',
        tokenIdHex: '--',
        royalties: 0,
        createTime: '--',
        holderName: '--',
        holder: '--',
        isLike: false,
    },
];

export const myNFTProducts: Array<TypeProduct> = [
    {
        tokenId: '0',
        image: '/assets/images/mynft/mynft-template1.png',
        name: 'Project Title',
        price_ela: 199,
        price_usd: 88,
        likes: 10,
        views: 100,
        sold: 24,
        author: 'nickName',
        type: enumMyNFTType.BuyNow,
        endTime: '2022/02/28 10:00',
        authorDescription: '--',
        authorImg: '--',
        authorAddress: '--',
        description: '--',
        tokenIdHex: '--',
        royalties: 0,
        createTime: '--',
        holderName: '--',
        holder: '--',
        isLike: false,
    },
    {
        tokenId: '1',
        image: '/assets/images/mynft/mynft-template2.png',
        name: 'Project Title',
        price_ela: 199,
        price_usd: 88,
        likes: 10,
        views: 100,
        sold: 24,
        author: 'nickName',
        type: enumMyNFTType.OnAuction,
        endTime: '2022/02/28 10:00',
        authorDescription: '--',
        authorImg: '--',
        authorAddress: '--',
        description: '--',
        tokenIdHex: '--',
        royalties: 0,
        createTime: '--',
        holderName: '--',
        holder: '--',
        isLike: false,
    },
    {
        tokenId: '2',
        image: '/assets/images/mynft/mynft-template3.png',
        name: 'Project Title',
        price_ela: 199,
        price_usd: 88,
        likes: 10,
        views: 100,
        sold: 24,
        author: 'nickName',
        type: enumMyNFTType.Created,
        authorDescription: '--',
        authorImg: '--',
        authorAddress: '--',
        description: '--',
        tokenIdHex: '--',
        royalties: 0,
        createTime: '--',
        holderName: '--',
        holder: '--',
        isLike: false,
    },
    {
        tokenId: '3',
        image: '/assets/images/mynft/mynft-template4.png',
        name: 'Project Title',
        price_ela: 199,
        price_usd: 88,
        likes: 10,
        views: 100,
        sold: 24,
        author: 'nickName',
        type: enumMyNFTType.Sold,
        endTime: '2022/02/28 10:00',
        authorDescription: '--',
        authorImg: '--',
        authorAddress: '--',
        description: '--',
        tokenIdHex: '--',
        royalties: 0,
        createTime: '--',
        holderName: '--',
        holder: '--',
        isLike: false,
    },
    {
        tokenId: '4',
        image: '/assets/images/mynft/mynft-template1.png',
        name: 'Project Title',
        price_ela: 199,
        price_usd: 88,
        likes: 10,
        views: 100,
        sold: 24,
        author: 'nickName',
        type: enumMyNFTType.BuyNow,
        endTime: '2022/02/28 10:00',
        authorDescription: '--',
        authorImg: '--',
        authorAddress: '--',
        description: '--',
        tokenIdHex: '--',
        royalties: 0,
        createTime: '--',
        holderName: '--',
        holder: '--',
        isLike: false,
    },
    {
        tokenId: '5',
        image: '/assets/images/mynft/mynft-template2.png',
        name: 'Project Title',
        price_ela: 199,
        price_usd: 88,
        likes: 10,
        views: 100,
        sold: 24,
        author: 'nickName',
        type: enumMyNFTType.OnAuction,
        authorDescription: '--',
        authorImg: '--',
        authorAddress: '--',
        description: '--',
        tokenIdHex: '--',
        royalties: 0,
        createTime: '--',
        holderName: '--',
        holder: '--',
        isLike: false,
    },
    {
        tokenId: '6',
        image: '/assets/images/mynft/mynft-template3.png',
        name: 'Project Title',
        price_ela: 199,
        price_usd: 88,
        likes: 10,
        views: 100,
        sold: 24,
        author: 'nickName',
        type: enumMyNFTType.Created,
        endTime: '2022/02/28 10:00',
        authorDescription: '--',
        authorImg: '--',
        authorAddress: '--',
        description: '--',
        tokenIdHex: '--',
        royalties: 0,
        createTime: '--',
        holderName: '--',
        holder: '--',
        isLike: false,
    },
    {
        tokenId: '7',
        image: '/assets/images/mynft/mynft-template4.png',
        name: 'Project Title',
        price_ela: 199,
        price_usd: 88,
        likes: 10,
        views: 100,
        sold: 24,
        author: 'nickName',
        type: enumMyNFTType.Sold,
        endTime: '2022/02/28 10:00',
        authorDescription: '--',
        authorImg: '--',
        authorAddress: '--',
        description: '--',
        tokenIdHex: '--',
        royalties: 0,
        createTime: '--',
        holderName: '--',
        holder: '--',
        isLike: false,
    },
];

export const nftTransactions: Array<TypeNFTTransaction> = [
    {
        type: enumTransactionType.Bid,
        user: 'Nickname',
        price: 199,
        time: '2022/02/28 10:00',
        txHash: '0x111111111111111111',
    },
    {
        type: enumTransactionType.OnAuction,
        user: 'Nickname',
        price: 199,
        time: '2022/02/28 10:00',
        txHash: '0x111111111111111111',
    },
    {
        type: enumTransactionType.SoldTo,
        user: 'Nickname',
        price: 199,
        time: '2022/02/28 10:00',
        txHash: '0x111111111111111111',
    },
    {
        type: enumTransactionType.ForSale,
        user: 'Nickname',
        price: 199,
        time: '2022/02/28 10:00',
        txHash: '0x111111111111111111',
    },
    {
        type: enumTransactionType.CreatedBy,
        user: 'Nickname',
        price: 199,
        time: '2022/02/28 10:00',
        txHash: '0x111111111111111111',
    },
];

export const singleNFTBids: Array<TypeSingleNFTBid> = [
    { user: 'Nickname', price: 199, time: '2022/02/28  10:00' },
    { user: 'Nickname', price: 199, time: '2022/02/28  10:00' },
    { user: 'Nickname', price: 199, time: '2022/02/28  10:00' },
    { user: 'Nickname', price: 199, time: '2022/02/28  10:00' },
    { user: 'Nickname', price: 199, time: '2022/02/28  10:00' },
    { user: 'Nickname', price: 199, time: '2022/02/28  10:00' },
];
