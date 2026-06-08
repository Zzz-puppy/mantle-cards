'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAccount } from 'wagmi'
import type { Card, CardRarity, CardType } from '@/types'
import { CardRarity as CardRarityEnum, CardType as CardTypeEnum } from '@/types'
import { MarketplaceGrid, SellCard, PurchaseFlow, Listing } from '@/components/marketplace'
import { useWallet } from '@/hooks/useWallet'
import { useBalance } from '@/hooks/useBalance'

// Mock data for demonstration - in production this would come from the blockchain
const mockCards: Card[] = [
  {
    id: '1',
    name: 'Dragon Knight',
    type: CardTypeEnum.Attack,
    rarity: CardRarityEnum.Legendary,
    attack: 95,
    defense: 70,
    ability: 'Ignites the battlefield, dealing 50% bonus fire damage to all enemies.',
    owner: '0x1234...abcd',
    tokenId: BigInt(1),
  },
  {
    id: '2',
    name: 'Frost Mage',
    type: CardTypeEnum.Special,
    rarity: CardRarityEnum.Epic,
    attack: 80,
    defense: 45,
    ability: 'Freezes enemies for 2 turns, reducing their attack by 40%.',
    owner: '0x1234...abcd',
    tokenId: BigInt(2),
  },
  {
    id: '3',
    name: 'Shield Bearer',
    type: CardTypeEnum.Defense,
    rarity: CardRarityEnum.Rare,
    attack: 30,
    defense: 90,
    ability: 'Creates a protective barrier that absorbs the next 3 attacks.',
    owner: '0x5678...efgh',
    tokenId: BigInt(3),
  },
  {
    id: '4',
    name: 'Shadow Assassin',
    type: CardTypeEnum.Attack,
    rarity: CardRarityEnum.Epic,
    attack: 88,
    defense: 35,
    ability: 'Attacks from the shadows, ignoring 60% of enemy defense.',
    owner: '0x5678...efgh',
    tokenId: BigInt(4),
  },
  {
    id: '5',
    name: 'Forest Guardian',
    type: CardTypeEnum.Support,
    rarity: CardRarityEnum.Rare,
    attack: 50,
    defense: 65,
    ability: 'Heals all allies for 25% of their max health at turn start.',
    owner: '0x1234...abcd',
    tokenId: BigInt(5),
  },
  {
    id: '6',
    name: 'Goblin Scout',
    type: CardTypeEnum.Attack,
    rarity: CardRarityEnum.Common,
    attack: 25,
    defense: 15,
    owner: '0x1234...abcd',
    tokenId: BigInt(6),
  },
  {
    id: '7',
    name: 'Phoenix Riser',
    type: CardTypeEnum.Special,
    rarity: CardRarityEnum.Legendary,
    attack: 85,
    defense: 80,
    ability: 'Revives once per battle with 50% health. Deals burn damage over 3 turns.',
    owner: '0x1234...abcd',
    tokenId: BigInt(7),
  },
  {
    id: '8',
    name: 'Stone Golem',
    type: CardTypeEnum.Defense,
    rarity: CardRarityEnum.Common,
    attack: 20,
    defense: 75,
    owner: '0x5678...efgh',
    tokenId: BigInt(8),
  },
]

