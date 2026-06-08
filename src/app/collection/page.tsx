'use client'

import { useState, useMemo } from 'react'
import type { Card as CardType } from '@/types'
import { CardRarity, CardType as CardTypeEnum } from '@/types'
import { Card } from '@/components/Card'
import { CardDetail } from '@/components/CardDetail'
import { CardComparison } from '@/components/CardComparison'
import { CollectionHeader } from '@/components/CollectionHeader'
import { CardGridSkeleton } from '@/components/CardSkeleton'

// Mock data for demonstration
const mockCards: CardType[] = [
  {
    id: '1',
    name: 'Dragon Knight',
    type: CardTypeEnum.Attack,
    rarity: CardRarity.Legendary,
    attack: 95,
    defense: 70,
    ability: 'Ignites the battlefield, dealing 50% bonus fire damage to all enemies.',
    owner: '0x1234...abcd',
    tokenId: BigInt(1),
  },
  {
    id: '2',
    name: 'Frost Mage',
    type: CardTypeEnum.Special,
    rarity: CardRarity.Epic,
    attack: 80,
    defense: 45,
    ability: 'Freezes enemies for 2 turns, reducing their attack by 40%.',
    owner: '0x1234...abcd',
    tokenId: BigInt(2),
  },
  {
    id: '3',
    name: 'Shield Bearer',
    type: CardTypeEnum.Defense,
    rarity: CardRarity.Rare,
    attack: 30,
    defense: 90,
    ability: 'Creates a protective barrier that absorbs the next 3 attacks.',
    owner: '0x1234...abcd',
    tokenId: BigInt(3),
  },
  {
    id: '4',
    name: 'Shadow Assassin',
    type: CardTypeEnum.Attack,
    rarity: CardRarity.Epic,
    attack: 88,
    defense: 35,
    ability: 'Attacks from the shadows, ignoring 60% of enemy defense.',
    owner: '0x5678...efgh',
    tokenId: BigInt(4),
  },
  {
    id: '5',
    name: 'Forest Guardian',
    type: CardTypeEnum.Support,
    rarity: CardRarity.Rare,
    attack: 50,
    defense: 65,
    ability: 'Heals all allies for 25% of their max health at turn start.',
    owner: '0x1234...abcd',
    tokenId: BigInt(5),
  },
  {
    id: '6',
    name: 'Goblin Scout',
    type: CardTypeEnum.Attack,
    rarity: CardRarity.Common,
    attack: 25,
    defense: 15,
    owner: '0x1234...abcd',
    tokenId: BigInt(6),
  },
  {
    id: '7',
    name: 'Phoenix Riser',
    type: CardTypeEnum.Special,
    rarity: CardRarity.Legendary,
    attack: 85,
    defense: 80,
    ability: 'Revives once per battle with 50% health. Deals burn damage over 3 turns.',
    owner: '0x1234...abcd',
    tokenId: BigInt(7),
  },
  {
    id: '8',
    name: 'Stone Golem',
    type: CardTypeEnum.Defense,
    rarity: CardRarity.Common,
    attack: 20,
    defense: 75,
    owner: '0x5678...efgh',
    tokenId: BigInt(8),
  },
]

type FilterRarity = CardRarity | 'All'
type SortOption = 'newest' | 'oldest' | 'attack' | 'defense' | 'rarity'

