'use client'

import type { Card as CardType, CardRarity as RarityType } from '@/types'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface CardProps {
  card: CardType
  onClick?: () => void
  disabled?: boolean
  showBack?: boolean
  isFlipping?: boolean
  isSelected?: boolean
  onHover?: (hovered: boolean) => void
}

const rarityGradients: Record<RarityType, string> = {
  Common: 'from-gray-600 to-gray-800',
  Rare: 'from-blue-600 to-blue-900',
  Epic: 'from-purple-600 to-purple-900',
  Legendary: 'from-yellow-500 via-orange-500 to-red-600',
}

const rarityBorders: Record<RarityType, string> = {
  Common: 'border-gray-400 hover:border-gray-300',
  Rare: 'border-blue-400 hover:border-blue-300 hover:shadow-blue-500/50',
  Epic: 'border-purple-400 hover:border-purple-300 hover:shadow-purple-500/50',
  Legendary: 'border-yellow-400 hover:border-yellow-300 hover:shadow-yellow-500/50 animate-legendary-glow',
}

const rarityBadges: Record<RarityType, string> = {
  Common: 'bg-gray-500/90 text-white',
  Rare: 'bg-blue-500/90 text-white',
  Epic: 'bg-purple-500/90 text-white',
  Legendary: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold',
}

export function Card({ 
  card, 
  onClick, 
  disabled, 
  showBack = false,
  isFlipping = false,
  isSelected = false,
  onHover 
}: CardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
    onHover?.(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    onHover?.(false)
  }

  const cardContent = showBack ? (
    <div className={cn(
      "absolute inset-0 rounded-xl flex flex-col items-center justify-center",
      "bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950",
      "border-2 border-indigo-500/50"
    )}>
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <defs>
            <pattern id="mystery-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
              <circle cx="10" cy="10" r="2" fill="currentColor" className="text-purple-400" />
              <circle cx="0" cy="0" r="1" fill="currentColor" className="text-indigo-400" />
              <circle cx="20" cy="20" r="1" fill="currentColor" className="text-indigo-400" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#mystery-pattern)" />
        </svg>
      </div>
      <div className="text-6xl mb-4 animate-pulse">🃏</div>
      <p className="text-indigo-300 font-display text-sm tracking-widest">MYSTERY CARD</p>
      <p className="text-indigo-500/70 text-xs mt-2">Reveal to discover</p>
    </div>
  ) : (
    <div className={cn(
      "absolute inset-0 rounded-xl overflow-hidden",
      "bg-gradient-to-br",
      rarityGradients[card.rarity as RarityType]
    )}>
      {/* Card Glow Effect */}
      <div className={cn(
        "absolute inset-0 opacity-0 transition-opacity duration-300",
        isHovered && "opacity-100",
        {
          "Common": "",
          "Rare": "bg-blue-500/10",
          "Epic": "bg-purple-500/10",
          "Legendary": "bg-yellow-500/10",
        }[card.rarity as RarityType]
      )} />

      {/* Legendary animated particles */}
      {card.rarity === 'Legendary' && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-float"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.3}s`,
                boxShadow: '0 0 6px 2px rgba(255, 215, 0, 0.8)',
              }}
            />
          ))}
        </div>
      )}

      {/* Epic animated gradient */}
      {card.rarity === 'Epic' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      )}

      {/* Top Section - Name & Rarity Badge */}
      <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-start justify-between">
          <h3 className="text-white font-bold text-sm leading-tight line-clamp-1 drop-shadow-lg max-w-[70%]">
            {card.name}
          </h3>
          <span className={cn(
            "text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide",
            rarityBadges[card.rarity as RarityType]
          )}>
            {card.rarity}
          </span>
        </div>
      </div>

      {/* Center Section - Card Image/Illustration */}
      <div className="absolute top-16 left-3 right-3 bottom-24 rounded-lg overflow-hidden bg-black/30 backdrop-blur-sm border border-white/10">
        {card.imageUrl ? (
          <img 
            src={card.imageUrl} 
            alt={card.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative">
              <span className="text-7xl filter drop-shadow-2xl animate-card-float">
                {getCardEmoji(card.type)}
              </span>
              {card.rarity === 'Legendary' && (
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 rounded-full blur-xl animate-pulse" />
              )}
            </div>
          </div>
        )}
        
        {/* Card Type Badge */}
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white/80">
          {card.type}
        </div>
      </div>

      {/* Bottom Section - Stats & Info */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent space-y-2">
        {/* Stats Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-red-500/80 px-2 py-1 rounded text-xs font-bold text-white">
            <span>⚔️</span>
            <span>{card.attack}</span>
          </div>
          <div className="flex items-center gap-1 bg-blue-500/80 px-2 py-1 rounded text-xs font-bold text-white">
            <span>🛡️</span>
            <span>{card.defense}</span>
          </div>
        </div>

        {/* Special Ability */}
        {card.ability && (
          <p className="text-[10px] text-white/70 italic line-clamp-2 leading-relaxed">
            {card.ability}
          </p>
        )}

        {/* Card ID */}
        <div className="flex items-center justify-between text-[9px] text-white/50">
          <span>#{card.tokenId.toString()}</span>
          <span>Ed. 1</span>
        </div>
      </div>

      {/* Rarity Glow Border */}
      <div className={cn(
        "absolute inset-0 rounded-xl border-2 pointer-events-none transition-all duration-300",
        rarityBorders[card.rarity as RarityType],
        isHovered && "scale-[1.02]"
      )} />

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute inset-0 rounded-xl border-4 border-gold bg-gold/10 pointer-events-none animate-pulse" />
      )}
    </div>
  )

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative w-[280px] h-[400px] shrink-0",
        "transform transition-all duration-300 ease-out",
        "hover:scale-105 hover:z-10",
        isFlipping && "animate-card-flip",
        isHovered && !disabled && "translateY-[-8px]",
        disabled && "opacity-50 cursor-not-allowed",
        isSelected && "ring-4 ring-gold ring-offset-2 ring-offset-background"
      )}
      style={{
        boxShadow: isHovered && !disabled ? getHoverShadow(card.rarity as RarityType) : undefined,
      }}
    >
      {cardContent}
    </button>
  )
}

function getCardEmoji(type: string): string {
  const emojis: Record<string, string> = {
    Attack: '⚔️',
    Defense: '🛡️',
    Support: '✨',
    Special: '🌟',
  }
  return emojis[type] || '🎴'
}

function getHoverShadow(rarity: RarityType): string {
  const shadows: Record<RarityType, string> = {
    Common: '0 10px 40px rgba(0,0,0,0.5)',
    Rare: '0 10px 40px rgba(59,130,246,0.4)',
    Epic: '0 10px 40px rgba(139,92,246,0.5)',
    Legendary: '0 10px 50px rgba(255,215,0,0.6), 0 0 30px rgba(255,165,0,0.3)',
  }
  return shadows[rarity]
}
