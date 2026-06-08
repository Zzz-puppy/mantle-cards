'use client'

import { useBalance as useWagmiBalance, useToken } from 'wagmi'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

export interface BalanceInfo {
  formatted: string
  raw: bigint
  symbol: string
  decimals: number
}

export function useBalance(options?: { tokenAddress?: `0x${string}`; watch?: boolean }) {
  const [mounted, setMounted] = useState(false)
  const { address, isConnected } = useAccount()
  const { tokenAddress, watch = true } = options || {}

  useEffect(() => {
    setMounted(true)
  }, [])

  const { data: nativeBalance, isLoading: isNativeLoading, refetch: refetchNative } = useWagmiBalance({
    address,
    query: {
      enabled: mounted && isConnected && !!address && !tokenAddress,
    },
  })

  const { data: tokenBalance, isLoading: isTokenLoading, refetch: refetchToken } = useToken({
    address: tokenAddress,
    query: {
      enabled: mounted && !!tokenAddress,
    },
  })

  const getBalance = (): BalanceInfo | null => {
    if (!mounted || !isConnected) return null

    if (tokenAddress && tokenBalance) {
      // For ERC20 tokens, we would need a separate approach
      // This is a simplified version
      return {
        formatted: 'Token Balance',
        raw: BigInt(0),
        symbol: tokenBalance.symbol || 'TOKEN',
        decimals: tokenBalance.decimals || 18,
      }
    }

    if (nativeBalance) {
      return {
        formatted: nativeBalance.formatted,
        raw: nativeBalance.value,
        symbol: nativeBalance.symbol,
        decimals: nativeBalance.decimals,
      }
    }

    return null
  }

  const formatBalance = (balance: bigint, decimals: number = 18, displayDecimals: number = 4): string => {
    const num = Number(balance) / Math.pow(10, decimals)
    if (num === 0) return '0'
    if (num < 0.0001) return '< 0.0001'
    return num.toFixed(displayDecimals)
  }

  const getExplorerUrl = (): string => {
    if (!address) return ''
    // Return a link to the address on Mantle explorer
    return `https://explorer.mantle.xyz/address/${address}`
  }

  return {
    balance: getBalance(),
    isLoading: isNativeLoading || isTokenLoading,
    refetch: tokenAddress ? refetchToken : refetchNative,
    formatBalance,
    explorerUrl: getExplorerUrl(),
    isConnected: mounted ? isConnected : false,
  }
}
