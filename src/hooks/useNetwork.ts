'use client'

import { useSwitchChain, useChainId, useAccount } from 'wagmi'
import { useState, useEffect } from 'react'
import { mantleMainnet, mantleSepolia, chainConfigs } from '@/lib/wagmi-config'

export interface NetworkInfo {
  chainId: number
  name: string
  symbol: string
  isTestnet: boolean
  explorerUrl: string
  isSupported: boolean
}

export function useNetwork() {
  const [mounted, setMounted] = useState(false)
  const chainId = useChainId()
  const { chain } = useAccount()
  const { switchChain, isPending: isSwitching, error: switchError } = useSwitchChain()

  useEffect(() => {
    setMounted(true)
  }, [])

  const getNetworkInfo = (): NetworkInfo | null => {
    if (!mounted) return null
    
    // Try to get from chainId
    const id = chain?.id || chainId
    
    if (!id) {
      return null
    }

    const config = chainConfigs[id as keyof typeof chainConfigs]
    if (config) {
      return {
        chainId: id,
        name: config.name,
        symbol: config.symbol,
        isTestnet: config.isTestnet,
        explorerUrl: config.explorerUrl,
        isSupported: true,
      }
    }

    // Unknown chain
    return {
      chainId: id,
      name: `Chain ${id}`,
      symbol: 'Unknown',
      isTestnet: false,
      explorerUrl: '',
      isSupported: false,
    }
  }

  const switchToNetwork = async (targetChainId: number) => {
    try {
      switchChain({ chainId: targetChainId as typeof mantleMainnet.id | typeof mantleSepolia.id })
    } catch (error) {
      console.error('Failed to switch network:', error)
      throw error
    }
  }

  const switchToMainnet = () => switchToNetwork(mantleMainnet.id)
  const switchToSepolia = () => switchToNetwork(mantleSepolia.id)

  const networkInfo = getNetworkInfo()

  return {
    chain: mounted ? chain : null,
    chainId: mounted ? (chain?.id || chainId) : null,
    networkInfo,
    isSwitching,
    switchError,
    switchToNetwork,
    switchToMainnet,
    switchToSepolia,
    supportedNetworks: [mantleMainnet, mantleSepolia],
  }
}
