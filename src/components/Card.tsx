'use client'

import type { Card as CardType } from '@/types'
import { getRarityColor } from '@/lib/utils'

interface CardProps {
  card: CardType
  onClick?: () => void
  disabled?: boolean
  showStats?: boolean
}

export function Card({ card, onClick, disabled, showStats = true }: CardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative aspect-[3/4] rounded-lg overflow-hidden
        bg-gradient-to-br from-purple-dark to-blue-dark
        border-2 border-card-border
        transition-all duration-200
        hover:scale-105 hover:border-gold
        disabled:opacity-50 disabled:cursor-not-allowed
        ${getRarityColor(card.rarity)}
      `}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-4xl">🎴</span>
      </div>
      {showStats && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 text-sm">
          <p className="font-semibold truncate">{card.name}</p>
          <div className="flex justify-between">
            <span>ATK: {card.attack}</span>
            <span>DEF: {card.defense}</span>
          </div>
        </div>
      )}
    </button>
  )
}
