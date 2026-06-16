'use client'

import type { Card as CardType } from '@/types'
import { CardRarity, CardType as CardTypeEnum } from '@/types'
import { cn, formatAddress, formatEther } from '@/lib/utils'

interface ListingDetailProps {
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
  isOpen: boolean
  onClose: () => void
  onBuy?: () => void
  onSell?: () => void
}

const rarityGradients: Record<CardRarity, string> = {
  Common: 'from-slate-500 to-slate-700',
  Rare: 'from-blue-500 to-indigo-700',
  Epic: 'from-violet-500 to-purple-800',
  Legendary: 'from-amber-400 via-orange-400 to-rose-600',
}

const rarityBorders: Record<CardRarity, string> = {
  Common: 'border-slate-400',
  Rare: 'border-blue-400 hover:border-blue-300',
  Epic: 'border-violet-400 hover:border-violet-300',
  Legendary: 'border-amber-400 hover:border-amber-300 animate-legendary-glow',
}

function RarityBadge({ rarity }: { rarity: string }) {
  const styles: Record<string, string> = {
    Legendary: 'bg-gradient-to-r from-amber-400 to-orange-400 text-black font-bold px-4 py-2 rounded-full',
    Epic: 'bg-violet-500/90 text-white font-semibold px-4 py-2 rounded-full',
    Rare: 'bg-blue-500/90 text-white font-semibold px-4 py-2 rounded-full',
    Common: 'bg-slate-500/90 text-white font-semibold px-4 py-2 rounded-full',
  }

  return (
    <span className={styles[rarity] || styles.Common}>
      {rarity}
    </span>
  )
}

export function ListingDetail({ listing, card, isOpen, onClose, onBuy, onSell }: ListingDetailProps) {
  const rarity = card?.rarity || CardRarity.Common
  const cardName = card?.name || `Card #${listing.tokenId}`
  const attack = card?.attack || 0
  const defense = card?.defense || 0

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <div
        className="relative z-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#1a1625] via-[#2d1f3d] to-[#1a2535] rounded-2xl border border-white/10 shadow-2xl shadow-[#7C6BAF]/20"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white text-3xl transition-colors z-10"
        >
          ×
        </button>

        <div className="flex flex-col md:flex-row gap-6 p-6">
          {/* Left - Card Display */}
          <div className="flex-shrink-0">
            <div className="relative w-[200px] h-[280px] mx-auto">
              <div className={cn(
                "absolute inset-0 rounded-xl overflow-hidden",
                "bg-gradient-to-br",
                rarityGradients[rarity]
              )}>
                {/* Legendary particles */}
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
                          boxShadow: '0 0 6px 2px rgba(201, 162, 39, 0.8)',
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Top Section */}
                <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/60 to-transparent">
                  <div className="flex items-start justify-between">
                    <h3 className="text-white font-bold text-sm leading-tight">
                      {cardName}
                    </h3>
                    <RarityBadge rarity={rarity} />
                  </div>
                </div>

                {/* Center - Card Image */}
                <div className="absolute top-16 left-3 right-3 bottom-24 rounded-lg overflow-hidden bg-black/30 backdrop-blur-sm border border-white/10">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-7xl filter drop-shadow-2xl animate-card-float">
                      {getCardEmoji(card?.type || CardTypeEnum.Attack)}
                    </span>
                  </div>
                </div>

                {/* Bottom - Stats */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-red-500/80 px-2 py-1 rounded text-xs font-bold text-white">
                      <span>⚔️</span>
                      <span>{attack}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-blue-500/80 px-2 py-1 rounded text-xs font-bold text-white">
                      <span>🛡️</span>
                      <span>{defense}</span>
                    </div>
                  </div>
                  {card?.ability && (
                    <p className="text-[10px] text-white/70 italic mt-2 line-clamp-2">
                      {card.ability}
                    </p>
                  )}
                </div>

                <div className={cn(
                  "absolute inset-0 rounded-xl border-2 pointer-events-none",
                  rarityBorders[rarity]
                )} />
              </div>
            </div>
          </div>

          {/* Right - Details */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{cardName}</h2>
              <p className="text-gray-400 text-sm">Token ID: #{listing.tokenId}</p>
            </div>

            {/* Price */}
            <div className="bg-black/30 rounded-xl p-4 border border-[#C9A227]/30">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Listing Price</p>
              <p className="text-3xl font-bold text-[#C9A227]">{formatEther(listing.price)} MNT</p>
            </div>

            {/* Card Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-red-500/15 to-red-600/15 rounded-xl p-4 border border-red-500/25">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">⚔️</span>
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Attack</span>
                </div>
                <p className="text-3xl font-bold text-red-400">{attack}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/15 to-blue-600/15 rounded-xl p-4 border border-blue-500/25">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🛡️</span>
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Defense</span>
                </div>
                <p className="text-3xl font-bold text-blue-400">{defense}</p>
              </div>
            </div>

            {/* Card Type & Ability */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getCardEmoji(card?.type || CardTypeEnum.Attack)}</span>
                <div>
                  <p className="text-xs text-gray-400">Card Type</p>
                  <p className="text-white font-medium">{card?.type || 'Unknown'}</p>
                </div>
              </div>

              {card?.ability && (
                <div className="bg-[#7C6BAF]/10 rounded-xl p-4 border border-[#7C6BAF]/20">
                  <p className="text-xs text-[#7C6BAF] uppercase tracking-wide mb-1">Special Ability</p>
                  <p className="text-white text-sm">{card.ability}</p>
                </div>
              )}

              {listing.description && (
                <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Seller Notes</p>
                  <p className="text-white text-sm">{listing.description}</p>
                </div>
              )}
            </div>

            {/* Seller Info */}
            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Seller</p>
              <p className="text-[#C9A227] font-mono text-sm">{formatAddress(listing.seller)}</p>
              <p className="text-xs text-gray-500 mt-1">Listed on {new Date(listing.createdAt * 1000).toLocaleDateString()}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {onBuy && (
                <button
                  onClick={onBuy}
                  className="flex-1 bg-gradient-to-r from-[#C9A227] to-[#D4B445]
                           text-black font-bold py-3 px-6 rounded-xl
                           hover:from-[#D4B445] hover:to-[#C9A227] transition-all
                           shadow-lg shadow-[#C9A227]/25"
                >
                  Buy Now
                </button>
              )}
              {onSell && (
                <button
                  onClick={onSell}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl
                           border border-white/10 transition-all"
                >
                  Sell Similar
                </button>
              )}
            </div>
          </div>
        </div>
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
