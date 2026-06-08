'use client'

import { useState, useEffect } from 'react'
import { useAccount, useBalance, useChainId } from 'wagmi'
import { motion } from 'framer-motion'
import { WalletModal } from './WalletModal'
import { chainConfigs } from '@/lib/wagmi-config'

export function WalletButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const { address, isConnected, isConnecting } = useAccount()
  const chainId = useChainId()
  const { data: balance } = useBalance({
    address: address,
    query: {
      enabled: isConnected && !!address,
    },
  })

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get network info
  const getNetworkInfo = () => {
    if (!chainId) return null
    const config = chainConfigs[chainId as keyof typeof chainConfigs]
    if (!config) return { name: `Chain ${chainId}`, isTestnet: false }
    return config
  }

  const networkInfo = getNetworkInfo()

  // Truncate address
  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // Format balance
  const formatBalance = (balance: bigint, decimals: number = 4) => {
    const num = Number(balance) / Math.pow(10, 18)
    if (num < 0.0001) return '< 0.0001'
    return num.toFixed(decimals)
  }

  // Loading state
  if (!mounted) {
    return (
      <div className="h-10 w-32 bg-purple-dark/30 rounded-lg animate-pulse" />
    )
  }

  return (
    <>
      <motion.button
        onClick={() => setIsModalOpen(true)}
        disabled={isConnecting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          relative px-4 py-2 rounded-lg font-medium transition-all
          ${isConnected 
            ? 'bg-purple-dark/50 hover:bg-purple-dark/70 border border-purple/50 text-white' 
            : 'bg-gradient-to-r from-purple to-blue-dark hover:from-purple-dark hover:to-blue-dark text-white border border-purple/30'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {isConnecting ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Connecting...</span>
          </div>
        ) : isConnected && address ? (
          <div className="flex items-center gap-3">
            {/* Network indicator */}
            {networkInfo && (
              <div className={`
                flex items-center gap-1 px-2 py-0.5 rounded-full text-xs
                ${networkInfo.isTestnet ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}
              `}>
                <span className="w-2 h-2 rounded-full bg-current" />
                {networkInfo.isTestnet ? 'Testnet' : 'Mainnet'}
              </div>
            )}
            
            {/* Address */}
            <span className="font-mono text-sm">{truncateAddress(address)}</span>
            
            {/* Balance */}
            {balance && (
              <div className="flex items-center gap-1 text-sm opacity-80">
                <span>{formatBalance(balance.value)}</span>
                <span>{balance.symbol}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>💼</span>
            <span>Connect Wallet</span>
          </div>
        )}

        {/* Connection status indicator */}
        {isConnected && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-card-bg" />
        )}
      </motion.button>

      <WalletModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}
