import { Card } from './card'

export interface BattleState {
  player: {
    cards: Card[]
    selectedCard: Card | null
    health: number
  }
  opponent: {
    cards: Card[]
    selectedCard: Card | null
    health: number
  }
  turn: 'player' | 'opponent'
  round: number
  maxRounds: number
  status: BattleStatus
  winner: 'player' | 'opponent' | null
}

export type BattleStatus = 'idle' | 'selecting' | 'battling' | 'finished'

export interface BattleResult {
  id: string
  player: string
  opponent: string
  playerCard: Card
  opponentCard: Card
  playerDamage: number
  opponentDamage: number
  winner: 'player' | 'opponent'
  timestamp: number
}

export interface BattleLogEntry {
  round: number
  action: 'select' | 'attack' | 'ability' | 'damage' | 'victory' | 'defeat'
  actor: 'player' | 'opponent'
  cardName: string
  message: string
  damage?: number
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard'

export interface AIDifficulty {
  level: DifficultyLevel
  name: string
  description: string
  winChance: number
}

export interface TradingPattern {
  style: 'aggressive' | 'conservative' | 'balanced'
  avgTransactionSize: number
  transactionFrequency: number
  riskTolerance: number
  preferredRarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface BattleRewards {
  exp: number
  tokens: number
  rankingPoints: number
}
