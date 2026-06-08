import { LeaderboardEntry, LeaderboardType, BattleResult, TradeResult } from '@/types/leaderboard'

// Mock data store for leaderboard entries (in production, this would be a database)
let leaderboardData: Map<LeaderboardType, LeaderboardEntry[]> = new Map([
  ['battles', generateMockData('battles')],
  ['collection', generateMockData('collection')],
  ['rarity', generateMockData('rarity')],
  ['trading', generateMockData('trading')],
])

function generateMockData(type: LeaderboardType): LeaderboardEntry[] {
  const mockUsers = [
    { address: '0x1234...abcd', username: 'CryptoKing', avatar: '👑' },
    { address: '0x5678...efgh', username: 'CardMaster', avatar: '🎴' },
    { address: '0x9abc...ijkl', username: 'BattleLord', avatar: '⚔️' },
    { address: '0xdef0...mnop', username: 'NFTCollector', avatar: '🃏' },
    { address: '0x1111...2222', username: 'TradeKing', avatar: '💎' },
    { address: '0x3333...4444', username: 'DragonSlayer', avatar: '🐉' },
    { address: '0x5555...6666', username: 'PhoenixRider', avatar: '🔥' },
    { address: '0x7777...8888', username: 'ShadowNinja', avatar: '🥷' },
    { address: '0x9999...aaaa', username: 'GoldRush', avatar: '💰' },
    { address: '0xbbbb...cccc', username: 'IceBreaker', avatar: '❄️' },
  ]

  return mockUsers.map((user, index) => {
    const baseStats = {
      totalBattles: Math.floor(Math.random() * 500) + 50,
      winRate: Math.random() * 0.6 + 0.4,
      totalWins: 0,
      totalCollectionValue: Math.floor(Math.random() * 100000) + 10000,
      rareCards: Math.floor(Math.random() * 50) + 10,
      legendaryCards: Math.floor(Math.random() * 10) + 1,
      lastBattleAt: Date.now() - Math.floor(Math.random() * 86400000 * 7),
      totalTrades: Math.floor(Math.random() * 200) + 20,
      successfulTrades: 0,
      rankChange: Math.floor(Math.random() * 11) - 5,
    }
    baseStats.totalWins = Math.floor(baseStats.totalBattles * baseStats.winRate)
    baseStats.successfulTrades = Math.floor(baseStats.totalTrades * 0.85)

    return {
      rank: index + 1,
      ...user,
      ...baseStats,
    }
  }).sort((a, b) => {
    switch (type) {
      case 'battles':
        return b.totalWins - a.totalWins || b.winRate - a.winRate
      case 'collection':
        return b.totalCollectionValue - a.totalCollectionValue || b.rareCards - a.rareCards
      case 'rarity':
        return b.legendaryCards - a.legendaryCards || b.rareCards - a.rareCards
      case 'trading':
        return b.successfulTrades - a.successfulTrades
      default:
        return 0
    }
  }).map((entry, index) => ({ ...entry, rank: index + 1 }))
}

function recalculateRanks(type: LeaderboardType): void {
  const data = leaderboardData.get(type) || []
  const sorted = data.sort((a, b) => {
    switch (type) {
      case 'battles':
        return b.totalWins - a.totalWins || b.winRate - a.winRate
      case 'collection':
        return b.totalCollectionValue - a.totalCollectionValue || b.rareCards - a.rareCards
      case 'rarity':
        return b.legendaryCards - a.legendaryCards || b.rareCards - a.rareCards
      case 'trading':
        return b.successfulTrades - a.successfulTrades
      default:
        return 0
    }
  })
  leaderboardData.set(type, sorted.map((entry, index) => ({ ...entry, rank: index + 1 })))
}

/**
 * Get leaderboard data for a specific type
 */
export function getLeaderboard(
  type: LeaderboardType,
  limit: number = 100,
  offset: number = 0
): LeaderboardEntry[] {
  const data = leaderboardData.get(type) || []
  return data.slice(offset, offset + limit)
}

/**
 * Get a specific user's rank
 */
export function getUserRank(address: string, type: LeaderboardType): LeaderboardEntry | null {
  const data = leaderboardData.get(type) || []
  return data.find(entry => entry.address.toLowerCase() === address.toLowerCase()) || null
}

/**
 * Update leaderboard after a battle
 */
