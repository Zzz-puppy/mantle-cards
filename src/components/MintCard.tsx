'use client'

import { useState, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { motion, AnimatePresence } from 'framer-motion'
import { useMintCard } from '@/hooks/useMintCard'
import { useWallet } from '@/hooks/useWallet'
import type { Card } from '@/types/card'
import type { WalletPortfolio } from '@/lib/mantle-data'
import type { GeneratedCardAttributes } from '@/lib/card-generator'
import { generateCardOptions } from '@/lib/card-generator'

interface MintCardProps {
  portfolio: WalletPortfolio | null
  onMintSuccess?: (card: Card) => void
  onMintError?: (error: Error) => void
}

type MintingStep = 'idle' | 'generating' | 'selecting' | 'confirming' | 'minting' | 'reveal' | 'complete'

export function MintCard({ portfolio, onMintSuccess, onMintError }: MintCardProps) {
  const { isConnected, address } = useAccount()
  const { connect } = useWallet()
  const { mintCard, isPending, error: mintError } = useMintCard()
  
  const [step, setStep] = useState<MintingStep>('idle')
  const [cardOptions, setCardOptions] = useState<GeneratedCardAttributes[]>([])
  const [selectedCard, setSelectedCard] = useState<GeneratedCardAttributes | null>(null)
  const [mintedCard, setMintedCard] = useState<Card | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)

  // Handle wallet connection
  const handleConnect = useCallback(() => {
    connect()
  }, [connect])

  // Start minting process
  const handleStartMint = useCallback(() => {
    if (!portfolio) {
      setLocalError('Please connect your wallet to analyze portfolio')
      return
    }
    
    setLocalError(null)
    setStep('generating')
    
    // Generate card options based on portfolio
    setTimeout(() => {
      const options = generateCardOptions(portfolio, 3)
      setCardOptions(options)
      setStep('selecting')
    }, 1500)
  }, [portfolio])

  // Select a card option
  const handleSelectCard = useCallback((card: GeneratedCardAttributes) => {
    setSelectedCard(card)
    setStep('confirming')
  }, [])

  // Confirm and mint
  const handleConfirmMint = useCallback(async () => {
    if (!selectedCard || !address) return
    
    setStep('minting')
    setLocalError(null)
    
    try {
      const result = await mintCard({
        to: address,
        name: selectedCard.name,
        rarity: selectedCard.rarity,
        attack: selectedCard.attack,
        defense: selectedCard.defense,
        specialAbility: selectedCard.specialAbility,
        imageURI: `https://api.dicebear.com/7.x/shapes/svg?seed=${Date.now()}`,
        baseToken: selectedCard.baseToken,
        tokenBalance: selectedCard.tokenBalance,
        transactionCount: selectedCard.transactionCount,
      })
      
      setTxHash(result.hash)
      setMintedCard(result.card as Card)
      setStep('reveal')
      
      // Animate reveal
      setTimeout(() => {
        setStep('complete')
        onMintSuccess?.(result.card as Card)
      }, 2000)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Minting failed')
      setLocalError(error.message)
      setStep('confirming')
      onMintError?.(error)
    }
  }, [selectedCard, address, mintCard, onMintSuccess, onMintError])

  // Reset minting flow
  const handleReset = useCallback(() => {
    setStep('idle')
    setCardOptions([])
    setSelectedCard(null)
    setMintedCard(null)
    setTxHash(null)
    setLocalError(null)
  }, [])

  // Go back to selection
  const handleBackToSelection = useCallback(() => {
    setSelectedCard(null)
    setStep('selecting')
  }, [])

  // Render based on state
  const renderContent = () => {
    // Not connected
    if (!isConnected) {
      return (
        <div className="flex flex-col items-center gap-4 p-6">
          <div className="text-6xl">🎴</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Connect Wallet to Mint
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Connect your Mantle wallet to analyze your portfolio and mint unique cards
          </p>
          <button
            onClick={handleConnect}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Connect Wallet
          </button>
        </div>
      )
    }

    // Idle - show mint button
    if (step === 'idle') {
      return (
        <div className="flex flex-col items-center gap-4 p-6">
          <div className="text-6xl">✨</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Mint Your NFT Card
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Your wallet portfolio will be analyzed to generate unique card attributes
          </p>
          <button
            onClick={handleStartMint}
            disabled={!portfolio}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Start Minting
          </button>
        </div>
      )
    }

    // Generating options
    if (step === 'generating') {
      return (
        <div className="flex flex-col items-center gap-4 p-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="text-6xl"
          >
            🔮
          </motion.div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Analyzing Portfolio...
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Generating unique card attributes based on your wallet data
          </p>
        </div>
      )
    }

    // Selecting card
    if (step === 'selecting') {
      return (
        <div className="flex flex-col gap-4 p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center">
            Choose Your Card
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
            Select one of the generated cards to mint
          </p>
          <div className="grid gap-4 mt-4">
            {cardOptions.map((card, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSelectCard(card)}
                className={`p-4 rounded-lg border-2 text-left transition-all hover:scale-[1.02] ${
                  card.rarity === 'legendary' 
                    ? 'border-yellow-500 bg-gradient-to-br from-yellow-900/20 to-orange-900/20'
                    : card.rarity === 'epic'
                    ? 'border-purple-500 bg-gradient-to-br from-purple-900/20 to-pink-900/20'
                    : card.rarity === 'rare'
                    ? 'border-blue-500 bg-gradient-to-br from-blue-900/20 to-cyan-900/20'
                    : 'border-gray-500 bg-gray-900/20'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`font-bold ${
                    card.rarity === 'legendary' ? 'text-yellow-400'
                    : card.rarity === 'epic' ? 'text-purple-400'
                    : card.rarity === 'rare' ? 'text-blue-400'
                    : 'text-gray-400'
                  }`}>
                    {card.name}
                  </span>
                  <span className="text-xs uppercase px-2 py-1 rounded bg-black/30">
                    {card.rarity}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>⚔️ Attack: {card.attack}</div>
                  <div>🛡️ Defense: {card.defense}</div>
                </div>
                <p className="text-xs mt-2 text-gray-500 truncate">
                  {card.specialAbility}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      )
    }

    // Confirming
    if (step === 'confirming' && selectedCard) {
      return (
        <div className="flex flex-col gap-4 p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center">
            Confirm Your Card
          </h3>
          <div className={`p-4 rounded-lg border-2 ${
            selectedCard.rarity === 'legendary' ? 'border-yellow-500'
            : selectedCard.rarity === 'epic' ? 'border-purple-500'
            : selectedCard.rarity === 'rare' ? 'border-blue-500'
            : 'border-gray-500'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <span className={`font-bold text-lg ${
                selectedCard.rarity === 'legendary' ? 'text-yellow-400'
                : selectedCard.rarity === 'epic' ? 'text-purple-400'
                : selectedCard.rarity === 'rare' ? 'text-blue-400'
                : 'text-gray-400'
              }`}>
                {selectedCard.name}
              </span>
              <span className="text-xs uppercase px-2 py-1 rounded bg-black/30">
                {selectedCard.rarity}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">{selectedCard.attack}</div>
                <div className="text-xs text-gray-500">Attack</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{selectedCard.defense}</div>
                <div className="text-xs text-gray-500">Defense</div>
              </div>
            </div>
            <p className="text-sm mt-4 text-gray-400">
              {selectedCard.specialAbility}
            </p>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleBackToSelection}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleConfirmMint}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Confirm & Mint
            </button>
          </div>
        </div>
      )
    }

    // Minting
    if (step === 'minting') {
      return (
        <div className="flex flex-col items-center gap-4 p-6">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-6xl"
          >
            ⛏️
          </motion.div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Minting Card...
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Please confirm the transaction in your wallet
          </p>
        </div>
      )
    }

    // Reveal
    if (step === 'reveal' && mintedCard) {
      return (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="flex flex-col items-center gap-4 p-6"
        >
          <div className="text-8xl mb-2">🎉</div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Card Revealed!
          </h3>
          <div className={`w-full p-4 rounded-lg border-2 ${
            mintedCard.rarity === 'legendary' ? 'border-yellow-500'
            : mintedCard.rarity === 'epic' ? 'border-purple-500'
            : mintedCard.rarity === 'rare' ? 'border-blue-500'
            : 'border-gray-500'
          }`}>
            <img
              src={mintedCard.image}
              alt={mintedCard.name}
              className="w-full h-32 object-contain mb-4"
            />
            <div className="text-center">
              <div className={`font-bold text-lg ${
                mintedCard.rarity === 'legendary' ? 'text-yellow-400'
                : mintedCard.rarity === 'epic' ? 'text-purple-400'
                : mintedCard.rarity === 'rare' ? 'text-blue-400'
                : 'text-gray-400'
              }`}>
                {mintedCard.name}
              </div>
              <div className="text-xs uppercase text-gray-500 mt-1">
                {mintedCard.rarity}
              </div>
            </div>
          </div>
        </motion.div>
      )
    }

    // Complete
    if (step === 'complete') {
      return (
        <div className="flex flex-col items-center gap-4 p-6">
          {mintedCard && (
            <>
              <div className="text-6xl">
                {mintedCard.rarity === 'legendary' ? '🏆' 
                 : mintedCard.rarity === 'epic' ? '💎'
                 : mintedCard.rarity === 'rare' ? '⭐'
                 : '🎴'}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Successfully Minted!
              </h3>
              {txHash && (
                <a
                  href={`https://explorer.mantle.xyz/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline break-all"
                >
                  View Transaction: {txHash.slice(0, 10)}...
                </a>
              )}
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Mint Another Card
              </button>
            </>
          )}
        </div>
      )
    }

    return null
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
        
        {/* Error display */}
        <AnimatePresence>
          {(localError || mintError) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-6 mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg"
            >
              <p className="text-red-400 text-sm text-center">
                {localError || mintError?.message}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default MintCard
