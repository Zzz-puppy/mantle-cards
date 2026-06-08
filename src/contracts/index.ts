// Smart contracts will be deployed here
// Contract ABIs and addresses will be added post-deployment

import { mantleMainnet, mantleSepolia } from '@/lib/wagmi-config'

export const CONTRACT_ADDRESSES = {
  [mantleMainnet.id]: {
    MantleCards: '0x0000000000000000000000000000000000000000',
    Marketplace: '0x0000000000000000000000000000000000000000',
    AgentIdentity: '0x0000000000000000000000000000000000000000',
    ERC8004: '0x0000000000000000000000000000000000000000',
  },
  [mantleSepolia.id]: {
    MantleCards: '0x0000000000000000000000000000000000000000',
    Marketplace: '0x0000000000000000000000000000000000000000',
    AgentIdentity: '0x0000000000000000000000000000000000000000',
    ERC8004: '0x0000000000000000000000000000000000000000',
  },
} as const

// Marketplace contract ABI
export const MARKETPLACE_ABI = [
  {
    inputs: [
      { name: 'nftContract', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
      { name: 'price', type: 'uint256' },
      { name: 'description', type: 'string' },
    ],
    name: 'createListing',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ name: 'listingId', type: 'uint256' }],
    name: 'buyListing',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ name: 'listingId', type: 'uint256' }],
    name: 'cancelListing',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'listingId', type: 'uint256' },
      { name: 'newPrice', type: 'uint256' },
    ],
    name: 'updatePrice',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getActiveListings',
    outputs: [
      {
        components: [
          { name: 'listingId', type: 'uint256' },
          { name: 'seller', type: 'address' },
          { name: 'nftContract', type: 'address' },
          { name: 'tokenId', type: 'uint256' },
          { name: 'price', type: 'uint256' },
          { name: 'description', type: 'string' },
          { name: 'createdAt', type: 'uint256' },
          { name: 'isActive', type: 'bool' },
        ],
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'activeOnly', type: 'bool' },
    ],
    name: 'getUserListings',
    outputs: [
      {
        components: [
          { name: 'listingId', type: 'uint256' },
          { name: 'seller', type: 'address' },
          { name: 'nftContract', type: 'address' },
          { name: 'tokenId', type: 'uint256' },
          { name: 'price', type: 'uint256' },
          { name: 'description', type: 'string' },
          { name: 'createdAt', type: 'uint256' },
          { name: 'isActive', type: 'bool' },
        ],
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'listingId', type: 'uint256' }],
    name: 'getListing',
    outputs: [
      {
        components: [
          { name: 'listingId', type: 'uint256' },
          { name: 'seller', type: 'address' },
          { name: 'nftContract', type: 'address' },
          { name: 'tokenId', type: 'uint256' },
          { name: 'price', type: 'uint256' },
          { name: 'description', type: 'string' },
          { name: 'createdAt', type: 'uint256' },
          { name: 'isActive', type: 'bool' },
        ],
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'price', type: 'uint256' }],
    name: 'getMarketplaceFee',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [{ name: 'price', type: 'uint256' }],
    name: 'getCreatorRoyalty',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [{ name: 'price', type: 'uint256' }],
    name: 'getTotalPrice',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'LISTING_FEE',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MARKETPLACE_FEE_PERCENT',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'CREATOR_ROYALTY_PERCENT',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'listingId', type: 'uint256' }],
    name: 'listingExists',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'listingId', type: 'uint256' },
      { indexed: true, name: 'seller', type: 'address' },
      { indexed: true, name: 'nftContract', type: 'address' },
      { indexed: false, name: 'tokenId', type: 'uint256' },
      { indexed: false, name: 'price', type: 'uint256' },
    ],
    name: 'ListingCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'listingId', type: 'uint256' },
      { indexed: true, name: 'buyer', type: 'address' },
      { indexed: true, name: 'seller', type: 'address' },
      { indexed: false, name: 'price', type: 'uint256' },
      { indexed: false, name: 'marketplaceFee', type: 'uint256' },
      { indexed: false, name: 'creatorRoyalty', type: 'uint256' },
    ],
    name: 'ListingPurchased',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'listingId', type: 'uint256' },
      { indexed: true, name: 'seller', type: 'address' },
    ],
    name: 'ListingCancelled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'listingId', type: 'uint256' },
      { indexed: false, name: 'oldPrice', type: 'uint256' },
      { indexed: false, name: 'newPrice', type: 'uint256' },
    ],
    name: 'ListingPriceUpdated',
    type: 'event',
  },
] as const

// Contract function signatures for marketplace
export const MARKETPLACE_FUNCTIONS = {
  CREATE_LISTING: 'createListing',
  BUY_LISTING: 'buyListing',
  CANCEL_LISTING: 'cancelListing',
  UPDATE_PRICE: 'updatePrice',
  GET_ACTIVE_LISTINGS: 'getActiveListings',
  GET_USER_LISTINGS: 'getUserListings',
  GET_LISTING: 'getListing',
  GET_MARKETPLACE_FEE: 'getMarketplaceFee',
  GET_CREATOR_ROYALTY: 'getCreatorRoyalty',
  GET_TOTAL_PRICE: 'getTotalPrice',
} as const

// Fee constants
export const FEE_CONSTANTS = {
  LISTING_FEE: BigInt('1000000000000000'), // 0.001 MNT in wei
  MARKETPLACE_FEE_PERCENT: 250, // 2.5%
  CREATOR_ROYALTY_PERCENT: 500, // 5%
  FEE_DENOMINATOR: 10000,
} as const

// Get contract address by chain ID
export function getMarketplaceAddress(chainId: number): `0x${string}` {
  const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  if (!addresses?.Marketplace) {
    throw new Error(`Marketplace not configured for chain ID: ${chainId}`)
  }
  return addresses.Marketplace
}

// Check if marketplace is deployed on chain
export function isMarketplaceDeployed(chainId: number): boolean {
  const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  if (!addresses?.Marketplace) return false
  return addresses.Marketplace !== '0x0000000000000000000000000000000000000000'
}