// Mock listings - in production this would come from the Marketplace contract
const generateMockListings = (): Listing[] => {
  return [
    {
      listingId: 1,
      seller: '0x1234567890123456789012345678901234567890',
      tokenId: 1,
      price: BigInt('500000000000000000'), // 0.5 MNT
      description: 'Legendary Dragon Knight, perfect for aggressive decks!',
      createdAt: Date.now() - 86400000 * 2,
      isActive: true,
    },
    {
      listingId: 2,
      seller: '0x2345678901234567890123456789012345678901',
      tokenId: 2,
      price: BigInt('300000000000000000'), // 0.3 MNT
      description: 'Epic Frost Mage with amazing control abilities.',
      createdAt: Date.now() - 86400000,
      isActive: true,
    },
    {
      listingId: 3,
      seller: '0x1234567890123456789012345678901234567890',
      tokenId: 3,
      price: BigInt('150000000000000000'), // 0.15 MNT
      description: 'Rare Shield Bearer, great defensive card.',
      createdAt: Date.now() - 86400000 * 3,
      isActive: true,
    },
    {
      listingId: 4,
      seller: '0x3456789012345678901234567890123456789012',
      tokenId: 4,
      price: BigInt('350000000000000000'), // 0.35 MNT
      description: 'Epic Shadow Assassin, deadly assassin build.',
      createdAt: Date.now() - 86400000 * 4,
      isActive: true,
    },
    {
      listingId: 5,
      seller: '0x2345678901234567890123456789012345678901',
      tokenId: 5,
      price: BigInt('120000000000000000'), // 0.12 MNT
      description: 'Rare Forest Guardian, excellent support.',
      createdAt: Date.now() - 86400000 * 5,
      isActive: true,
    },
    {
      listingId: 6,
      seller: '0x4567890123456789012345678901234567890123',
      tokenId: 6,
      price: BigInt('25000000000000000'), // 0.025 MNT
      description: '',
      createdAt: Date.now() - 86400000 * 6,
      isActive: true,
    },
    {
      listingId: 7,
      seller: '0x5678901234567890123456789012345678901234',
      tokenId: 7,
      price: BigInt('800000000000000000'), // 0.8 MNT
      description: 'Legendary Phoenix Riser, ultimate revive card!',
      createdAt: Date.now() - 86400000 * 7,
      isActive: true,
    },
    {
      listingId: 8,
      seller: '0x3456789012345678901234567890123456789012',
      tokenId: 8,
      price: BigInt('20000000000000000'), // 0.02 MNT
      description: 'Common but reliable Stone Golem.',
      createdAt: Date.now() - 86400000 * 8,
      isActive: true,
    },
  ]
}

// Mock user cards (subset of mockCards that user owns)
const mockUserCards: Card[] = mockCards.slice(0, 4)

type TabType = 'buy' | 'sell' | 'my-listings'