export default function Collection() {
  const [isLoading] = useState(false)
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isCompareOpen, setIsCompareOpen] = useState(false)
  const [filterRarity, setFilterRarity] = useState<FilterRarity>('All')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [minAttack, setMinAttack] = useState(0)
  const [minDefense, setMinDefense] = useState(0)

  const filteredAndSortedCards = useMemo(() => {
    let result = [...mockCards]

    // Apply rarity filter
    if (filterRarity !== 'All') {
      result = result.filter(card => card.rarity === filterRarity)
    }

    // Apply attack filter
    if (minAttack > 0) {
      result = result.filter(card => card.attack >= minAttack)
    }

    // Apply defense filter
    if (minDefense > 0) {
      result = result.filter(card => card.defense >= minDefense)
    }

    // Apply sorting
    const rarityOrder: Record<CardRarity, number> = {
      [CardRarity.Legendary]: 4,
      [CardRarity.Epic]: 3,
      [CardRarity.Rare]: 2,
      [CardRarity.Common]: 1,
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'attack':
          return b.attack - a.attack
        case 'defense':
          return b.defense - a.defense
        case 'rarity':
          return (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0)
        case 'oldest':
          return Number(a.tokenId) - Number(b.tokenId)
        case 'newest':
        default:
          return Number(b.tokenId) - Number(a.tokenId)
      }
    })

    return result
  }, [filterRarity, sortBy, minAttack, minDefense])

  const handleCardClick = (card: CardType) => {
    setSelectedCard(card)
    setIsDetailOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Collection Header */}
        <CollectionHeader totalCards={mockCards.length} cards={mockCards} />

        {/* Controls Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between
                        bg-black/30 rounded-xl p-4 border border-white/5">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Rarity Filter */}
            <select
              value={filterRarity}
              onChange={(e) => setFilterRarity(e.target.value as FilterRarity)}
              className="bg-gray-800/80 text-white text-sm px-3 py-2 rounded-lg border border-white/10
                         focus:outline-none focus:border-gold transition-colors cursor-pointer"
            >
              <option value="All">All Rarities</option>
              <option value={CardRarity.Common}>Common</option>
              <option value={CardRarity.Rare}>Rare</option>
              <option value={CardRarity.Epic}>Epic</option>
              <option value={CardRarity.Legendary}>Legendary</option>
            </select>

            {/* Attack Filter */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">ATK ≥</span>
              <input
                type="number"
                min="0"
                max="100"
                value={minAttack}
                onChange={(e) => setMinAttack(Number(e.target.value))}
                className="w-16 bg-gray-800/80 text-white text-sm px-2 py-2 rounded-lg 
                           border border-white/10 focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            {/* Defense Filter */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">DEF ≥</span>
              <input
                type="number"
                min="0"
                max="100"
                value={minDefense}
                onChange={(e) => setMinDefense(Number(e.target.value))}
                className="w-16 bg-gray-800/80 text-white text-sm px-2 py-2 rounded-lg 
                           border border-white/10 focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            {/* Clear Filters */}
            {(filterRarity !== 'All' || minAttack > 0 || minDefense > 0) && (
              <button
                onClick={() => {
                  setFilterRarity('All')
                  setMinAttack(0)
                  setMinDefense(0)
                }}
                className="text-gold text-sm hover:text-gold-light transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Sort & Actions */}
          <div className="flex gap-3 items-center">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-gray-800/80 text-white text-sm px-3 py-2 rounded-lg border border-white/10
                         focus:outline-none focus:border-gold transition-colors cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="attack">Highest Attack</option>
              <option value="defense">Highest Defense</option>
              <option value="rarity">Best Rarity</option>
            </select>

            {/* Compare Button */}
            <button
              onClick={() => setIsCompareOpen(true)}
              className="bg-purple-600/80 hover:bg-purple-500 text-white text-sm font-medium
                         px-4 py-2 rounded-lg border border-purple-400/30 transition-all
                         flex items-center gap-2"
            >
              <span>⚖️</span> Compare
            </button>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-gray-400 text-sm">
          Showing {filteredAndSortedCards.length} of {mockCards.length} cards
        </p>

        {/* Card Grid */}
        {isLoading ? (
          <CardGridSkeleton count={8} />
        ) : filteredAndSortedCards.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 
                          gap-6 justify-items-center">
            {filteredAndSortedCards.map((card) => (
              <Card
                key={card.id}
                card={card}
                onClick={() => handleCardClick(card)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-8xl mb-6 opacity-30">🎴</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Cards Found</h3>
            <p className="text-gray-400 mb-6">
              {filterRarity !== 'All' || minAttack > 0 || minDefense > 0
                ? 'Try adjusting your filters to see more cards.'
                : 'Your collection is empty. Start playing to earn cards!'}
            </p>
            {(filterRarity !== 'All' || minAttack > 0 || minDefense > 0) && (
              <button
                onClick={() => {
                  setFilterRarity('All')
                  setMinAttack(0)
                  setMinDefense(0)
                }}
                className="bg-gold hover:bg-gold-light text-black font-bold
                           px-6 py-3 rounded-xl transition-all"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Card Detail Modal */}
        <CardDetail
          card={selectedCard!}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onBattle={() => {
            setIsDetailOpen(false)
            window.location.href = '/battle'
          }}
          onSell={() => {
            setIsDetailOpen(false)
            window.location.href = '/market'
          }}
        />

        {/* Card Comparison Modal */}
        <CardComparison
          cards={mockCards}
          isOpen={isCompareOpen}
          onClose={() => setIsCompareOpen(false)}
        />
      </div>
    </div>
  )
}
