'use client'

import type { Card, CardRarity } from '@/types/card'

interface CollectionHeaderProps {
  totalCards: number
  cards: Card[]
}

export function CollectionHeader({ totalCards, cards }: CollectionHeaderProps) {
  const rarityCounts = getRarityDistribution(cards)
  const estimatedValue = calculateEstimatedValue(cards)

  return (
    <div className="bg-gradient-to-r from-[#1f1833]/60 via-[#1a2540]/60 to-[#1f1833]/60
                    rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Section - Title & Stats */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Your Collection</h1>
            <p className="text-gray-400 text-sm">Manage and showcase your trading cards</p>
          </div>

          <div className="flex flex-wrap gap-6">
            {/* Total Cards */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-[#C9A227]/20 flex items-center justify-center">
                <span className="text-xl">🎴</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalCards}</p>
                <p className="text-xs text-gray-400">Total Cards</p>
              </div>
            </div>

            {/* Estimated Value */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <span className="text-xl">💎</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{estimatedValue.toFixed(2)} ETH</p>
                <p className="text-xs text-gray-400">Est. Value</p>
              </div>
            </div>

            {/* Unique Cards */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-[#7C6BAF]/20 flex items-center justify-center">
                <span className="text-xl">✨</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {new Set(cards.map(c => c.name)).size}
                </p>
                <p className="text-xs text-gray-400">Unique Cards</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Rarity Distribution */}
        <div className="lg:w-80">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Rarity Distribution</h3>
          <div className="space-y-2">
            <RarityBar
              rarity="legendary"
              count={rarityCounts.legendary}
              total={totalCards}
              color="from-amber-400 to-orange-400"
              glow="bg-amber-400/40"
            />
            <RarityBar
              rarity="epic"
              count={rarityCounts.epic}
              total={totalCards}
              color="from-violet-500 to-violet-600"
              glow="bg-violet-500/40"
            />
            <RarityBar
              rarity="rare"
              count={rarityCounts.rare}
              total={totalCards}
              color="from-blue-500 to-indigo-600"
              glow="bg-blue-500/40"
            />
            <RarityBar
              rarity="common"
              count={rarityCounts.common}
              total={totalCards}
              color="from-slate-500 to-slate-600"
              glow="bg-slate-500/40"
            />
          </div>

          {/* Rarity Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {Object.entries(rarityCounts).map(([rarity, count]) => (
              count > 0 && (
                <span
                  key={rarity}
                  className={`text-xs px-2 py-1 rounded-full font-medium
                    ${getRarityBadgeClass(rarity as CardRarity)}`}
                >
                  {rarity}: {count}
                </span>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function RarityBar({ 
  rarity, 
  count, 
  total, 
  color, 
  glow 
}: { 
  rarity: string
  count: number
  total: number
  color: string
  glow: string
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-400 w-20 text-right">{rarity}</span>
      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500 
                     relative group hover:shadow-lg ${glow}`}
          style={{ width: `${percentage}%` }}
        >
          {/* Animated shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                          translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
        </div>
      </div>
      <span className="text-xs text-gray-400 w-8">{count}</span>
    </div>
  )
}

function getRarityDistribution(cards: Card[]) {
  const counts: Record<CardRarity, number> = {
    legendary: 0,
    epic: 0,
    rare: 0,
    common: 0,
  }
  
  return cards.reduce((acc, card) => {
    acc[card.rarity] = (acc[card.rarity] || 0) + 1
    return acc
  }, counts)
}

function calculateEstimatedValue(cards: Card[]): number {
  const rarityValues: Record<CardRarity, number> = {
    legendary: 2.5,
    epic: 1.0,
    rare: 0.3,
    common: 0.05,
  }
  
  return cards.reduce((total, card) => {
    return total + (rarityValues[card.rarity] || 0.05)
  }, 0)
}

function getRarityBadgeClass(rarity: CardRarity): string {
  switch (rarity) {
    case 'legendary':
      return 'bg-gradient-to-r from-amber-400 to-orange-400 text-black'
    case 'epic':
      return 'bg-violet-500/80 text-white'
    case 'rare':
      return 'bg-blue-500/80 text-white'
    default:
      return 'bg-slate-500/80 text-white'
  }
}