export default function Market() {
  const [activeTab, setActiveTab] = useState<TabType>('buy')
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [purchaseListing, setPurchaseListing] = useState<Listing | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const { address, isConnected } = useWallet()
  const { balance } = useBalance()

  // Create a map of tokenId to card for quick lookup
  const cardsMap = useMemo(() => {
    const map = new Map<number, Card>()
    mockCards.forEach(card => {
      map.set(Number(card.tokenId), card)
    })
    return map
  }, [])

  // Load listings on mount
  useEffect(() => {
    const loadListings = async () => {
      setIsLoading(true)
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setListings(generateMockListings())
      setIsLoading(false)
    }
    loadListings()
  }, [])

  const handleBuyListing = (listingId: number) => {
    const listing = listings.find(l => l.listingId === listingId)
    if (listing) {
      setPurchaseListing(listing)
    }
  }

  const handleConfirmPurchase = async () => {
    if (!purchaseListing) return
    
    setIsProcessing(true)
    
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Remove listing from active listings
    setListings(prev => prev.filter(l => l.listingId !== purchaseListing.listingId))
    setPurchaseListing(null)
    setIsProcessing(false)
  }

  const handleCreateListing = async (params: {
    tokenId: number
    price: bigint
    description: string
  }) => {
    setIsProcessing(true)
    
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Add new listing
    const newListing: Listing = {
      listingId: listings.length + 1,
      seller: address || '0x0000000000000000000000000000000000000000',
      tokenId: params.tokenId,
      price: params.price,
      description: params.description,
      createdAt: Date.now(),
      isActive: true,
    }
    
    setListings(prev => [...prev, newListing])
    setIsProcessing(false)
  }

  const selectedCard = purchaseListing ? cardsMap.get(purchaseListing.tokenId) : undefined
  const userBalance = balance?.raw || BigInt(0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gold mb-2">Card Market</h1>
            <p className="text-gray-400">
              Buy, sell, and trade cards with other players.
            </p>
          </div>
          
          {/* Balance Display */}
          {isConnected && balance && (
            <div className="bg-black/30 rounded-xl px-4 py-2 border border-white/10">
              <p className="text-gray-400 text-sm">Your Balance</p>
              <p className="text-2xl font-bold text-gold">
                {balance.formatted} {balance.symbol}
              </p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-white/10">
          {[
            { id: 'buy' as TabType, label: 'Buy Cards', icon: '🛒' },
            { id: 'sell' as TabType, label: 'Sell Card', icon: '💰' },
            { id: 'my-listings' as TabType, label: 'My Listings', icon: '📋' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium transition-all relative ${
                activeTab === tab.id
                  ? 'text-gold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[500px]">
          {/* Buy Tab */}
          {activeTab === 'buy' && (
            <MarketplaceGrid
              listings={listings}
              cards={cardsMap}
              isLoading={isLoading}
              onBuyListing={handleBuyListing}
              onListingClick={(listing) => setSelectedListing(listing)}
              currentUserAddress={address || undefined}
            />
          )}

          {/* Sell Tab */}
          {activeTab === 'sell' && (
            <div className="max-w-2xl mx-auto">
              {isConnected ? (
                <SellCard
                  userCards={mockUserCards}
                  onCreateListing={handleCreateListing}
                  isLoading={isProcessing}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="text-6xl mb-4 opacity-50">🔗</div>
                  <h3 className="text-xl font-bold text-white mb-2">Wallet Not Connected</h3>
                  <p className="text-gray-400 mb-6">
                    Please connect your wallet to sell cards on the marketplace.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* My Listings Tab */}
          {activeTab === 'my-listings' && (
            <div>
              {isConnected ? (
                <UserListings
                  listings={listings.filter(l => l.seller.toLowerCase() === address?.toLowerCase())}
                  cardsMap={cardsMap}
                  onCancelListing={(id) => {
                    setListings(prev => prev.filter(l => l.listingId !== id))
                  }}
                  onUpdatePrice={(id, newPrice) => {
                    setListings(prev => prev.map(l => 
                      l.listingId === id ? { ...l, price: newPrice } : l
                    ))
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="text-6xl mb-4 opacity-50">🔗</div>
                  <h3 className="text-xl font-bold text-white mb-2">Wallet Not Connected</h3>
                  <p className="text-gray-400">
                    Please connect your wallet to view your listings.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Purchase Flow Modal */}
      {purchaseListing && (
        <PurchaseFlow
          listing={purchaseListing}
          card={selectedCard}
          userBalance={userBalance}
          onConfirmPurchase={handleConfirmPurchase}
          onCancel={() => setPurchaseListing(null)}
        />
      )}
    </div>
  )
}

// User Listings Component
interface UserListingsProps {
  listings: Listing[]
  cardsMap: Map<number, Card>
  onCancelListing: (id: number) => void
  onUpdatePrice: (id: number, newPrice: bigint) => void
}

function UserListings({ listings, cardsMap, onCancelListing, onUpdatePrice }: UserListingsProps) {
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
              {/* Card Preview */}
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

              {/* Listing Info */}
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

              {/* Price */}
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
                      {(Number(listing.price) / 1e18).toFixed(4)} MNT
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

              {/* Cancel Button */}
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

function getRarityGradient(rarity?: CardRarity): string {
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

function getCardEmoji(type?: CardType): string {
  if (!type) return '🎴'
  const emojis: Record<CardType, string> = {
    Attack: '⚔️',
    Defense: '🛡️',
    Support: '✨',
    Special: '🌟',
  }
  return emojis[type]
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
