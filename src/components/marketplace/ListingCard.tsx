'use client'

import { useState } from 'react'
import type { Card as CardType } from '@/types'
import { CardRarity, CardType as CardTypeEnum } from '@/types'
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
  card?: CardType
  onBuy: (listingId: number) => void
  onClick?: () => void
  isLoading?: boolean
}

const rarityGradients: Record<CardRarity, string> = {
  Common: 'from-gray-600 to-gray-800',
  Rare: 'from-blue-600 to-blue-900',
  Epic: 'from-purple-600 to-purple-900',
  Legendary: 'from-yellow-500 via-orange-500 to-red-600',
}

const rarityBorders: Record<CardRarity, string> = {
  Common: 'border-gray-400',
  Rare: 'border-blue-400 hover:border-blue-300',
  Epic: 'border-purple-400 hover:border-purple-300',
  Legendary: 'border-yellow-400 hover:border-yellow-300 animate-legendary-glow',
}

const rarityBadges: Record<CardRarity, string> = {
  Common: 'bg-gray-500/90 text-white',
  Rare: 'bg-blue-500/90 text-white',
  Epic: 'bg-purple-500/90 text-white',
  Legendary: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold',
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

  const rarity = card?.rarity || CardRarity.Common
  const cardName = card?.name || `Card #${listing.tokenId}`
  const attack = card?.attack || 0
  const defense = card?.defense || 0
  const ability = card?.ability

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
      {/* Card Background */}
      <div className={cn(
        "absolute inset-0 rounded-xl overflow-hidden",
        "bg-gradient-to-br",
        rarityGradients[rarity]
      )}>
        {/* Hover Glow Effect */}
        <div className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-300",
          isHovered && "opacity-100",
          rarity === 'Rare' && "bg-blue-500/10",
          rarity === 'Epic' && "bg-purple-500/10",
          rarity === 'Legendary' && "bg-yellow-500/10"
        )} />

        {/* Legendary Particles */}
        {rarity === 'Legendary' && (
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

        {/* Top Section - Name & Rarity */}
        <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-start justify-between">
            <h3 className="text-white font-bold text-sm leading-tight line-clamp-1 drop-shadow-lg max-w-[70%]">
              {cardName}
            </h3>
            <span className={cn(
              "text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide",
              rarityBadges[rarity]
            )}>
              {rarity}
            </span>
          </div>
        </div>

        {/* Center Section - Card Image */}
        <div className="absolute top-16 left-3 right-3 bottom-24 rounded-lg overflow-hidden bg-black/30 backdrop-blur-sm border border-white/10">
          {card?.imageUrl ? (
            <img src={card.imageUrl} alt={cardName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-7xl filter drop-shadow-2xl animate-card-float">
                {getCardEmoji(card?.type || CardTypeEnum.Attack)}
              </span>
            </div>
          )}
        </div>

        {/* Bottom Section - Stats */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 bg-red-500/80 px-2 py-1 rounded text-xs font-bold text-white">
              <span>⚔️</span>
              <span>{attack}</span>
            </div>
            <div className="flex items-center gap-1 bg-blue-500/80 px-2 py-1 rounded text-xs font-bold text-white">
              <span>🛡️</span>
              <span>{defense}</span>
            </div>
          </div>
          {ability && (
            <p className="text-[10px] text-white/70 italic line-clamp-2 leading-relaxed">
              {ability}
            </p>
          )}
        </div>

        {/* Rarity Border */}
        <div className={cn(
          "absolute inset-0 rounded-xl border-2 pointer-events-none transition-all duration-300",
          rarityBorders[rarity],
          isHovered && "scale-[1.02]"
        )} />
      </div>

      {/* Price Tag Overlay */}
      <div className="absolute bottom-16 left-3 right-3">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2 border border-gold/30">
          <p className="text-gold font-bold text-center text-lg">
            {formatEther(listing.price)} MNT
          </p>
          <p className="text-gray-400 text-[10px] text-center">
            Seller: {formatAddress(listing.seller)}
          </p>
        </div>
      </div>

      {/* Buy Button */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
        <button
          onClick={handleBuyClick}
          disabled={isLoading || isBuying}
          className={cn(
            "w-full py-2 rounded-lg font-bold text-sm transition-all",
            "bg-gold hover:bg-gold-light text-black",
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
