'use client'

import { useState, useEffect, useCallback } from 'react'
import { MOCK_PORTFOLIOS } from '@/lib/mock-data'

export interface MockWalletState {
  address: `0x${string}` | null
  isConnected: boolean
  isConnecting: boolean
  chainId: number
  balance: bigint
  portfolio: typeof MOCK_PORTFOLIOS[keyof typeof MOCK_PORTFOLIOS] | null
}

const MOCK_ADDRESSES = [
  '0x1234567890123456789012345678901234567890',
  '0x2345678901234567890123456789012345678901',
  '0x3456789012345678901234567890123456789012',
] as const

const INITIAL_STATE: MockWalletState = {
  address: null,
  isConnected: false,
  isConnecting: false,
  chainId: 5003,
  balance: BigInt(0),
  portfolio: null,
}

export function useMockWallet() {
  const [state, setState] = useState<MockWalletState>(INITIAL_STATE)

  const connect = useCallback(async () => {
    setState(prev => ({ ...prev, isConnecting: true }))
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const randomIndex = Math.floor(Math.random() * MOCK_ADDRESSES.length)
    const address = MOCK_ADDRESSES[randomIndex]
    
    const portfolioKeys = Object.keys(MOCK_PORTFOLIOS) as (keyof typeof MOCK_PORTFOLIOS)[]
    const portfolioKey = portfolioKeys[randomIndex % portfolioKeys.length]
    const portfolio = MOCK_PORTFOLIOS[portfolioKey]
    
    setState({
      address,
      isConnected: true,
      isConnecting: false,
      chainId: 5003,
      balance: portfolio.mntBalance,
      portfolio,
    })
  }, [])

  const disconnect = useCallback(() => {
    setState(INITIAL_STATE)
  }, [])

  const switchChain = useCallback((chainId: number) => {
    setState(prev => ({ ...prev, chainId }))
  }, [])

  return {
    ...state,
    connect,
    disconnect,
    switchChain,
  }
}

export function useWalletWithMock() {
  return useMockWallet()
}
