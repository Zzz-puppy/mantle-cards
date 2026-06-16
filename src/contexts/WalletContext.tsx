'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { MOCK_PORTFOLIOS } from '@/lib/mock-data'

export interface WalletState {
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

const INITIAL_STATE: WalletState = {
  address: null,
  isConnected: false,
  isConnecting: false,
  chainId: 5003,
  balance: BigInt(0),
  portfolio: null,
}

interface WalletContextType {
  state: WalletState
  connect: () => Promise<void>
  disconnect: () => void
  switchChain: (chainId: number) => void
}

const WalletContext = createContext<WalletContextType | null>(null)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>(() => {
    try {
      const stored = localStorage.getItem('mantle-wallet-state')
      if (stored) {
        const parsed = JSON.parse(stored)
        return {
          ...parsed,
          isConnecting: false,
          balance: BigInt(parsed.balance),
          portfolio: parsed.portfolio ? {
            ...parsed.portfolio,
            mntBalance: BigInt(parsed.portfolio.mntBalance),
            totalGasSpent: BigInt(parsed.portfolio.totalGasSpent),
            erc20Tokens: parsed.portfolio.erc20Tokens.map((token: any) => ({
              ...token,
              balance: BigInt(token.balance),
            })),
          } : null,
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_STATE
  })

  useEffect(() => {
    localStorage.setItem('mantle-wallet-state', JSON.stringify({
      ...state,
      balance: state.balance.toString(),
      portfolio: state.portfolio ? {
        ...state.portfolio,
        mntBalance: state.portfolio.mntBalance.toString(),
        totalGasSpent: state.portfolio.totalGasSpent.toString(),
        erc20Tokens: state.portfolio.erc20Tokens.map(token => ({
          ...token,
          balance: token.balance.toString(),
        })),
      } : null,
    }))
  }, [state])

  const connect = useCallback(async () => {
    if (state.isConnecting) return
    
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
  }, [state.isConnecting])

  const disconnect = useCallback(() => {
    setState(INITIAL_STATE)
    localStorage.removeItem('mantle-wallet-state')
  }, [])

  const switchChain = useCallback((chainId: number) => {
    setState(prev => ({ ...prev, chainId }))
  }, [])

  return (
    <WalletContext.Provider value={{ state, connect, disconnect, switchChain }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
