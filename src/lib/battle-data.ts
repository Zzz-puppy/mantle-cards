import { Card } from '@/types/card'
import { generateMockCard, createMockPortfolio } from './mock-data'
import { generateCardAttributes, generateCardImageURL } from './card-generator'

const rarityDistribution = ['legendary', 'epic', 'rare', 'rare', 'common', 'common'] as const

export function generateBattleDeck(count: number = 6): Card[] {
  const cards: Card[] = []

  for (let i = 0; i < count; i++) {
    const rarity = rarityDistribution[i % rarityDistribution.length]

    const portfolio = createMockPortfolio({
      mntBalance: BigInt(Math.floor(Math.random() * 10) * 1e18),
      erc20Count: Math.floor(Math.random() * 5),
      txCount: Math.floor(Math.random() * 1000),
    })

    const attributes = generateCardAttributes(portfolio, rarity)
    const card: Card = {
      id: BigInt(i + 1),
      name: attributes.name,
      rarity: attributes.rarity,
      attack: attributes.attack,
      defense: attributes.defense,
      specialAbility: attributes.specialAbility,
      image: generateCardImageURL(i + 1, attributes.rarity),
      owner: '0xPlayer',
      mintedAt: Date.now(),
      baseToken: attributes.baseToken,
      tokenBalance: attributes.tokenBalance,
      transactionCount: attributes.transactionCount,
    }

    cards.push(card)
  }

  return cards
}

export function getPresetBattleDeck(): Card[] {
  return generateBattleDeck(6)
}

export function generateAIDeck(playerCards: Card[], difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Card[] {
  const difficultyMultiplier = {
    easy: 0.8,
    medium: 1.0,
    hard: 1.2
  }[difficulty]

  return playerCards.map((card, index) => ({
    ...card,
    id: BigInt(Number(card.id) + 1000 + index),
    attack: Math.min(100, Math.max(1, Math.floor(card.attack * difficultyMultiplier))),
    defense: Math.min(100, Math.max(1, Math.floor(card.defense * difficultyMultiplier))),
    owner: '0xAI',
  }))
}