'use client'

import { useState } from 'react'
import type { Card, CardRarity } from '@/types/card'
import { cn, formatAddress, formatEther } from '@/lib/utils'

interface ListingCardProps {
  listing: {
    listingId: number
    seller: string
    tokenId: number
    price: bigint
    description: string
    createdAt: number
    isActive: boolean
  }
  card?: Card
  onBuy: (listingId: number) => void
  onClick?: () => void
  isLoading?: boolean
}

const rarityGradients: Record<CardRarity, string> = {
  common: 'from-slate-500 to-slate-700',
  rare: 'from-blue-500 to-indigo-700',
  epic: 'from-violet-500 to-purple-800',
  legendary: 'from-amber-400 via-orange-400 to-rose-600',
}

const rarityBorders: Record<CardRarity, string> = {
  common: 'border-slate-400',
  rare: 'border-blue-400 hover:border-blue-300',
  epic: 'border-violet-400 hover:border-violet-300',
  legendary: 'border-amber-400 hover:border-amber-300 animate-legendary-glow',
}

const rarityBadges: Record<CardRarity, string> = {
  common: 'bg-slate-500/90 text-white',
  rare: 'bg-blue-500/90 text-white',
  epic: 'bg-violet-500/90 text-white',
  legendary: 'bg-gradient-to-r from-amber-400 to-orange-400 text-black font-bold',
}

export function ListingCard({ listing, card, onBuy, onClick, isLoading }: ListingCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isBuying, setIsBuying] = useState(false)

  const handleBuyClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isLoading || isBuying) return
    
    setIsBuying(true)
    try {
      await onBuy(listing.listingId)
    } finally {
      setIsBuying(false)
    }
  }

  const rarity = card?.rarity || 'common'
  const cardName = card?.name || `Card #${listing.tokenId}`
  const attack = card?.attack || 0
  const defense = card?.defense || 0
  const ability = card?.specialAbility

  return (
    <div
      className={cn(
        "relative w-full aspect-[3/4] rounded-xl overflow-hidden cursor-pointer",
        "transform transition-all duration-300 ease-out",
        "hover:scale-105 hover:z-10",
        isHovered && "translate-y-[-8px]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className={cn(
        "absolute inset-0 rounded-xl overflow-hidden",
        "bg-gradient-to-br",
        rarityGradients[rarity]
      )}>
        <div className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-300",
          isHovered && "opacity-100",
          rarity === 'rare' && "bg-blue-500/10",
          rarity === 'epic' && "bg-purple-500/10",
          rarity === 'legendary' && "bg-yellow-500/10"
        )} />

        {rarity === 'legendary' && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-float"
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${20 + (i % 3) * 25}%`,
                  animationDelay: `${i * 0.3}s`,
                  boxShadow: '0 0 6px 2px rgba(201, 162, 39, 0.8)',
                }}
              />
            ))}
          </div>
        )}

        {/* Top Section - Name & Rarity & Price */}
        <div className="absolute top-0 left-0 right-0 p-2 sm:p-3 bg-gradient-to-b from-black/70 to-transparent">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-white font-bold text-xs sm:text-sm leading-tight line-clamp-1 drop-shadow-lg flex-1">
              {cardName}
            </h3>
            <div className="flex flex-col items-end gap-1">
              <span className={cn(
                "text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-semibold uppercase",
                rarityBadges[rarity]
              )}>
                {rarity}
              </span>
              <div className="bg-black/70 backdrop-blur-sm rounded px-1.5 sm:px-2 py-0.5 border border-[#C9A227]/30">
                <p className="text-[#C9A227] font-bold text-[10px] sm:text-xs">
                  {formatEther(listing.price)} MNT
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Center Section - Card Image */}
        <div className="absolute top-14 sm:top-16 left-2 sm:left-3 right-2 sm:right-3 bottom-24 sm:bottom-28 rounded-lg overflow-hidden bg-black/30 backdrop-blur-sm border border-white/10">
          {card?.imageUrl ? (
            <img src={card.imageUrl} alt={cardName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl filter drop-shadow-2xl animate-card-float">
                {getCardEmoji(card?.type || CardTypeEnum.Attack)}
              </span>
            </div>
          )}
        </div>

        {/* Bottom Section - Stats & Info */}
        <div className="absolute bottom-10 sm:bottom-12 left-0 right-0 p-2 sm:p-3 bg-gradient-to-t from-black/80 to-transparent">
          {/* Attack & Defense */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-red-500/80 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[9px] sm:text-xs font-bold text-white">
              <span>⚔️</span>
              <span>{attack}</span>
            </div>
            <div className="flex items-center gap-1 bg-blue-500/80 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[9px] sm:text-xs font-bold text-white">
              <span>🛡️</span>
              <span>{defense}</span>
            </div>
          </div>
          {ability && (
            <p className="text-[9px] sm:text-[10px] text-white/70 italic line-clamp-2 leading-relaxed mt-1">
              {ability}
            </p>
          )}
        </div>

        <div className={cn(
          "absolute inset-0 rounded-xl border-2 pointer-events-none transition-all duration-300",
          rarityBorders[rarity],
          isHovered && "scale-[1.02]"
        )} />
      </div>

      {/* Buy Button */}
      <div className="absolute bottom-0 left-0 right-0 p-1.5 sm:p-2 bg-gradient-to-t from-black/95 to-transparent">
        <button
          onClick={handleBuyClick}
          disabled={isLoading || isBuying}
          className={cn(
            "w-full py-1.5 sm:py-2 rounded-lg font-bold text-[10px] sm:text-sm transition-all",
            "bg-[#C9A227] hover:bg-[#D4B445] text-black",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            isBuying && "animate-pulse"
          )}
        >
          {isBuying ? 'Processing...' : 'Buy Now'}
        </button>
      </div>
    </div>
  )
}

function getCardEmoji(type: CardTypeEnum): string {
  const emojis: Record<CardTypeEnum, string> = {
    [CardTypeEnum.Attack]: '⚔️',
    [CardTypeEnum.Defense]: '🛡️',
    [CardTypeEnum.Support]: '✨',
    [CardTypeEnum.Special]: '🌟',
  }
  return emojis[type] || '🎴'
}
