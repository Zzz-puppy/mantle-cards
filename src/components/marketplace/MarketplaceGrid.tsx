'use client'

import { useState, useMemo } from 'react'
import type { Card, CardRarity } from '@/types'
import { ListingCard } from './ListingCard'
import { CardSkeleton } from '@/components/CardSkeleton'
import { cn } from '@/lib/utils'

export interface Listing {
  listingId: number
  seller: string
  tokenId: number
  price: bigint
  description: string
  createdAt: number
  isActive: boolean
}

interface MarketplaceGridProps {
  listings: Listing[]
  cards?: Map<number, Card>
  isLoading?: boolean
  onBuyListing: (listingId: number) => void
  onListingClick?: (listing: Listing) => void
  currentUserAddress?: string
}

type SortOption = 'newest' | 'oldest' | 'price_low' | 'price_high' | 'rarity'
type FilterRarity = CardRarity | 'All'

export function MarketplaceGrid({
  listings,
  cards,
  isLoading,
  onBuyListing,
  onListingClick,
  currentUserAddress
}: MarketplaceGridProps) {
  const [filterRarity, setFilterRarity] = useState<FilterRarity>('All')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: '', max: '' })
  const [sellerFilter, setSellerFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAndSortedListings = useMemo(() => {
    let result = [...listings]

    // Apply search query (searches card names)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(listing => {
        const card = cards?.get(listing.tokenId)
        const cardName = card?.name?.toLowerCase() || ''
        const description = listing.description.toLowerCase()
        return cardName.includes(query) || description.includes(query)
      })
    }

    // Apply rarity filter
    if (filterRarity !== 'All') {
      result = result.filter(listing => {
        const card = cards?.get(listing.tokenId)
        return card?.rarity === filterRarity
      })
    }

    // Apply price range filter
    if (priceRange.min) {
      const minPrice = BigInt(Math.floor(parseFloat(priceRange.min) * 1e18))
      result = result.filter(listing => listing.price >= minPrice)
    }
    if (priceRange.max) {
      const maxPrice = BigInt(Math.floor(parseFloat(priceRange.max) * 1e18))
      result = result.filter(listing => listing.price <= maxPrice)
    }

    // Apply seller filter
    if (sellerFilter) {
      const sellerQuery = sellerFilter.toLowerCase()
      result = result.filter(listing => 
        listing.seller.toLowerCase().includes(sellerQuery)
      )
    }

    // Apply sorting
    const rarityOrder: Record<CardRarity, number> = {
      Common: 1,
      Rare: 2,
      Epic: 3,
      Legendary: 4,
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return Number(a.price - b.price)
        case 'price_high':
          return Number(b.price - a.price)
        case 'oldest':
          return a.createdAt - b.createdAt
        case 'newest':
          return b.createdAt - a.createdAt
        case 'rarity': {
          const cardA = cards?.get(a.tokenId)
          const cardB = cards?.get(b.tokenId)
          const rarityA = cardA ? rarityOrder[cardA.rarity] || 0 : 0
          const rarityB = cardB ? rarityOrder[cardB.rarity] || 0 : 0
          return rarityB - rarityA
        }
        default:
          return 0
      }
    })

    return result
  }, [listings, cards, filterRarity, sortBy, priceRange, sellerFilter, searchQuery])

  const clearFilters = () => {
    setFilterRarity('All')
    setSortBy('newest')
    setPriceRange({ min: '', max: '' })
    setSellerFilter('')
    setSearchQuery('')
  }

  const hasActiveFilters = filterRarity !== 'All' || 
    sortBy !== 'newest' || 
    priceRange.min || 
    priceRange.max || 
    sellerFilter ||
    searchQuery

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between
                      bg-black/30 rounded-xl p-4 border border-white/5">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cards..."
              className="bg-gray-800/80 text-white text-sm px-3 py-2 rounded-lg border border-white/10
                         focus:outline-none focus:border-gold transition-colors w-40 pl-8"
            />
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>

          {/* Rarity Filter */}
          <select
            value={filterRarity}
            onChange={(e) => setFilterRarity(e.target.value as FilterRarity)}
            className="bg-gray-800/80 text-white text-sm px-3 py-2 rounded-lg border border-white/10
                       focus:outline-none focus:border-gold transition-colors cursor-pointer"
          >
            <option value="All">All Rarities</option>
            <option value="Common">Common</option>
            <option value="Rare">Rare</option>
            <option value="Epic">Epic</option>
            <option value="Legendary">Legendary</option>
          </select>

          {/* Price Range */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              step="0.01"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              placeholder="Min"
              className="w-20 bg-gray-800/80 text-white text-sm px-2 py-2 rounded-lg 
                         border border-white/10 focus:outline-none focus:border-gold transition-colors"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              placeholder="Max"
              className="w-20 bg-gray-800/80 text-white text-sm px-2 py-2 rounded-lg 
                         border border-white/10 focus:outline-none focus:border-gold transition-colors"
            />
            <span className="text-gray-400 text-sm">MNT</span>
          </div>

          {/* Seller Filter */}
          <input
            type="text"
            value={sellerFilter}
            onChange={(e) => setSellerFilter(e.target.value)}
            placeholder="Seller address..."
            className="bg-gray-800/80 text-white text-sm px-3 py-2 rounded-lg border border-white/10
                       focus:outline-none focus:border-gold transition-colors w-36"
          />

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-gold text-sm hover:text-gold-light transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-gray-800/80 text-white text-sm px-3 py-2 rounded-lg border border-white/10
                       focus:outline-none focus:border-gold transition-colors cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rarity">Best Rarity</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-gray-400 text-sm">
        Showing {filteredAndSortedListings.length} of {listings.length} listings
      </p>

      {/* Grid */}
      {filteredAndSortedListings.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 justify-items-center">
          {filteredAndSortedListings.map((listing) => (
            <ListingCard
              key={listing.listingId}
              listing={listing}
              card={cards?.get(listing.tokenId)}
              onBuy={onBuyListing}
              onClick={() => onListingClick?.(listing)}
              isLoading={false}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-8xl mb-6 opacity-30">🎴</div>
          <h3 className="text-2xl font-bold text-white mb-2">No Cards Found</h3>
          <p className="text-gray-400 mb-6">
            {hasActiveFilters
              ? 'Try adjusting your filters to see more listings.'
              : 'No cards are currently listed for sale.'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="bg-gold hover:bg-gold-light text-black font-bold
                         px-6 py-3 rounded-xl transition-all"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}
