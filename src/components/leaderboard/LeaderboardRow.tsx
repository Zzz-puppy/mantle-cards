'use client'

import { LeaderboardEntry, LeaderboardType } from '@/types/leaderboard'

interface LeaderboardRowProps {
  entry: LeaderboardEntry
  type: LeaderboardType
  isCurrentUser?: boolean
}

export function LeaderboardRow({ entry, type, isCurrentUser = false }: LeaderboardRowProps) {
  const getRankBadge = (rank: number) => {
    if (rank === 1) return { bg: 'bg-yellow-500', text: 'text-black', icon: '🥇' }
    if (rank === 2) return { bg: 'bg-gray-400', text: 'text-black', icon: '🥈' }
    if (rank === 3) return { bg: 'bg-amber-700', text: 'text-white', icon: '🥉' }
    return { bg: 'bg-gray-700', text: 'text-white', icon: '' }
  }

  const getStatsForType = () => {
    switch (type) {
      case 'battles':
        return (
          <div className="flex gap-6 text-sm">
            <div className="text-center">
              <span className="text-gray-400">Wins</span>
              <p className="font-bold text-green-400">{entry.totalWins}</p>
            </div>
            <div className="text-center">
              <span className="text-gray-400">Win Rate</span>
              <p className="font-bold text-blue-400">{(entry.winRate * 100).toFixed(1)}%</p>
            </div>
            <div className="text-center">
              <span className="text-gray-400">Battles</span>
              <p className="font-bold text-gray-300">{entry.totalBattles}</p>
            </div>
          </div>
        )
      case 'collection':
        return (
          <div className="flex gap-6 text-sm">
            <div className="text-center">
              <span className="text-gray-400">Value</span>
              <p className="font-bold text-yellow-400">{entry.totalCollectionValue.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <span className="text-gray-400">Rare</span>
              <p className="font-bold text-blue-400">{entry.rareCards}</p>
            </div>
          </div>
        )
      case 'rarity':
        return (
          <div className="flex gap-6 text-sm">
            <div className="text-center">
              <span className="text-gray-400">Legendary</span>
              <p className="font-bold text-purple-400">{entry.legendaryCards}</p>
            </div>
            <div className="text-center">
              <span className="text-gray-400">Epic</span>
              <p className="font-bold text-pink-400">{entry.rareCards}</p>
            </div>
          </div>
        )
      case 'trading':
        return (
          <div className="flex gap-6 text-sm">
            <div className="text-center">
              <span className="text-gray-400">Success</span>
              <p className="font-bold text-green-400">{entry.successfulTrades}</p>
            </div>
            <div className="text-center">
              <span className="text-gray-400">Total</span>
              <p className="font-bold text-gray-300">{entry.totalTrades}</p>
            </div>
          </div>
        )
    }
  }

  const rankBadge = getRankBadge(entry.rank)

  return (
    <div
      className={`
        flex items-center gap-4 p-4 rounded-lg transition-all
        ${isCurrentUser ? 'bg-purple-900/50 border-2 border-purple-500' : 'bg-gray-800/50 hover:bg-gray-700/50'}
      `}
    >
      {/* Rank Badge */}
      <div className={`
        w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
        ${rankBadge.bg} ${rankBadge.text}
      `}>
        {rankBadge.icon || entry.rank}
      </div>

      {/* Player Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="text-2xl">{entry.avatar}</div>
        <div className="min-w-0">
          <p className="font-semibold text-white truncate">
            {entry.username}
            {isCurrentUser && <span className="ml-2 text-xs text-purple-400">(You)</span>}
          </p>
          <p className="text-xs text-gray-500 truncate">{entry.address}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="hidden md:flex items-center gap-4">
        {getStatsForType()}
      </div>

      {/* Trend Indicator */}
      <div className="w-12 text-center">
        {entry.rankChange > 0 && (
          <span className="text-green-400 text-xl">↑</span>
        )}
        {entry.rankChange < 0 && (
          <span className="text-red-400 text-xl">↓</span>
        )}
        {entry.rankChange === 0 && (
          <span className="text-gray-500 text-xl">—</span>
        )}
      </div>
    </div>
  )
}