export function updateLeaderboardAfterBattle(result: BattleResult): void {
  const allTypes = ['battles', 'collection', 'rarity', 'trading'] as LeaderboardType[]
  
  for (const type of allTypes) {
    const data = leaderboardData.get(type) || []
    
    // Update winner stats
    let winnerEntry = data.find(e => e.address.toLowerCase() === result.winnerAddress.toLowerCase())
    if (winnerEntry) {
      winnerEntry.totalBattles += 1
      winnerEntry.totalWins += 1
      winnerEntry.winRate = winnerEntry.totalWins / winnerEntry.totalBattles
      winnerEntry.lastBattleAt = result.timestamp
      winnerEntry.rankChange = 1 // Assume they moved up
    } else {
      // Create new entry for winner
      data.push({
        rank: 0,
        address: result.winnerAddress,
        username: `Player_${result.winnerAddress.slice(0, 6)}`,
        avatar: '🎮',
        totalBattles: 1,
        winRate: 1,
        totalWins: 1,
        totalCollectionValue: 0,
        rareCards: 0,
        legendaryCards: 0,
        lastBattleAt: result.timestamp,
        totalTrades: 0,
        successfulTrades: 0,
        rankChange: 1,
      })
    }

    // Update loser stats
    let loserEntry = data.find(e => e.address.toLowerCase() === result.loserAddress.toLowerCase())
    if (loserEntry) {
      loserEntry.totalBattles += 1
      loserEntry.winRate = loserEntry.totalWins / loserEntry.totalBattles
      loserEntry.lastBattleAt = result.timestamp
      loserEntry.rankChange = -1 // Assume they moved down
    } else {
      // Create new entry for loser
      data.push({
        rank: 0,
        address: result.loserAddress,
        username: `Player_${result.loserAddress.slice(0, 6)}`,
        avatar: '🎮',
        totalBattles: 1,
        winRate: 0,
        totalWins: 0,
        totalCollectionValue: 0,
        rareCards: 0,
        legendaryCards: 0,
        lastBattleAt: result.timestamp,
        totalTrades: 0,
        successfulTrades: 0,
        rankChange: -1,
      })
    }

    leaderboardData.set(type, data)
    recalculateRanks(type)
  }
}

/**
 * Update leaderboard after a trade
 */
export function updateLeaderboardAfterTrade(trade: TradeResult): void {
  const data = leaderboardData.get('trading') || []
  
  // Update buyer's trade stats
  let buyerEntry = data.find(e => e.address.toLowerCase() === trade.buyer.toLowerCase())
  if (buyerEntry) {
    buyerEntry.totalTrades += 1
    if (trade.success) {
      buyerEntry.successfulTrades += 1
    }
  } else if (trade.success) {
    data.push({
      rank: 0,
      address: trade.buyer,
      username: `Player_${trade.buyer.slice(0, 6)}`,
      avatar: '💼',
      totalBattles: 0,
      winRate: 0,
      totalWins: 0,
      totalCollectionValue: 0,
      rareCards: 0,
      legendaryCards: 0,
      lastBattleAt: 0,
      totalTrades: 1,
      successfulTrades: 1,
      rankChange: 0,
    })
  }

  // Update seller's trade stats
  let sellerEntry = data.find(e => e.address.toLowerCase() === trade.seller.toLowerCase())
  if (sellerEntry) {
    sellerEntry.totalTrades += 1
    if (trade.success) {
      sellerEntry.successfulTrades += 1
    }
  } else if (trade.success) {
    data.push({
      rank: 0,
      address: trade.seller,
      username: `Player_${trade.seller.slice(0, 6)}`,
      avatar: '💼',
      totalBattles: 0,
      winRate: 0,
      totalWins: 0,
      totalCollectionValue: 0,
      rareCards: 0,
      legendaryCards: 0,
      lastBattleAt: 0,
      totalTrades: 1,
      successfulTrades: 1,
      rankChange: 0,
    })
  }

  leaderboardData.set('trading', data)
  recalculateRanks('trading')
}

/**
 * Get top N players for a specific type
 */
export function getTopPlayers(type: LeaderboardType, count: number = 10): LeaderboardEntry[] {
  return getLeaderboard(type, count, 0)
}

/**
 * Get ranking criteria description for each type
 */
export function getRankingCriteria(type: LeaderboardType): { label: string; description: string } {
  switch (type) {
    case 'battles':
      return { label: 'Battle Champion', description: 'Ranked by total wins and win rate' }
    case 'collection':
      return { label: 'Collection Master', description: 'Ranked by collection value and rare cards' }
    case 'rarity':
      return { label: 'Rarity Hunter', description: 'Ranked by legendary and epic cards' }
    case 'trading':
      return { label: 'Trade King', description: 'Ranked by successful trades' }
    default:
      return { label: 'Unknown', description: '' }
  }
}
