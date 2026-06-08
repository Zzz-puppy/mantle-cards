'use client'

import { useState, useEffect } from 'react'
import type { Card } from '@/types'
import { CardRarity, CardType as CardTypeEnum } from '@/types'
import { cn, formatAddress, formatEther } from '@/lib/utils'
import { FEE_CONSTANTS } from '@/contracts'
import { useBalance } from '@/hooks/useBalance'

interface PurchaseFlowProps {
  listing: {
    listingId: number
    seller: string
    tokenId: number
    price: bigint
    description: string
    createdAt: number
  } | null
  card?: Card
  userBalance: bigint
  onConfirmPurchase: () => Promise<void>
  onCancel: () => void
}

type PurchaseState = 'details' | 'confirm' | 'processing' | 'success' | 'error'

export function PurchaseFlow({
  listing,
  card,
  userBalance,
  onConfirmPurchase,
  onCancel
}: PurchaseFlowProps) {
  const [state, setState] = useState<PurchaseState>('details')
  const [error, setError] = useState<string | null>(null)

  const price = listing?.price || BigInt(0)
  const marketplaceFee = (price * BigInt(FEE_CONSTANTS.MARKETPLACE_FEE_PERCENT)) / BigInt(FEE_CONSTANTS.FEE_DENOMINATOR)
  const creatorRoyalty = (price * BigInt(FEE_CONSTANTS.CREATOR_ROYALTY_PERCENT)) / BigInt(FEE_CONSTANTS.FEE_DENOMINATOR)
  const totalPrice = price + marketplaceFee + creatorRoyalty

  const hasEnoughBalance = userBalance >= totalPrice
  const rarity = card?.rarity || CardRarity.Common

  const handleConfirm = async () => {
    setState('processing')
    setError(null)
    
    try {
      await onConfirmPurchase()
      setState('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed')
      setState('error')
    }
  }

  const handleRetry = () => {
    setError(null)
    setState('details')
  }

  if (!listing) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl border border-white/10 max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              {state === 'details' && 'Card Details'}
              {state === 'confirm' && 'Confirm Purchase'}
              {state === 'processing' && 'Processing...'}
              {state === 'success' && 'Purchase Complete!'}
              {state === 'error' && 'Transaction Failed'}
            </h2>
            <button
              onClick={onCancel}
              disabled={state === 'processing'}
              className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Success State */}
          {state === 'success' && (
            <div className="flex flex-col items-center py-6">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-5xl">✅</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Purchase Successful!</h3>
              <p className="text-gray-400 text-center">
                You now own <span className="text-gold font-semibold">{card?.name || `Card #${listing.tokenId}`}</span>
              </p>
              <button
                onClick={onCancel}
                className="mt-6 px-6 py-2 bg-gold hover:bg-gold-light text-black font-bold rounded-lg transition-all"
              >
                Done
              </button>
            </div>
          )}

          {/* Error State */}
          {state === 'error' && (
            <div className="flex flex-col items-center py-6">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-5xl">❌</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Transaction Failed</h3>
              <p className="text-red-400 text-center text-sm mb-4">{error}</p>
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRetry}
                  className="px-6 py-2 bg-gold hover:bg-gold-light text-black font-bold rounded-lg transition-all"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Processing State */}
          {state === 'processing' && (
            <div className="flex flex-col items-center py-6">
              <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
                <span className="text-5xl">⏳</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Processing Transaction</h3>
              <p className="text-gray-400 text-center">
                Please wait while your transaction is being confirmed on the blockchain...
              </p>
              <div className="mt-4 w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gold animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
          )}

          {/* Details & Confirm States */}
          {(state === 'details' || state === 'confirm') && (
            <>
              {/* Card Preview */}
              <div className={cn(
                "aspect-[3/4] rounded-xl overflow-hidden",
                "bg-gradient-to-br",
                rarity === 'Legendary' && "from-yellow-500 via-orange-500 to-red-600",
                rarity === 'Epic' && "from-purple-600 to-purple-900",
                rarity === 'Rare' && "from-blue-600 to-blue-900",
                rarity === 'Common' && "from-gray-600 to-gray-800"
              )}>
                <div className="w-full h-full p-4 flex flex-col">
                  <div className="flex justify-between items-start">
                    <h3 className="text-white font-bold text-lg drop-shadow-lg">
                      {card?.name || `Card #${listing.tokenId}`}
                    </h3>
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase",
                      rarity === 'Legendary' && "bg-gradient-to-r from-yellow-500 to-orange-500 text-black",
                      rarity === 'Epic' && "bg-purple-500/90 text-white",
                      rarity === 'Rare' && "bg-blue-500/90 text-white",
                      rarity === 'Common' && "bg-gray-500/90 text-white"
                    )}>
                      {rarity}
                    </span>
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-7xl filter drop-shadow-2xl">
                      {getCardEmoji(card?.type || CardTypeEnum.Attack)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <div className="bg-red-500/80 px-3 py-1 rounded-lg text-white font-bold">
                      ⚔️ {card?.attack || 0}
                    </div>
                    <div className="bg-blue-500/80 px-3 py-1 rounded-lg text-white font-bold">
                      🛡️ {card?.defense || 0}
                    </div>
                  </div>
                </div>
              </div>

              {/* Listing Info */}
              <div className="space-y-3">
                {listing.description && (
                  <p className="text-gray-400 text-sm">{listing.description}</p>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Seller</span>
                  <span className="text-white font-mono">{formatAddress(listing.seller)}</span>
                </div>
                
                <div className="border-t border-gray-700 pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Card Price</span>
                    <span className="text-white">{formatEther(price)} MNT</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Marketplace Fee (2.5%)</span>
                    <span>+{formatEther(marketplaceFee)} MNT</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Creator Royalty (5%)</span>
                    <span>+{formatEther(creatorRoyalty)} MNT</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t border-gray-700">
                    <span className="text-white">Total</span>
                    <span className="text-gold">{formatEther(totalPrice)} MNT</span>
                  </div>
                </div>
              </div>

              {/* Balance Warning */}
              {!hasEnoughBalance && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">
                    ⚠️ Insufficient balance. You need {formatEther(totalPrice)} MNT but only have {formatEther(userBalance)} MNT.
                  </p>
                </div>
              )}

              {/* Confirm Prompt */}
              {state === 'confirm' && (
                <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
                  <p className="text-gold text-sm text-center">
                    Are you sure you want to purchase this card for {formatEther(totalPrice)} MNT?
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {(state === 'details' || state === 'confirm') && (
          <div className="p-6 border-t border-white/10 bg-gray-800/50">
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 py-3 rounded-lg font-bold bg-gray-700 hover:bg-gray-600 text-white transition-all"
              >
                Cancel
              </button>
              {state === 'details' ? (
                <button
                  onClick={() => setState('confirm')}
                  disabled={!hasEnoughBalance}
                  className={cn(
                    "flex-1 py-3 rounded-lg font-bold transition-all",
                    hasEnoughBalance
                      ? "bg-gold hover:bg-gold-light text-black"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  )}
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleConfirm}
                  disabled={!hasEnoughBalance}
                  className={cn(
                    "flex-1 py-3 rounded-lg font-bold transition-all",
                    hasEnoughBalance
                      ? "bg-gold hover:bg-gold-light text-black"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  )}
                >
                  Confirm Purchase
                </button>
              )}
            </div>
          </div>
        )}
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
