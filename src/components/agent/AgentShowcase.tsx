'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { AgentIdentityCard, AgentBattleCard } from './AgentIdentity'
import type { AgentIdentityData } from './AgentIdentity'

interface AgentShowcaseProps {
  agents: AgentIdentityData[]
  currentAgentId?: string
  onSelectAgent?: (agent: AgentIdentityData) => void
  onViewProfile?: (agent: AgentIdentityData) => void
}

const sortOptions = [
  { id: 'reputation', name: 'Reputation', icon: '🏆' },
  { id: 'winrate', name: 'Win Rate', icon: '📊' },
  { id: 'wins', name: 'Total Wins', icon: '⚔️' },
  { id: 'streak', name: 'Win Streak', icon: '🔥' },
] as const

type SortOption = typeof sortOptions[number]['id']

function sortAgents(agents: AgentIdentityData[], sortBy: SortOption): AgentIdentityData[] {
  return [...agents].sort((a, b) => {
    switch (sortBy) {
      case 'reputation':
        return b.reputation - a.reputation
      case 'winrate':
        return b.winRate - a.winRate
      case 'wins':
        return b.wins - a.wins
      case 'streak':
        return b.highestStreak - a.highestStreak
      default:
        return 0
    }
  })
}

export function AgentShowcase({
  agents,
  currentAgentId,
  onSelectAgent,
  onViewProfile,
}: AgentShowcaseProps) {
  const [sortBy, setSortBy] = useState<SortOption>('reputation')
  const [filterTier, setFilterTier] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredAgents = filterTier
    ? agents.filter(a => {
        if (filterTier === 'bronze') return a.reputation <= 1000
        if (filterTier === 'silver') return a.reputation > 1000 && a.reputation <= 2500
        if (filterTier === 'gold') return a.reputation > 2500 && a.reputation <= 5000
        if (filterTier === 'platinum') return a.reputation > 5000 && a.reputation <= 7500
        if (filterTier === 'diamond') return a.reputation > 7500 && a.reputation <= 9000
        if (filterTier === 'legendary') return a.reputation > 9000
        return true
      })
    : agents

  const sortedAgents = sortAgents(filteredAgents, sortBy)

  const tierCounts = {
    bronze: agents.filter(a => a.reputation <= 1000).length,
    silver: agents.filter(a => a.reputation > 1000 && a.reputation <= 2500).length,
    gold: agents.filter(a => a.reputation > 2500 && a.reputation <= 5000).length,
    platinum: agents.filter(a => a.reputation > 5000 && a.reputation <= 7500).length,
    diamond: agents.filter(a => a.reputation > 7500 && a.reputation <= 9000).length,
    legendary: agents.filter(a => a.reputation > 9000).length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Agent Showcase</h2>
          <p className="text-gray-400 text-sm">{agents.length} registered agents</p>
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'px-3 py-1 rounded-md text-sm transition-all',
              viewMode === 'grid'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            )}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'px-3 py-1 rounded-md text-sm transition-all',
              viewMode === 'list'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            )}
          >
            List
          </button>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Sort by:</span>
          <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSortBy(option.id)}
                className={cn(
                  'px-3 py-1 rounded-md text-sm transition-all flex items-center gap-1',
                  sortBy === option.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                )}
              >
                <span>{option.icon}</span>
                <span className="hidden sm:inline">{option.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tier Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Tier:</span>
          <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1 overflow-x-auto">
            <button
              onClick={() => setFilterTier(null)}
              className={cn(
                'px-2 py-1 rounded-md text-xs transition-all whitespace-nowrap',
                filterTier === null
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              All ({agents.length})
            </button>
            {Object.entries(tierCounts).map(([tier, count]) => (
              <button
                key={tier}
                onClick={() => setFilterTier(tier)}
                className={cn(
                  'px-2 py-1 rounded-md text-xs transition-all capitalize whitespace-nowrap',
                  filterTier === tier
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                )}
              >
                {tier} ({count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Grid/List */}
      {sortedAgents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No agents found</p>
          <p className="text-gray-500 text-sm">Try adjusting your filters</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedAgents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => onSelectAgent?.(agent)}
              className="cursor-pointer"
            >
              <AgentIdentityCard
                agent={agent}
                size="lg"
                showDetails
                isPlayer={agent.id === currentAgentId}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {sortedAgents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => onSelectAgent?.(agent)}
              className="cursor-pointer"
            >
              <AgentBattleCard agent={agent} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface AgentProfileDetailProps {
  agent: AgentIdentityData
  onClose?: () => void
}

export function AgentProfileDetail({ agent, onClose }: AgentProfileDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'battle-history'>('overview')

  return (
    <div className="bg-gray-800/80 rounded-xl border border-gray-700 overflow-hidden">
      {/* Profile Header */}
      <div className="relative p-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-800/50 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all"
          >
            ✕
          </button>
        )}
        
        <div className="flex items-center gap-4">
          <img
            src={agent.avatar}
            alt={agent.name}
            className="w-20 h-20 rounded-full bg-gray-700 border-2 border-purple-500"
          />
          <div>
            <h2 className="text-2xl font-bold text-white">{agent.name}</h2>
            <p className="text-gray-400">{agent.personality}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500">Registered {agent.registeredAt.toLocaleDateString()}</span>
              {agent.currentStreak >= 3 && (
                <span className="text-sm text-orange-400">🔥 {agent.currentStreak} streak</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        {(['overview', 'achievements', 'battle-history'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 py-3 text-sm font-medium transition-all capitalize',
              activeTab === tab
                ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-900/20'
                : 'text-gray-400 hover:text-white'
            )}
          >
            {tab === 'battle-history' ? 'Battle History' : tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                <div className="text-2xl font-bold text-white">{agent.totalBattles}</div>
                <div className="text-xs text-gray-400">Total Battles</div>
              </div>
              <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                <div className="text-2xl font-bold text-green-400">{agent.wins}</div>
                <div className="text-xs text-gray-400">Wins</div>
              </div>
              <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                <div className="text-2xl font-bold text-red-400">{agent.losses}</div>
                <div className="text-xs text-gray-400">Losses</div>
              </div>
              <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400">{agent.winRate}%</div>
                <div className="text-xs text-gray-400">Win Rate</div>
              </div>
            </div>

            {/* Streak Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-orange-900/20 border border-orange-600/30 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">🔥</span>
                  <span className="text-sm text-orange-400">Current Streak</span>
                </div>
                <div className="text-3xl font-bold text-white">{agent.currentStreak}</div>
              </div>
              <div className="p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">🏆</span>
                  <span className="text-sm text-yellow-400">Best Streak</span>
                </div>
                <div className="text-3xl font-bold text-white">{agent.highestStreak}</div>
              </div>
            </div>

            {/* Capabilities */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-3">Capabilities</h3>
              <div className="flex flex-wrap gap-2">
                {agent.capabilities.map((cap) => (
                  <span
                    key={cap.id}
                    className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full text-sm"
                  >
                    {cap.name}
                    <span className="ml-1 text-purple-500">({cap.proficiency}%)</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Reputation */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-3">Reputation</h3>
              <div className="p-4 bg-gray-900/50 rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Score</span>
                  <span className="text-white font-medium">{agent.reputation} / 10000</span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                    style={{ width: `${agent.reputation / 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {agent.achievements.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-400">No achievements yet</p>
              </div>
            ) : (
              agent.achievements.map((ach) => (
                <div
                  key={ach.id}
                  className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-yellow-900/30 border border-yellow-600/50 flex items-center justify-center text-2xl">
                    🏆
                  </div>
                  <h4 className="font-bold text-white text-sm">{ach.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">{ach.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {ach.earnedAt.toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'battle-history' && (
          <div className="text-center py-8">
            <p className="text-gray-400">Battle history coming soon</p>
            <p className="text-sm text-gray-500">Detailed battle records will be displayed here</p>
          </div>
        )}
      </div>
    </div>
  )
}
