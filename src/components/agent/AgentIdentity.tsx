'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { AIProfile } from '@/lib/ai-profiles'

export interface AgentCapability {
  id: string
  name: string
  proficiency: number
  description: string
}

export interface AgentAchievement {
  id: string
  name: string
  description: string
  badgeURI: string
  earnedAt: Date
}

export interface AgentIdentityData {
  id: string
  name: string
  avatar: string
  personality: string
  reputation: number
  totalBattles: number
  wins: number
  losses: number
  draws: number
  winRate: number
  currentStreak: number
  highestStreak: number
  capabilities: AgentCapability[]
  achievements: AgentAchievement[]
  registeredAt: Date
  lastActive: Date
}

interface AgentIdentityProps {
  agent: AgentIdentityData
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showDetails?: boolean
  isPlayer?: boolean
  compact?: boolean
}

const rarityGlow = {
  common: 'shadow-gray-500/30',
  rare: 'shadow-blue-500/40',
  epic: 'shadow-purple-500/50',
  legendary: 'shadow-yellow-500/60',
}

const reputationTiers = [
  { min: 0, max: 1000, name: 'Bronze', color: 'text-amber-700', bg: 'bg-amber-900/30' },
  { min: 1001, max: 2500, name: 'Silver', color: 'text-gray-300', bg: 'bg-gray-600/30' },
  { min: 2501, max: 5000, name: 'Gold', color: 'text-yellow-400', bg: 'bg-yellow-600/30' },
  { min: 5001, max: 7500, name: 'Platinum', color: 'text-cyan-300', bg: 'bg-cyan-600/30' },
  { min: 7501, max: 9000, name: 'Diamond', color: 'text-blue-400', bg: 'bg-blue-600/30' },
  { min: 9001, max: 10000, name: 'Legendary', color: 'text-purple-400', bg: 'bg-purple-600/30' },
]

function getReputationTier(reputation: number) {
  return reputationTiers.find(t => reputation >= t.min && reputation <= t.max) || reputationTiers[0]
}

function getWinRateColor(winRate: number): string {
  if (winRate >= 70) return 'text-green-400'
  if (winRate >= 50) return 'text-yellow-400'
  if (winRate >= 30) return 'text-orange-400'
  return 'text-red-400'
}

function getStreakEmoji(streak: number): string {
  if (streak >= 10) return '🔥'
  if (streak >= 5) return '⚡'
  if (streak >= 3) return '✨'
  return ''
}

const sizeClasses = {
  sm: { container: 'p-3', avatar: 'w-12 h-12', name: 'text-sm', stats: 'text-xs' },
  md: { container: 'p-4', avatar: 'w-16 h-16', name: 'base', stats: 'text-sm' },
  lg: { container: 'p-6', avatar: 'w-24 h-24', name: 'lg', stats: 'base' },
  xl: { container: 'p-8', avatar: 'w-32 h-32', name: '2xl', stats: 'lg' },
}

