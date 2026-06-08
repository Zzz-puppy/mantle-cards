'use client'

import { useState, useCallback } from 'react'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { writeContract, waitForTransactionReceipt } from 'wagmi/actions'
import type { Hash } from 'viem'
import { MANTLE_CARDS_ABI, getContractAddress, isContractDeployed } from '@/lib/contracts'
import { submitMockMintTransaction, isMockMode, getDefaultMockPortfolio } from '@/lib/mock-data'
import { generateCardImageURL } from '@/lib/card-generator'
import type { Card, CardMintParams } from '@/types/card'
import type { CardRarity } from '@/types/card'

interface MintCardParams {
  to: `0x${string}`
  name: string
  rarity: CardRarity
  attack: number
  defense: number
  specialAbility: string
  imageURI: string
  baseToken: string
  tokenBalance: bigint
  transactionCount: number
}

interface MintResult {
  hash: Hash
  card: Card
}

interface UseMintCardReturn {
  mintCard: (params: MintCardParams) => Promise<MintResult>
  isPending: boolean
  isConfirming: boolean
  error: Error | null
  reset: () => void
}

export function useMintCard(): UseMintCardReturn {
  const { address } = useAccount()
  const chainId = useChainId()
  const config = useConfig()
  
  const [isPending, setIsPending] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const reset = useCallback(() => {
    setIsPending(false)
    setIsConfirming(false)
    setError(null)
  }, [])

  const mintCard = useCallback(async (params: MintCardParams): Promise<MintResult> => {
    setError(null)
    
    // Use mock mode if enabled or if contract not deployed
    if (isMockMode() || !isContractDeployed(chainId)) {
      setIsPending(true)
      try {
        const portfolio = getDefaultMockPortfolio()
        portfolio.address = params.to
        const result = await submitMockMintTransaction(portfolio)
        
        const card: Card = {
          id: BigInt(Date.now()),
          name: params.name,
          rarity: params.rarity,
          attack: params.attack,
          defense: params.defense,
          specialAbility: params.specialAbility,
          image: generateCardImageURL(Number(Date.now()), params.rarity),
          owner: params.to,
          mintedAt: Date.now(),
          baseToken: params.baseToken,
          tokenBalance: params.tokenBalance,
          transactionCount: params.transactionCount,
        }
        
        return { hash: result.hash as Hash, card }
      } finally {
        setIsPending(false)
      }
    }

    // Real contract interaction
    setIsPending(true)
    setIsConfirming(false)
    
    try {
      const contractAddress = getContractAddress(chainId)
      
      // Rarity must be uint8
      const rarityValue: Record<CardRarity, number> = {
        common: 0,
        rare: 1,
        epic: 2,
        legendary: 3,
      }

      // Write contract transaction
      const hash = await writeContract(config, {
        address: contractAddress,
        abi: MANTLE_CARDS_ABI,
        functionName: 'mintCard',
        args: [
          params.to,
          params.name,
          rarityValue[params.rarity],
          BigInt(params.attack),
          BigInt(params.defense),
          params.specialAbility,
          params.imageURI,
          params.baseToken,
          params.tokenBalance,
          BigInt(params.transactionCount),
        ],
      })

      setIsPending(false)
      setIsConfirming(true)

      // Wait for transaction receipt
      const receipt = await waitForTransactionReceipt(config, {
        hash,
        confirmations: 1,
      })

      setIsConfirming(false)

      // Check if transaction was successful
      if (receipt.status === 'reverted') {
        throw new Error('Transaction was reverted')
      }

      // Parse token ID from logs (simplified - actual implementation would parse events)
      const tokenId = receipt.logs.length > 0 
        ? BigInt(receipt.logs[0].topics[3] || '0')
        : BigInt(Date.now())

      // Create card object
      const card: Card = {
        id: tokenId,
        name: params.name,
        rarity: params.rarity,
        attack: params.attack,
        defense: params.defense,
        specialAbility: params.specialAbility,
        image: params.imageURI,
        owner: params.to,
        mintedAt: Date.now(),
        baseToken: params.baseToken,
        tokenBalance: params.tokenBalance,
        transactionCount: params.transactionCount,
      }

      return { hash, card }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Minting failed')
      setError(error)
      setIsPending(false)
      setIsConfirming(false)
      throw error
    }
  }, [chainId, config])

  return {
    mintCard,
    isPending,
    isConfirming,
    error,
    reset,
  }
}

export default useMintCard
