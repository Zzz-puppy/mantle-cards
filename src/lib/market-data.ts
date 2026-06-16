import type { Card } from '@/types'
import { CardType, CardRarity } from '@/types'
import type { Listing } from '@/components/marketplace'

const mockCards: Card[] = [
  {
    id: '1',
    name: 'Dragon Knight',
    type: CardType.Attack,
    rarity: CardRarity.Legendary,
    attack: 95,
    defense: 70,
    ability: 'Ignites the battlefield, dealing 50% bonus fire damage to all enemies.',
    owner: '0x1234567890123456789012345678901234567890',
    tokenId: BigInt(1),
  },
  {
    id: '2',
    name: 'Frost Mage',
    type: CardType.Special,
    rarity: CardRarity.Epic,
    attack: 80,
    defense: 45,
    ability: 'Freezes enemies for 2 turns, reducing their attack by 40%.',
    owner: '0x1234567890123456789012345678901234567890',
    tokenId: BigInt(2),
  },
  {
    id: '3',
    name: 'Shield Bearer',
    type: CardType.Defense,
    rarity: CardRarity.Rare,
    attack: 30,
    defense: 90,
    ability: 'Creates a protective barrier that absorbs the next 3 attacks.',
    owner: '0x2345678901234567890123456789012345678901',
    tokenId: BigInt(3),
  },
  {
    id: '4',
    name: 'Shadow Assassin',
    type: CardType.Attack,
    rarity: CardRarity.Epic,
    attack: 88,
    defense: 35,
    ability: 'Attacks from the shadows, ignoring 60% of enemy defense.',
    owner: '0x2345678901234567890123456789012345678901',
    tokenId: BigInt(4),
  },
  {
    id: '5',
    name: 'Forest Guardian',
    type: CardType.Support,
    rarity: CardRarity.Rare,
    attack: 50,
    defense: 65,
    ability: 'Heals all allies for 25% of their max health at turn start.',
    owner: '0x1234567890123456789012345678901234567890',
    tokenId: BigInt(5),
  },
  {
    id: '6',
    name: 'Goblin Scout',
    type: CardType.Attack,
    rarity: CardRarity.Common,
    attack: 25,
    defense: 15,
    owner: '0x1234567890123456789012345678901234567890',
    tokenId: BigInt(6),
  },
  {
    id: '7',
    name: 'Phoenix Riser',
    type: CardType.Special,
    rarity: CardRarity.Legendary,
    attack: 85,
    defense: 80,
    ability: 'Revives once per battle with 50% health. Deals burn damage over 3 turns.',
    owner: '0x3456789012345678901234567890123456789012',
    tokenId: BigInt(7),
  },
  {
    id: '8',
    name: 'Stone Golem',
    type: CardType.Defense,
    rarity: CardRarity.Common,
    attack: 20,
    defense: 75,
    owner: '0x2345678901234567890123456789012345678901',
    tokenId: BigInt(8),
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