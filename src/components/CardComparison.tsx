'use client'

import type { Card as CardType } from '@/types'
import { Card } from './Card'
import { useState } from 'react'
import { getRarityScore, sortByRarity } from '@/lib/card-utils'

interface CardComparisonProps {
  cards: CardType[]
  isOpen: boolean
  onClose: () => void
}

type SortOption = 'attack' | 'defense' | 'rarity'

export function CardComparison({ cards, isOpen, onClose }: CardComparisonProps) {
  const [selectedCards, setSelectedCards] = useState<[CardType | null, CardType | null]>([null, null])
  const [sortBy, setSortBy] = useState<SortOption>('attack')

  if (!isOpen) return null

  const handleSelectCard = (card: CardType, slot: 0 | 1) => {
    const newSelected = [...selectedCards] as [CardType | null, CardType | null]
    newSelected[slot] = card
    setSelectedCards(newSelected)
  }

  const clearSelection = (slot: 0 | 1) => {
    const newSelected = [...selectedCards] as [CardType | null, CardType | null]
    newSelected[slot] = null
    setSelectedCards(newSelected)
  }

  const getSortedCards = () => {
    return sortByRarity(cards, false).sort((a, b) => {
      if (sortBy === 'attack') return b.attack - a.attack
      if (sortBy === 'defense') return b.defense - a.defense
      return 0
    })
  }

  const [card1, card2] = selectedCards

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-6xl bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 
                      rounded-2xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Compare Cards</h2>
            <p className="text-gray-400 text-sm">Select two cards to compare their stats</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-3xl transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-6 grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Card Selection */}
          <div className="lg:col-span-2 space-y-4">
            {/* Sort Controls */}
            <div className="flex gap-2">
              {(['attack', 'defense', 'rarity'] as SortOption[]).map((option) => (
                <button
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                            ${sortBy === option 
                              ? 'bg-gold text-black' 
                              : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)} {option !== 'rarity' && (option === 'attack' ? '⚔️' : '🛡️')}
                </button>
              ))}
            </div>

            {/* Card Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[500px] overflow-y-auto p-2">
              {getSortedCards().map((card) => (
                <div 
                  key={card.id}
                  onClick={() => {
                    if (!selectedCards[0]) {
                      handleSelectCard(card, 0)
                    } else if (!selectedCards[1]) {
                      handleSelectCard(card, 1)
                    }
                  }}
                  className={`relative cursor-pointer transform hover:scale-105 transition-all
                            ${card1?.id === card.id || card2?.id === card.id ? 'ring-2 ring-gold' : ''}`}
                >
                  <Card card={card} />
                  {(card1?.id === card.id || card2?.id === card.id) && (
                    <div className="absolute top-2 right-2 bg-gold text-black text-xs font-bold px-2 py-1 rounded-full">
                      {card1?.id === card.id ? '1' : '2'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Comparison Results */}
          <div className="space-y-4">
            {/* Selected Cards Preview */}
            <div className="grid grid-cols-2 gap-4">
              <SelectedCardSlot 
                card={card1} 
                slotNumber={1} 
                onClear={() => clearSelection(0)} 
              />
              <SelectedCardSlot 
                card={card2} 
                slotNumber={2} 
                onClear={() => clearSelection(1)} 
              />
            </div>

            {/* Comparison Stats */}
            {card1 && card2 && (
              <div className="bg-black/30 rounded-xl p-4 border border-white/5 space-y-3">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                  Comparison Results
                </h3>
                
                <ComparisonRow 
                  label="Attack" 
                  value1={card1.attack} 
                  value2={card2.attack} 
                  higher={card1.attack > card2.attack ? 1 : card2.attack > card1.attack ? 2 : 0}
                />
                <ComparisonRow 
                  label="Defense" 
                  value1={card1.defense} 
                  value2={card2.defense} 
                  higher={card1.defense > card2.defense ? 1 : card2.defense > card1.defense ? 2 : 0}
                />
                <ComparisonRow 
                  label="Rarity" 
                  value1={card1.rarity} 
                  value2={card2.rarity}
                  higher={getRarityScore(card1.rarity) > getRarityScore(card2.rarity) ? 1 : 
                           getRarityScore(card2.rarity) > getRarityScore(card1.rarity) ? 2 : 0}
                />

                {/* Winner Indicator */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-center text-sm text-gray-400 mb-2">Overall Winner</p>
                  <p className={`text-center font-bold text-lg ${
                    getOverallWinner(card1, card2) === 1 ? 'text-green-400' : 
                    getOverallWinner(card2, card1) === 2 ? 'text-blue-400' : 'text-yellow-400'
                  }`}>
                    {getOverallWinner(card1, card2) === 1 ? card1.name :
                     getOverallWinner(card1, card2) === 2 ? card2.name : 'Tie!'}
                  </p>
                </div>
              </div>
            )}

            {/* Advantages */}
            {card1 && card2 && (
              <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Advantages
                </h3>
                <div className="space-y-2 text-sm">
                  {card1.attack > card2.attack && (
                    <p className="text-green-400">⚔️ {card1.name} has +{card1.attack - card2.attack} more Attack</p>
                  )}
                  {card2.attack > card1.attack && (
                    <p className="text-blue-400">⚔️ {card2.name} has +{card2.attack - card1.attack} more Attack</p>
                  )}
                  {card1.defense > card2.defense && (
                    <p className="text-green-400">🛡️ {card1.name} has +{card1.defense - card2.defense} more Defense</p>
                  )}
                  {card2.defense > card1.defense && (
                    <p className="text-blue-400">🛡️ {card2.name} has +{card2.defense - card1.defense} more Defense</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SelectedCardSlot({ card, slotNumber, onClear }: { 
  card: CardType | null
  slotNumber: number
  onClear: () => void 
}) {
  if (!card) {
    return (
      <div className="aspect-[3/4] bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-600 
                      flex flex-col items-center justify-center text-gray-500">
        <span className="text-3xl mb-2">?</span>
        <span className="text-xs">Slot {slotNumber}</span>
      </div>
    )
  }

  return (
    <div className="relative">
      <Card card={card} />
      <button
        onClick={onClear}
        className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full
                   flex items-center justify-center text-sm font-bold hover:bg-red-400 transition-colors"
      >
        ×
      </button>
    </div>
  )
}

function ComparisonRow({ label, value1, value2, higher }: { 
  label: string
  value1: string | number
  value2: string | number
  higher: number
}) {
  return (
    <div className="grid grid-cols-3 gap-2 items-center text-sm">
      <span className={`text-right ${higher === 1 ? 'text-green-400 font-bold' : 'text-gray-400'}`}>
        {value1}
      </span>
      <span className="text-center text-gray-500 text-xs uppercase">{label}</span>
      <span className={`text-left ${higher === 2 ? 'text-blue-400 font-bold' : 'text-gray-400'}`}>
        {value2}
      </span>
    </div>
  )
}

function getOverallWinner(card1: CardType, card2: CardType): number {
  const score1 = card1.attack + card1.defense + getRarityScore(card1.rarity) * 5
  const score2 = card2.attack + card2.defense + getRarityScore(card2.rarity) * 5
  
  if (score1 > score2) return 1
  if (score2 > score1) return 2
  return 0
}