export function AgentIdentityCard({
  agent,
  size = 'md',
  showDetails = false,
  isPlayer = false,
  compact = false,
}: AgentIdentityProps) {
  const [isHovered, setIsHovered] = useState(false)
  const tier = getReputationTier(agent.reputation)
  const sizeClass = sizeClasses[size]

  if (compact) {
    return (
      <div className="flex items-center gap-3 bg-gray-800/50 rounded-lg px-3 py-2">
        <div className="relative">
          <img
            src={agent.avatar}
            alt={agent.name}
            className={cn(sizeClass.avatar, 'rounded-full bg-gray-700')}
          />
          {agent.currentStreak >= 3 && (
            <div className="absolute -top-1 -right-1 text-xs">
              {getStreakEmoji(agent.currentStreak)}
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className={cn('font-bold text-white', sizeClass.name)}>{agent.name}</span>
            <span className={cn('text-xs px-1.5 py-0.5 rounded', tier.bg, tier.color)}>
              {tier.name}
            </span>
          </div>
          <div className={cn('text-gray-400', sizeClass.stats)}>
            {agent.wins}W/{agent.losses}L • {agent.reputation} RP
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative bg-gray-800/80 rounded-xl border border-gray-700 backdrop-blur-sm',
        'transition-all duration-300 hover:scale-[1.02]',
        sizeClass.container,
        isHovered && `shadow-xl ${rarityGlow.legendary}`
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isPlayer && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
          You
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          <img
            src={agent.avatar}
            alt={agent.name}
            className={cn(sizeClass.avatar, 'rounded-full bg-gray-700 border-2 border-gray-600')}
          />
          {agent.currentStreak >= 3 && (
            <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
              {getStreakEmoji(agent.currentStreak)}
            </div>
          )}
          <div className={cn('absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-gray-800 flex items-center justify-center text-xs', tier.bg)}>
            <span className={tier.color}>{agent.reputation}</span>
          </div>
        </div>

        {/* Name & Personality */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn('font-bold text-white truncate', sizeClass.name)}>
              {agent.name}
            </h3>
          </div>
          <p className="text-sm text-gray-400 truncate">{agent.personality}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={cn('text-xs px-2 py-0.5 rounded-full', tier.bg, tier.color)}>
              {tier.name}
            </span>
            {agent.currentStreak > 0 && (
              <span className="text-xs text-orange-400">
                🔥 {agent.currentStreak} win streak
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center p-2 bg-gray-900/50 rounded-lg">
          <div className={cn('font-bold text-green-400', sizeClass.stats)}>
            {agent.wins}
          </div>
          <div className="text-xs text-gray-500">Wins</div>
        </div>
        <div className="text-center p-2 bg-gray-900/50 rounded-lg">
          <div className={cn('font-bold text-red-400', sizeClass.stats)}>
            {agent.losses}
          </div>
          <div className="text-xs text-gray-500">Losses</div>
        </div>
        <div className="text-center p-2 bg-gray-900/50 rounded-lg">
          <div className={cn('font-bold', getWinRateColor(agent.winRate), sizeClass.stats)}>
            {agent.winRate}%
          </div>
          <div className="text-xs text-gray-500">Win Rate</div>
        </div>
      </div>

      {/* Reputation Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-400">Reputation</span>
          <span className={tier.color}>{agent.reputation} / 10000</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-500', tier.bg.replace('/30', ''))}
            style={{ width: `${agent.reputation / 100}%` }}
          />
        </div>
      </div>

      {/* Capabilities */}
      {showDetails && agent.capabilities.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-400 mb-2">Capabilities</h4>
          <div className="flex flex-wrap gap-1">
            {agent.capabilities.slice(0, 4).map((cap) => (
              <span
                key={cap.id}
                className="text-xs px-2 py-1 bg-purple-900/30 text-purple-300 rounded-full"
                title={cap.description}
              >
                {cap.name}
                <span className="ml-1 text-purple-500">({cap.proficiency}%)</span>
              </span>
            ))}
            {agent.capabilities.length > 4 && (
              <span className="text-xs px-2 py-1 text-gray-500">
                +{agent.capabilities.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Achievements */}
      {showDetails && agent.achievements.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-gray-400 mb-2">Achievements</h4>
          <div className="flex gap-2 overflow-x-auto">
            {agent.achievements.slice(0, 5).map((ach) => (
              <div
                key={ach.id}
                className="shrink-0 w-10 h-10 rounded-full bg-yellow-900/30 border border-yellow-600/50 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                title={`${ach.name}: ${ach.description}`}
              >
                🏆
              </div>
            ))}
            {agent.achievements.length > 5 && (
              <div className="shrink-0 w-10 h-10 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center text-xs text-gray-400">
                +{agent.achievements.length - 5}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

interface AgentBattleCardProps {
  agent: AgentIdentityData
  onClick?: () => void
}

export function AgentBattleCard({ agent, onClick }: AgentBattleCardProps) {
  const tier = getReputationTier(agent.reputation)

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-4 bg-gray-800/80 rounded-xl border border-gray-700',
        'hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20',
        'transition-all duration-300 text-left'
      )}
    >
      <div className="flex items-center gap-3">
        <img
          src={agent.avatar}
          alt={agent.name}
          className="w-14 h-14 rounded-full bg-gray-700 border-2 border-gray-600"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white truncate">{agent.name}</h3>
            <span className={cn('text-xs px-2 py-0.5 rounded', tier.bg, tier.color)}>
              {tier.name}
            </span>
          </div>
          <p className="text-sm text-gray-400 truncate">{agent.personality}</p>
          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
            <span>{agent.totalBattles} battles</span>
            <span className={getWinRateColor(agent.winRate)}>{agent.winRate}% WR</span>
            <span>{agent.reputation} RP</span>
          </div>
        </div>
      </div>
    </button>
  )
}

interface AgentIdentityMiniProps {
  agent: Partial<AgentIdentityData>
  showStreak?: boolean
}

export function AgentIdentityMini({ agent, showStreak = true }: AgentIdentityMiniProps) {
  const tier = agent.reputation ? getReputationTier(agent.reputation) : null

  return (
    <div className="flex items-center gap-2">
      <img
        src={agent.avatar}
        alt={agent.name}
        className="w-8 h-8 rounded-full bg-gray-700"
      />
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium text-white">{agent.name}</span>
        {tier && (
          <span className={cn('text-xs px-1.5 py-0.5 rounded', tier.bg, tier.color)}>
            {tier.name}
          </span>
        )}
        {showStreak && agent.currentStreak && agent.currentStreak >= 3 && (
          <span className="text-sm">{getStreakEmoji(agent.currentStreak)}</span>
        )}
      </div>
    </div>
  )
}
