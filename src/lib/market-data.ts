import type { Card } from '@/types/card'
import type { Listing } from '@/components/marketplace'

const mockCards: Card[] = [
  {
    id: BigInt(1),
    name: 'Dragon Knight',
    rarity: 'legendary',
    attack: 95,
    defense: 70,
    specialAbility: 'Ignites the battlefield, dealing 50% bonus fire damage to all enemies.',
    image: '',
    owner: '0x1234567890123456789012345678901234567890',
    mintedAt: Date.now(),
    baseToken: 'DRG',
    tokenBalance: BigInt(1000000),
    transactionCount: 150,
  },
  {
    id: BigInt(2),
    name: 'Frost Mage',
    rarity: 'epic',
    attack: 80,
    defense: 45,
    specialAbility: 'Freezes enemies for 2 turns, reducing their attack by 40%.',
    image: '',
    owner: '0x1234567890123456789012345678901234567890',
    mintedAt: Date.now(),
    baseToken: 'FRZ',
    tokenBalance: BigInt(500000),
    transactionCount: 80,
  },
  {
    id: BigInt(3),
    name: 'Shield Bearer',
    rarity: 'rare',
    attack: 30,
    defense: 90,
    specialAbility: 'Creates a protective barrier that absorbs the next 3 attacks.',
    image: '',
    owner: '0x2345678901234567890123456789012345678901',
    mintedAt: Date.now(),
    baseToken: 'SHD',
    tokenBalance: BigInt(200000),
    transactionCount: 60,
  },
  {
    id: BigInt(4),
    name: 'Shadow Assassin',
    rarity: 'epic',
    attack: 88,
    defense: 35,
    specialAbility: 'Attacks from the shadows, ignoring 60% of enemy defense.',
    image: '',
    owner: '0x2345678901234567890123456789012345678901',
    mintedAt: Date.now(),
    baseToken: 'SHD',
    tokenBalance: BigInt(450000),
    transactionCount: 90,
  },
  {
    id: BigInt(5),
    name: 'Forest Guardian',
    rarity: 'rare',
    attack: 50,
    defense: 65,
    specialAbility: 'Heals all allies for 25% of their max health at turn start.',
    image: '',
    owner: '0x1234567890123456789012345678901234567890',
    mintedAt: Date.now(),
    baseToken: 'FOR',
    tokenBalance: BigInt(300000),
    transactionCount: 45,
  },
  {
    id: BigInt(6),
    name: 'Goblin Scout',
    rarity: 'common',
    attack: 25,
    defense: 15,
    specialAbility: '',
    image: '',
    owner: '0x1234567890123456789012345678901234567890',
    mintedAt: Date.now(),
    baseToken: 'GBL',
    tokenBalance: BigInt(50000),
    transactionCount: 20,
  },
  {
    id: BigInt(7),
    name: 'Phoenix Riser',
    rarity: 'legendary',
    attack: 85,
    defense: 80,
    specialAbility: 'Revives once per battle with 50% health. Deals burn damage over 3 turns.',
    image: '',
    owner: '0x3456789012345678901234567890123456789012',
    mintedAt: Date.now(),
    baseToken: 'PHX',
    tokenBalance: BigInt(900000),
    transactionCount: 120,
  },
  {
    id: BigInt(8),
    name: 'Stone Golem',
    rarity: 'common',
    attack: 20,
    defense: 75,
    specialAbility: '',
    image: '',
    owner: '0x2345678901234567890123456789012345678901',
    mintedAt: Date.now(),
    baseToken: 'STN',
    tokenBalance: BigInt(100000),
    transactionCount: 35,
  },
]

export function generateMockListings(): Listing[] {
  return [
    {
      listingId: 1,
      seller: '0x1234567890123456789012345678901234567890',
      tokenId: 1,
      price: BigInt('500000000000000000'),
      description: 'Legendary Dragon Knight, perfect for aggressive decks!',
      createdAt: Date.now() - 86400000 * 2,
      isActive: true,
    },
    {
      listingId: 2,
      seller: '0x2345678901234567890123456789012345678901',
      tokenId: 2,
      price: BigInt('300000000000000000'),
      description: 'Epic Frost Mage with amazing control abilities.',
      createdAt: Date.now() - 86400000,
      isActive: true,
    },
    {
      listingId: 3,
      seller: '0x1234567890123456789012345678901234567890',
      tokenId: 3,
      price: BigInt('150000000000000000'),
      description: 'Rare Shield Bearer, great defensive card.',
      createdAt: Date.now() - 86400000 * 3,
      isActive: true,
    },
    {
      listingId: 4,
      seller: '0x3456789012345678901234567890123456789012',
      tokenId: 4,
      price: BigInt('350000000000000000'),
      description: 'Epic Shadow Assassin, deadly assassin build.',
      createdAt: Date.now() - 86400000 * 4,
      isActive: true,
    },
    {
      listingId: 5,
      seller: '0x2345678901234567890123456789012345678901',
      tokenId: 5,
      price: BigInt('120000000000000000'),
      description: 'Rare Forest Guardian, excellent support.',
      createdAt: Date.now() - 86400000 * 5,
      isActive: true,
    },
    {
      listingId: 6,
      seller: '0x4567890123456789012345678901234567890123',
      tokenId: 6,
      price: BigInt('25000000000000000'),
      description: '',
      createdAt: Date.now() - 86400000 * 6,
      isActive: true,
    },
    {
      listingId: 7,
      seller: '0x5678901234567890123456789012345678901234',
      tokenId: 7,
      price: BigInt('800000000000000000'),
      description: 'Legendary Phoenix Riser, ultimate revive card!',
      createdAt: Date.now() - 86400000 * 7,
      isActive: true,
    },
    {
      listingId: 8,
      seller: '0x3456789012345678901234567890123456789012',
      tokenId: 8,
      price: BigInt('20000000000000000'),
      description: 'Common but reliable Stone Golem.',
      createdAt: Date.now() - 86400000 * 8,
      isActive: true,
    },
  ]
}

export function getCards(): Card[] {
  return mockCards
}

export function getCardsMap(): Map<number, Card> {
  const map = new Map<number, Card>()
  mockCards.forEach(card => {
    map.set(Number(card.tokenId), card)
  })
  return map
}

export function getUserCards(userAddress: string): Card[] {
  return mockCards.filter(card => 
    card.owner.toLowerCase() === userAddress.toLowerCase()
  ).slice(0, 4)
}

export async function fetchMarketListings(): Promise<Listing[]> {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return generateMockListings()
}