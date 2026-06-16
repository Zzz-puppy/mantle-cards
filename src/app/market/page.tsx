'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@/contexts/WalletContext'
import { useMarketData } from '@/hooks/useMarketData'
import { MarketplaceGrid, SellCard, PurchaseFlow, UserListings, Listing, ListingDetail } from '@/components/marketplace'
import { formatEther } from '@/lib/utils'

type TabType = 'buy' | 'sell' | 'my-listings'

export default function Market() {
  const [activeTab, setActiveTab] = useState<TabType>('buy')
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [purchaseListing, setPurchaseListing] = useState<Listing | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const { state } = useWallet()
  const { listings, cardsMap, userCards, isLoading, removeListing, addListing, updateListingPrice } = useMarketData()
  
  const { address, isConnected, balance } = state

  const handleBuyListing = (listingId: number) => {
    const listing = listings.find(l => l.listingId === listingId)
    if (listing) {
      setPurchaseListing(listing)
    }
  }

  const handleConfirmPurchase = async () => {
    if (!purchaseListing) return
    
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    removeListing(purchaseListing.listingId)
    setPurchaseListing(null)
    setIsProcessing(false)
  }

  const handleCreateListing = async (params: {
    tokenId: number
    price: bigint
    description: string
  }) => {
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    addListing(params)
    setIsProcessing(false)
  }

  const selectedCard = purchaseListing ? cardsMap.get(purchaseListing.tokenId) : undefined
  const userBalance = balance

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#12111a] via-[#1a1530]/30 to-[#12111a]">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-[#C9A227] mb-2">Card Market</h1>
            <p className="text-gray-400">
              Buy, sell, and trade cards with other players.
            </p>
          </div>

          {mounted && isConnected && balance > BigInt(0) && (
            <div className="bg-[#1a1625]/60 rounded-xl px-4 py-2 border border-white/10">
              <p className="text-gray-400 text-sm">Your Balance</p>
              <p className="text-2xl font-bold text-[#C9A227]">
                {formatEther(balance)} MNT
              </p>
            </div>
          )}
        </div>

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
                  ? 'text-[#C9A227]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A227]" />
              )}
            </button>
          ))}
        </div>

        <div className="min-h-[500px]">
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

          {activeTab === 'sell' && (
            <div className="max-w-2xl mx-auto">
              {isConnected ? (
                <SellCard
                  userCards={userCards}
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

          {activeTab === 'my-listings' && (
            <div>
              {isConnected ? (
                <UserListings
                  listings={listings.filter(l => l.seller.toLowerCase() === address?.toLowerCase())}
                  cardsMap={cardsMap}
                  onCancelListing={(id) => removeListing(id)}
                  onUpdatePrice={(id, newPrice) => updateListingPrice(id, newPrice)}
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

      {purchaseListing && (
        <PurchaseFlow
          listing={purchaseListing}
          card={selectedCard}
          userBalance={userBalance}
          onConfirmPurchase={handleConfirmPurchase}
          onCancel={() => setPurchaseListing(null)}
        />
      )}

      {selectedListing && (
        <ListingDetail
          listing={selectedListing}
          card={cardsMap.get(selectedListing.tokenId)}
          isOpen={!!selectedListing}
          onClose={() => setSelectedListing(null)}
          onBuy={() => {
            setPurchaseListing(selectedListing)
            setSelectedListing(null)
          }}
        />
      )}
    </div>
  )
}