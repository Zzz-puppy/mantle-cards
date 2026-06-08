'use client'

import { Card } from '@/types/card'

interface CardSlotProps {
  card: Card | null
  position: 'player' | 'opponent'
  isSelected?: boolean
  isAttacking?: boolean
  isDamaged?: boolean
  damage?: number
  disabled?: boolean
  onClick?: () => void
}

export function CardSlot({
  card,
  position,
  isSelected = false,
  isAttacking = false,
  isDamaged = false,
  damage,
  disabled = false,
  onClick,
}: CardSlotProps) {
  const baseClasses = `
    relative flex flex-col items-center justify-center
    rounded-xl border-2 transition-all duration-300
    ${position === 'player' ? 'bg-gradient-to-t from-blue-900/50 to-blue-800/30' : 'bg-gradient-to-t from-red-900/50 to-red-800/30'}
    ${isSelected ? 'border-yellow-400 shadow-lg shadow-yellow-400/50 scale-105' : 'border-gray-600'}
    ${isAttacking ? 'animate-attack-forward' : ''}
    ${isDamaged ? 'animate-shake' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}
  `

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick()
    }
  }

  return (
    <div className={baseClasses} onClick={handleClick}>
      {card ? (
        <>
          {/* Card Image/Placeholder */}
          <div className="w-20 h-28 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center overflow-hidden">
            {card.image ? (
              <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-4xl">🎴</div>
            )}
          </div>

          {/* Card Name */}
          <div className="mt-2 text-sm font-semibold text-white text-center max-w-[80px] truncate">
            {card.name}
          </div>

          {/* Stats */}
          <div className="flex gap-3 mt-1 text-xs">
            <span className="text-red-400">⚔️ {card.attack}</span>
            <span className="text-blue-400">🛡️ {card.defense}</span>
          </div>

          {/* Rarity indicator */}
          <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
            card.rarity === 'legendary' ? 'bg-purple-500' :
            card.rarity === 'epic' ? 'bg-orange-500' :
            card.rarity === 'rare' ? 'bg-blue-500' :
            'bg-gray-500'
          }`} />

          {/* Damage number overlay */}
          {isDamaged && damage !== undefined && (
            <div className="absolute inset-0 flex items-center justify-center animate-float-damage">
              <div className="text-3xl font-bold text-red-500 drop-shadow-lg">
                -{damage}
              </div>
            </div>
          )}

          {/* Selected indicator */}
          {isSelected && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-yellow-400 text-black text-xs font-bold rounded-full animate-pulse">
              SELECTED
            </div>
          )}
        </>
      ) : (
        <div className="w-20 h-28 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center">
          <span className="text-gray-500 text-xs">Empty</span>
        </div>
      )}
    </div>
  )
}
