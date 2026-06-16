// Re-export all card-related types from the primary source
export * from './card'

// Game-specific types
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
