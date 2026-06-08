export interface Card {
  id: string
  name: string
  type: CardType
  rarity: CardRarity
  attack: number
  defense: number
  ability?: string
  imageUrl?: string
  owner: string
  tokenId: bigint
}

export enum CardType {
  Attack = 'Attack',
  Defense = 'Defense',
  Support = 'Support',
  Special = 'Special',
}

export enum CardRarity {
  Common = 'Common',
  Rare = 'Rare',
  Epic = 'Epic',
  Legendary = 'Legendary',
}

export interface GameState {
  playerHealth: number
  opponentHealth: number
  playerDeck: Card[]
  opponentDeck: Card[]
  currentTurn: 'player' | 'opponent'
  battleLog: string[]
}

export interface PlayerStats {
  address: string
  cardsOwned: number
  wins: number
  losses: number
  rank: number
}
