'use client'

import type { Card, CardRarity } from '@/types/card'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface CardProps {
  card: Card
  onClick?: () => void
  disabled?: boolean
  showBack?: boolean
  isFlipping?: boolean
  isSelected?: boolean
  onHover?: (hovered: boolean) => void
}

const rarityGradients: Record<CardRarity, string> = {
  common: 'from-slate-500 to-slate-700',
  rare: 'from-blue-500 to-indigo-700',
  epic: 'from-violet-500 to-purple-800',
  legendary: 'from-amber-400 via-orange-400 to-rose-600',
}

const rarityBorders: Record<CardRarity, string> = {
  common: 'border-slate-400 hover:border-slate-300',
  rare: 'border-blue-400 hover:border-blue-300 hover:shadow-blue-500/40',
  epic: 'border-violet-400 hover:border-violet-300 hover:shadow-violet-500/40',
  legendary: 'border-amber-400 hover:border-amber-300 hover:shadow-amber-500/40 animate-legendary-glow',
}

const rarityBadges: Record<CardRarity, string> = {
  common: 'bg-slate-500/90 text-white',
  rare: 'bg-blue-500/90 text-white',
  epic: 'bg-violet-500/90 text-white',
  legendary: 'bg-gradient-to-r from-amber-400 to-orange-400 text-black font-bold',
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
      rarityGradients[card.rarity]
    )}>
      {/* Card Glow Effect */}
      <div className={cn(
        "absolute inset-0 opacity-0 transition-opacity duration-300",
        isHovered && "opacity-100",
        {
          common: "",
          rare: "bg-blue-500/10",
          epic: "bg-purple-500/10",
          legendary: "bg-yellow-500/10",
        }[card.rarity]
      )} />

      {/* Legendary animated particles */}
      {card.rarity === 'legendary' && (
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
      {card.rarity === 'epic' && (
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
            rarityBadges[card.rarity]
          )}>
            {card.rarity}
          </span>
        </div>
      </div>

      {/* Center Section - Card Image/Illustration */}
      <div className="absolute top-16 left-3 right-3 bottom-24 rounded-lg overflow-hidden bg-black/30 backdrop-blur-sm border border-white/10">
        {card.image ? (
          <img 
            src={card.image} 
            alt={card.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative">
              <span className="text-7xl filter drop-shadow-2xl animate-card-float">
                {getCardEmoji(card.rarity)}
              </span>
              {card.rarity === 'legendary' && (
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 rounded-full blur-xl animate-pulse" />
              )}
            </div>
          </div>
        )}
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
        {card.specialAbility && (
          <p className="text-[10px] text-white/70 italic line-clamp-2 leading-relaxed">
            {card.specialAbility}
          </p>
        )}

        {/* Card ID */}
        <div className="flex items-center justify-between text-[9px] text-white/50">
          <span>#{card.id.toString()}</span>
          <span>Ed. 1</span>
        </div>
      </div>

      {/* Rarity Glow Border */}
      <div className={cn(
        "absolute inset-0 rounded-xl border-2 pointer-events-none transition-all duration-300",
        rarityBorders[card.rarity as CardRarity],
        isHovered && "scale-[1.02]"
      )} />

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute inset-0 rounded-xl border-4 border-[#C9A227] bg-[#C9A227]/10 pointer-events-none animate-pulse" />
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
        "relative w-full aspect-[7/10] shrink-0",
        "transform transition-all duration-300 ease-out",
        "hover:scale-105 hover:z-10",
        isFlipping && "animate-card-flip",
        isHovered && !disabled && "translateY-[-8px]",
        disabled && "opacity-50 cursor-not-allowed",
        isSelected && "ring-4 ring-[#C9A227] ring-offset-2 ring-offset-[#12111a]"
      )}
      style={{
        boxShadow: isHovered && !disabled ? getHoverShadow(card.rarity as CardRarity) : undefined,
      }}
    >
      {cardContent}
    </button>
  )
}

function getCardEmoji(rarity: CardRarity): string {
  const emojis: Record<CardRarity, string> = {
    legendary: '👑',
    epic: '💎',
    rare: '⭐',
    common: '🎴',
  }
  return emojis[rarity] || emojis.common
}

function getHoverShadow(rarity: CardRarity): string {
  const shadows: Record<CardRarity, string> = {
    common: '0 8px 32px rgba(0,0,0,0.4)',
    rare: '0 8px 32px rgba(59,130,246,0.3)',
    epic: '0 8px 32px rgba(139,92,246,0.35)',
    legendary: '0 8px 40px rgba(201,162,39,0.45), 0 0 20px rgba(201,162,39,0.2)',
  }
  return shadows[rarity]
}
