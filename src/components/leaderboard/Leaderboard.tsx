'use client'

import { useState, useEffect } from 'react'
import { LeaderboardType, LeaderboardEntry } from '@/types/leaderboard'
import { getLeaderboard, getRankingCriteria } from '@/lib/leaderboard'
import { LeaderboardRow } from './LeaderboardRow'

interface LeaderboardProps {
  currentUserAddress?: string
}

const LEADERBOARD_TABS: { type: LeaderboardType; label: string; icon: string }[] = [
  { type: 'battles', label: 'Battles', icon: '⚔️' },
  { type: 'collection', label: 'Collection', icon: '🃏' },
  { type: 'rarity', label: 'Rarity', icon: '💎' },
  { type: 'trading', label: 'Trading', icon: '💱' },
]

export function Leaderboard({ currentUserAddress }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<LeaderboardType>('battles')
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    // Simulate network delay for realistic UX
    const timer = setTimeout(() => {
      const data = getLeaderboard(activeTab, 100, 0)
      setLeaderboard(data)
      
      if (currentUserAddress) {
        const rank = data.find(
          entry => entry.address.toLowerCase() === currentUserAddress.toLowerCase()
        )
        setUserRank(rank || null)
      }
      
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [activeTab, currentUserAddress])

  const criteria = getRankingCriteria(activeTab)

  const topThree = leaderboard.slice(0, 3)
  const restOfList = leaderboard.slice(3)

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">🏆 Leaderboard</h1>
        <p className="text-gray-400">{criteria.description}</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        {LEADERBOARD_TABS.map((tab) => (
          <button
            key={tab.type}
            onClick={() => setActiveTab(tab.type)}
            className={`
              px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2
              ${activeTab === tab.type
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }
            `}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Top 3 Highlight */}
      {!isLoading && topThree.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-center items-end gap-4">
            {/* 2nd Place */}
            {topThree[1] && (
              <div className="order-1 transform translate-y-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-4xl mb-2 ring-4 ring-gray-400/50">
                  {topThree[1].avatar}
                </div>
                <p className="text-center text-gray-400 font-semibold">{topThree[1].username}</p>
                <p className="text-center text-gray-500 text-sm">🥈 #{topThree[1].rank}</p>
              </div>
            )}
            
            {/* 1st Place */}
            {topThree[0] && (
              <div className="order-2">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-5xl mb-2 ring-4 ring-yellow-400/50 animate-pulse">
                  {topThree[0].avatar}
                </div>
                <p className="text-center text-yellow-400 font-bold">{topThree[0].username}</p>
                <p className="text-center text-yellow-500 text-sm">🥇 #{topThree[0].rank}</p>
              </div>
            )}
            
            {/* 3rd Place */}
            {topThree[2] && (
              <div className="order-3 transform translate-y-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-4xl mb-2 ring-4 ring-amber-600/50">
                  {topThree[2].avatar}
                </div>
                <p className="text-center text-amber-400 font-semibold">{topThree[2].username}</p>
                <p className="text-center text-amber-600 text-sm">🥉 #{topThree[2].rank}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      )}

      {/* Rest of the list */}
      {!isLoading && restOfList.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-400 mb-4">Rankings</h3>
          {restOfList.map((entry) => (
            <LeaderboardRow
              key={entry.address}
              entry={entry}
              type={activeTab}
              isCurrentUser={
                currentUserAddress?.toLowerCase() === entry.address.toLowerCase()
              }
            />
          ))}
        </div>
      )}

      {/* User's rank if not in top */}
      {!isLoading && userRank && userRank.rank > 3 && (
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-center text-gray-500 mb-4">Your Position</p>
          <LeaderboardRow
            entry={userRank}
            type={activeTab}
            isCurrentUser={true}
          />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && leaderboard.length === 0 && (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">📊</p>
          <p className="text-xl text-gray-400">No data available yet</p>
          <p className="text-gray-500">Be the first to make your mark!</p>
        </div>
      )}
    </div>
  )
}
