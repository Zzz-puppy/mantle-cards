export interface Card {
  id: bigint
  name: string
  rarity: CardRarity
  attack: number
  defense: number
  specialAbility: string
  image: string
  owner: `0x${string}`
  mintedAt: number
  // Dynamic attributes based on on-chain data
  baseToken: string
  tokenBalance: bigint
  transactionCount: number
}

export type CardRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface CardAttributes {
  attack: number
  defense: number
  specialAbility: string
  rarity: CardRarity
  baseToken: string
  tokenBalance: bigint
  transactionCount: number
}

export interface CardMintParams {
  name: string
  rarity: CardRarity
  attack: number
  defense: number
  specialAbility: string
  imageURI: string
}

export interface CardMintedEvent {
  tokenId: bigint
  owner: `0x${string}`
  name: string
  rarity: CardRarity
  timestamp: number
}

export interface CardTransferEvent {
  tokenId: bigint
  from: `0x${string}`
  to: `0x${string}`
  timestamp: number
}
