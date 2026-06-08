export interface LeaderboardEntry {
  rank: number
  address: string
  username: string
  avatar: string
  // Different ranking criteria
  totalBattles: number
  winRate: number
  totalWins: number
  totalCollectionValue: number
  rareCards: number
  legendaryCards: number
  lastBattleAt: number
  // Trading stats
  totalTrades: number
  successfulTrades: number
  // Rank change for trend indicator
  rankChange: number // positive = up, negative = down, 0 = no change
}

export type LeaderboardType = 'battles' | 'collection' | 'rarity' | 'trading'

export interface BattleResult {
  winner: string
  loser: string
  winnerAddress: string
  loserAddress: string
  timestamp: number
}

export interface TradeResult {
  buyer: string
  seller: string
  cardId: string
  price: number
  success: boolean
  timestamp: number
}
