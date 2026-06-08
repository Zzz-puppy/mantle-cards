import type { BattleResult, BattleRewards } from '@/types/battle'
import { Card } from '@/types/card'

export interface LeaderboardEntry {
  address: string
  wins: number
  losses: number
  totalBattles: number
  winRate: number
  rankingPoints: number
}

export interface BattleHistoryRecord {
  battleId: string
  timestamp: number
  result: BattleResult
  rewards: BattleRewards
}

class BattleRecorder {
  private battleHistory: BattleHistoryRecord[] = []
  private leaderboard: Map<string, LeaderboardEntry> = new Map()

  async recordBattle(result: BattleResult): Promise<BattleHistoryRecord> {
    const rewards = this.calculateRewards(result)
    
    const record: BattleHistoryRecord = {
      battleId: result.id,
      timestamp: Date.now(),
      result,
      rewards,
    }

    this.battleHistory.push(record)
    this.updateLeaderboard(result)

    // TODO: Emit battle event for smart contract recording
    // await this.emitBattleEvent(result, rewards)

    // TODO: Update leaderboard data on-chain
    // await this.updateLeaderboardOnChain(result)

    return record
  }

  private calculateRewards(result: BattleResult): BattleRewards {
    const baseExp = 100
    const baseTokens = 50
    const baseRankingPoints = 25

    const isWinner = result.winner === 'player'
    const multiplier = isWinner ? 1.5 : 1

    const rarityBonus = this.getRarityBonus(result.playerCard)

    return {
      exp: Math.floor(baseExp * multiplier + rarityBonus.exp),
      tokens: Math.floor(baseTokens * multiplier + rarityBonus.tokens),
      rankingPoints: isWinner 
        ? Math.floor(baseRankingPoints * multiplier + rarityBonus.rankingPoints) 
        : 0,
    }
  }

  private getRarityBonus(card: Card): BattleRewards {
    const rarityMultipliers: Record<string, number> = {
      legendary: 3,
      epic: 2,
      rare: 1.5,
      common: 1,
    }

    const multiplier = rarityMultipliers[card.rarity?.toLowerCase() || 'common'] || 1

    return {
      exp: multiplier * 50,
      tokens: multiplier * 25,
      rankingPoints: multiplier * 10,
    }
  }

  private updateLeaderboard(result: BattleResult): void {
    const playerEntry = this.leaderboard.get(result.player) || {
      address: result.player,
      wins: 0,
      losses: 0,
      totalBattles: 0,
      winRate: 0,
      rankingPoints: 0,
    }

    playerEntry.totalBattles++
    if (result.winner === 'player') {
      playerEntry.wins++
    } else {
      playerEntry.losses++
    }
    playerEntry.winRate = (playerEntry.wins / playerEntry.totalBattles) * 100

    this.leaderboard.set(result.player, playerEntry)

    // Also update opponent entry
    const opponentEntry = this.leaderboard.get(result.opponent) || {
      address: result.opponent,
      wins: 0,
      losses: 0,
      totalBattles: 0,
      winRate: 0,
      rankingPoints: 0,
    }

    opponentEntry.totalBattles++
    if (result.winner === 'opponent') {
      opponentEntry.wins++
    } else {
      opponentEntry.losses++
    }
    opponentEntry.winRate = (opponentEntry.wins / opponentEntry.totalBattles) * 100

    this.leaderboard.set(result.opponent, opponentEntry)
  }

  getBattleHistory(address?: string): BattleHistoryRecord[] {
    if (!address) return this.battleHistory
    return this.battleHistory.filter(
      record => record.result.player === address || record.result.opponent === address
    )
  }

  getLeaderboard(): LeaderboardEntry[] {
    return Array.from(this.leaderboard.values())
      .sort((a, b) => b.rankingPoints - a.rankingPoints)
  }

  getPlayerStats(address: string): LeaderboardEntry | null {
    return this.leaderboard.get(address) || null
  }

  // Smart contract integration stubs
  async recordBattleOnChain(result: BattleResult): Promise<boolean> {
    // TODO: Implement smart contract call
    // const contract = getBattleContract()
    // const tx = await contract.recordBattle(
    //   result.id,
    //   result.player,
    //   result.opponent,
    //   result.playerCard.id,
    //   result.opponentCard.id,
    //   result.playerDamage,
    //   result.opponentDamage,
    //   result.winner === 'player'
    // )
    // await tx.wait()
    console.log('Recording battle on chain:', result.id)
    return true
  }

  async getBattleHistoryFromChain(address: string): Promise<BattleResult[]> {
    // TODO: Implement smart contract call
    // const contract = getBattleContract()
    // const battles = await contract.getBattleHistory(address)
    // return battles.map(parseBattleResult)
    console.log('Fetching battle history from chain for:', address)
    return []
  }

  emitBattleEvent(result: BattleResult): void {
    // TODO: Emit event for real-time updates
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('battle-recorded', { detail: result }))
    }
  }

  subscribeToBattleEvents(callback: (result: BattleResult) => void): () => void {
    if (typeof window === 'undefined') return () => {}
    
    const handler = (event: CustomEvent<BattleResult>) => callback(event.detail)
    window.addEventListener('battle-recorded', handler as EventListener)
    
    return () => {
      window.removeEventListener('battle-recorded', handler as EventListener)
    }
  }
}

export const battleRecorder = new BattleRecorder()

// Smart contract ABI for battle recording (to be added to contracts)
export const BATTLE_CONTRACT_ABI = [
  'function recordBattle(string memory battleId, address player, address opponent, uint256 playerCardId, uint256 opponentCardId, uint256 playerDamage, uint256 opponentDamage, bool playerWon) external',
  'function getBattleHistory(address player) external view returns (tuple(string battleId, address player, address opponent, uint256 playerCardId, uint256 opponentCardId, uint256 playerDamage, uint256 opponentDamage, bool playerWon, uint256 timestamp)[] memory)',
  'event BattleRecorded(string battleId, address indexed player, address indexed opponent, uint256 timestamp)',
]
