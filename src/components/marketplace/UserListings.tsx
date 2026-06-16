'use client'

import { useState } from 'react'
import type { Card, CardRarity, CardType } from '@/types'
import { CardType as CardTypeEnum } from '@/types'
import type { Listing } from './MarketplaceGrid'
import { cn, formatEther } from '@/lib/utils'

interface UserListingsProps {
  listings: Listing[]
  cardsMap: Map<number, Card>
  onCancelListing: (id: number) => void
  onUpdatePrice: (id: number, newPrice: bigint) => void
}

export function UserListings({ listings, cardsMap, onCancelListing, onUpdatePrice }: UserListingsProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [newPrice, setNewPrice] = useState('')

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4 opacity-50">📋</div>
        <h3 className="text-xl font-bold text-white mb-2">No Active Listings</h3>
        <p className="text-gray-400">
          You don't have any cards listed for sale.
        </p>
      </div>
    )
  }

  const handleEditPrice = (listing: Listing) => {
    setEditingId(listing.listingId)
    setNewPrice((Number(listing.price) / 1e18).toFixed(4))
  }

  const handleSavePrice = (listingId: number) => {
    const priceInWei = BigInt(Math.floor(parseFloat(newPrice) * 1e18))
    onUpdatePrice(listingId, priceInWei)
    setEditingId(null)
    setNewPrice('')
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white">Your Active Listings</h3>
      
      <div className="space-y-4">
        {listings.map(listing => {
          const card = cardsMap.get(listing.tokenId)
          return (
            <div
              key={listing.listingId}
              className="bg-black/30 rounded-xl p-4 border border-white/10 flex items-center gap-4"
            >
              <div className={`
                w-16 h-24 rounded-lg overflow-hidden shrink-0
                bg-gradient-to-br ${getRarityGradient(card?.rarity)}
              `}>
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl">
                    {getCardEmoji(card?.type as CardTypeEnum)}
                  </span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold truncate">
                  {card?.name || `Card #${listing.tokenId}`}
                </h4>
                <p className="text-gray-400 text-sm">
                  {card?.rarity} • Listed {formatTimeAgo(listing.createdAt)}
                </p>
                {listing.description && (
                  <p className="text-gray-500 text-xs truncate mt-1">
                    {listing.description}
                  </p>
                )}
              </div>

              <div className="text-right shrink-0">
                {editingId === listing.listingId ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-24 bg-gray-800 text-white px-2 py-1 rounded text-sm border border-white/10"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSavePrice(listing.listingId)}
                      className="text-green-400 hover:text-green-300 text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-gold font-bold">
                      {formatEther(listing.price)} MNT
                    </p>
                    <button
                      onClick={() => handleEditPrice(listing)}
                      className="text-gray-400 hover:text-gold text-xs"
                    >
                      Edit Price
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => onCancelListing(listing.listingId)}
                className="text-red-400 hover:text-red-300 text-sm px-3 py-1 rounded border border-red-400/30 hover:border-red-400/60 transition-colors"
              >
                Cancel
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function getRarityGradient(rarity?: CardRarity): string {
  switch (rarity) {
    case 'Legendary':
      return 'from-yellow-500 via-orange-500 to-red-600'
    case 'Epic':
      return 'from-purple-600 to-purple-900'
    case 'Rare':
      return 'from-blue-600 to-blue-900'
    default:
      return 'from-gray-600 to-gray-800'
  }
}

export function getCardEmoji(type?: CardType): string {
  if (!type) return '🎴'
  const emojis: Record<CardType, string> = {
    Attack: '⚔️',
    Defense: '🛡️',
    Support: '✨',
    Special: '🌟',
  }
  return emojis[type]
}

export function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}