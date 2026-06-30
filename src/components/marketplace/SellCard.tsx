'use client'

import { useState } from 'react'
import type { Card } from '@/types'
import { CardRarity } from '@/types'
import { cn, formatEther } from '@/lib/utils'
import { FEE_CONSTANTS } from '@/contracts'

interface SellCardProps {
  userCards: Card[]
  onCreateListing: (params: {
    tokenId: number
    price: bigint
    description: string
  }) => Promise<void>
  isLoading?: boolean
}

const rarityGradients: Record<CardRarity, string> = {
  common: 'from-gray-600 to-gray-800',
  rare: 'from-blue-600 to-blue-900',
  epic: 'from-purple-600 to-purple-900',
  legendary: 'from-yellow-500 via-orange-500 to-red-600',
}

export function SellCard({ userCards, onCreateListing, isLoading }: SellCardProps) {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [step, setStep] = useState<'select' | 'price' | 'preview'>('select')

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setPrice(value)
    }
  }

  const handleNext = () => {
    if (step === 'select' && selectedCard) {
      setStep('price')
    } else if (step === 'price' && price) {
      setStep('preview')
      setShowPreview(true)
    }
  }

  const handleBack = () => {
    if (step === 'price') {
      setStep('select')
    } else if (step === 'preview') {
      setStep('price')
      setShowPreview(false)
    }
  }

  const handleConfirm = async () => {
    if (!selectedCard || !price) return
    
    try {
      const priceInWei = BigInt(Math.floor(parseFloat(price) * 1e18))
      await onCreateListing({
        tokenId: Number(selectedCard.id),
        price: priceInWei,
        description,
      })
      // Reset after successful listing
      setSelectedCard(null)
      setPrice('')
      setDescription('')
      setStep('select')
      setShowPreview(false)
    } catch (error) {
      console.error('Failed to create listing:', error)
    }
  }

  const priceInWei = price ? BigInt(Math.floor(parseFloat(price) * 1e18)) : BigInt(0)
  const marketplaceFee = (priceInWei * BigInt(FEE_CONSTANTS.MARKETPLACE_FEE_PERCENT)) / BigInt(FEE_CONSTANTS.FEE_DENOMINATOR)
  const creatorRoyalty = (priceInWei * BigInt(FEE_CONSTANTS.CREATOR_ROYALTY_PERCENT)) / BigInt(FEE_CONSTANTS.FEE_DENOMINATOR)
  const sellerReceives = priceInWei - marketplaceFee - creatorRoyalty

  if (userCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4 opacity-50">🎴</div>
        <h3 className="text-xl font-bold text-white mb-2">No Cards to Sell</h3>
        <p className="text-gray-400">You don&apos;t have any cards in your collection yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4">
        {['select', 'price', 'preview'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
              step === s ? "bg-gold text-black" :
              (step === 'price' && s === 'select') || (step === 'preview' && ['select', 'price'].includes(s))
                ? "bg-gold/50 text-black"
                : "bg-gray-700 text-gray-300"
            )}>
              {i + 1}
            </div>
            {i < 2 && (
              <div className={cn(
                "w-12 h-0.5",
                i === 0 && step !== 'select' ? "bg-gold" : "bg-gray-700"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Select Card */}
      {step === 'select' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Select a Card to Sell</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto pr-2">
            {userCards.map((card) => (
              <button
                key={card.id}
                onClick={() => setSelectedCard(card)}
                className={cn(
                  "relative w-full aspect-[3/4] rounded-xl overflow-hidden transition-all",
                  "hover:scale-105 hover:z-10",
                  selectedCard?.id === card.id && "ring-4 ring-gold scale-105"
                )}
              >
                <div className={cn(
                  "absolute inset-0 rounded-xl overflow-hidden",
                  "bg-gradient-to-br",
                  rarityGradients[card.rarity as CardRarity]
                )}>
                  <div className="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/60 to-transparent">
                    <h4 className="text-white text-xs font-bold truncate">{card.name}</h4>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl">
                      {getCardEmoji(card)}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex justify-between text-[10px] text-white/80">
                      <span>⚔️ {card.attack}</span>
                      <span>🛡️ {card.defense}</span>
                    </div>
                  </div>
                </div>
                {selectedCard?.id === card.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-gold rounded-full flex items-center justify-center">
                    <span className="text-black text-sm">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              disabled={!selectedCard}
              className={cn(
                "px-6 py-2 rounded-lg font-bold transition-all",
                selectedCard
                  ? "bg-gold hover:bg-gold-light text-black"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              )}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Set Price */}
      {step === 'price' && selectedCard && (
        <div className="space-y-6">
          {/* Selected Card Preview */}
          <div className="flex gap-6 items-start">
            <div className={cn(
              "w-32 h-44 rounded-xl overflow-hidden shrink-0",
              "bg-gradient-to-br",
              rarityGradients[selectedCard.rarity as CardRarity]
            )}>
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-5xl">{getCardEmoji(selectedCard)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">{selectedCard.name}</h3>
              <p className="text-gray-400 text-sm">{selectedCard.rarity} &bull; #{selectedCard.id.toString()}</p>
              <div className="flex gap-4 text-sm">
                <span className="text-red-400">⚔️ {selectedCard.attack}</span>
                <span className="text-blue-400">🛡️ {selectedCard.defense}</span>
              </div>
              {selectedCard.specialAbility && (
                <p className="text-gray-400 text-xs italic">{selectedCard.specialAbility}</p>
              )}
            </div>
          </div>

          {/* Price Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Set Your Price (MNT)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={price}
                  onChange={handlePriceChange}
                  placeholder="0.00"
                  className="w-full bg-gray-800/80 text-white text-2xl px-4 py-3 rounded-lg 
                             border border-white/10 focus:border-gold transition-colors text-center"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">MNT</span>
              </div>
            </div>

            {/* Price Breakdown Preview */}
            {price && (
              <div className="bg-gray-800/50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Listing Price</span>
                  <span>{price} MNT</span>
                </div>
                <div className="flex justify-between text-red-400">
                  <span>Marketplace Fee (2.5%)</span>
                  <span>-{formatEther(marketplaceFee)} MNT</span>
                </div>
                <div className="flex justify-between text-purple-400">
                  <span>Creator Royalty (5%)</span>
                  <span>-{formatEther(creatorRoyalty)} MNT</span>
                </div>
                <div className="border-t border-gray-700 pt-2 flex justify-between text-white font-bold">
                  <span>You Receive</span>
                  <span className="text-green-400">{formatEther(sellerReceives)} MNT</span>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description for your listing..."
                maxLength={200}
                className="w-full bg-gray-800/80 text-white px-4 py-3 rounded-lg 
                           border border-white/10 focus:border-gold transition-colors resize-none h-24"
              />
              <p className="text-gray-500 text-xs mt-1">{description.length}/200</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              className="px-6 py-2 rounded-lg font-bold bg-gray-700 hover:bg-gray-600 text-white transition-all"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!price || parseFloat(price) <= 0}
              className={cn(
                "px-6 py-2 rounded-lg font-bold transition-all",
                price && parseFloat(price) > 0
                  ? "bg-gold hover:bg-gold-light text-black"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              )}
            >
              Preview
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Preview & Confirm */}
      {step === 'preview' && selectedCard && showPreview && (
        <div className="space-y-6">
          {/* Listing Preview */}
          <div className="bg-gray-800/50 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Listing Preview</h3>
            
            <div className="flex gap-6 items-start">
              <div className={cn(
                "w-40 h-56 rounded-xl overflow-hidden shrink-0",
                "bg-gradient-to-br",
                rarityGradients[selectedCard.rarity as CardRarity]
              )}>
                <div className="w-full h-full flex flex-col items-center justify-center p-4">
                  <span className="text-6xl mb-2">{getCardEmoji(selectedCard)}</span>
                  <h4 className="text-white text-sm font-bold text-center">{selectedCard.name}</h4>
                  <span className="text-white/70 text-xs mt-1">{selectedCard.rarity}</span>
                </div>
              </div>
              
              <div className="space-y-3 flex-1">
                <div>
                  <p className="text-gray-400 text-sm">Price</p>
                  <p className="text-3xl font-bold text-gold">{price} MNT</p>
                </div>
                
                {description && (
                  <div>
                    <p className="text-gray-400 text-sm">Description</p>
                    <p className="text-white">{description}</p>
                  </div>
                )}

                <div className="border-t border-gray-700 pt-3 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Listing Fee</span>
                    <span>{formatEther(FEE_CONSTANTS.LISTING_FEE)} MNT</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Marketplace Fee</span>
                    <span>{formatEther(marketplaceFee)} MNT</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Creator Royalty</span>
                    <span>{formatEther(creatorRoyalty)} MNT</span>
                  </div>
                  <div className="flex justify-between text-green-400 font-bold">
                    <span>You Receive</span>
                    <span>{formatEther(sellerReceives)} MNT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-200 text-sm">
              ⚠️ By confirming, you will list your card for sale. The listing fee of {formatEther(FEE_CONSTANTS.LISTING_FEE)} MNT 
              will be deducted. Your card will be transferred to the buyer upon purchase.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              disabled={isLoading}
              className="px-6 py-2 rounded-lg font-bold bg-gray-700 hover:bg-gray-600 text-white transition-all disabled:opacity-50"
            >
              Back
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className={cn(
                "px-8 py-2 rounded-lg font-bold transition-all",
                isLoading
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gold hover:bg-gold-light text-black"
              )}
            >
              {isLoading ? 'Creating...' : 'Confirm Listing'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function getCardEmoji(card: Card): string {
  // Derive display type from card stats
  if (card.attack >= 70 && card.defense < 50) return '⚔️'
  if (card.defense >= 70 && card.attack < 50) return '🛡️'
  if (card.specialAbility && card.attack >= 50) return '🌟'
  return '🎴'
}
