'use client'

import type { Card as CardType, CardRarity } from '@/types'

interface CollectionHeaderProps {
  totalCards: number
  cards: CardType[]
}

export function CollectionHeader({ totalCards, cards }: CollectionHeaderProps) {
  const rarityCounts = getRarityDistribution(cards)
  const estimatedValue = calculateEstimatedValue(cards)

  return (
    <div className="bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-purple-900/50 
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
              <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                <span className="text-xl">🎴</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalCards}</p>
                <p className="text-xs text-gray-400">Total Cards</p>
              </div>
            </div>

            {/* Estimated Value */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <span className="text-xl">💎</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{estimatedValue.toFixed(2)} ETH</p>
                <p className="text-xs text-gray-400">Est. Value</p>
              </div>
            </div>

            {/* Unique Cards */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
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
              rarity="Legendary" 
              count={rarityCounts.Legendary} 
              total={totalCards}
              color="from-yellow-500 to-orange-500"
              glow="bg-yellow-500/50"
            />
            <RarityBar 
              rarity="Epic" 
              count={rarityCounts.Epic} 
              total={totalCards}
              color="from-purple-500 to-purple-700"
              glow="bg-purple-500/50"
            />
            <RarityBar 
              rarity="Rare" 
              count={rarityCounts.Rare} 
              total={totalCards}
              color="from-blue-500 to-blue-700"
              glow="bg-blue-500/50"
            />
            <RarityBar 
              rarity="Common" 
              count={rarityCounts.Common} 
              total={totalCards}
              color="from-gray-500 to-gray-600"
              glow="bg-gray-500/50"
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

function getRarityDistribution(cards: CardType[]) {
  return cards.reduce((acc, card) => {
    acc[card.rarity] = (acc[card.rarity] || 0) + 1
    return acc
  }, {} as Record<string, number>)
}

function calculateEstimatedValue(cards: CardType[]): number {
  const rarityValues: Record<string, number> = {
    Legendary: 2.5,
    Epic: 1.0,
    Rare: 0.3,
    Common: 0.05,
  }
  
  return cards.reduce((total, card) => {
    return total + (rarityValues[card.rarity] || 0.05)
  }, 0)
}

function getRarityBadgeClass(rarity: CardRarity): string {
  switch (rarity) {
    case 'Legendary':
      return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black'
    case 'Epic':
      return 'bg-purple-500/80 text-white'
    case 'Rare':
      return 'bg-blue-500/80 text-white'
    default:
      return 'bg-gray-500/80 text-white'
  }
}
