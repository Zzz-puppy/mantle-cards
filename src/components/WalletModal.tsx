'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect, useConnections } from 'wagmi'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'
import { motion, AnimatePresence } from 'framer-motion'

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
}

const walletOptions = [
  {
    id: 'injected',
    name: 'MetaMask',
    icon: '🦊',
    connector: injected,
    description: 'Connect using your browser extension',
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: '🔗',
    connector: walletConnect,
    description: 'Scan QR code with your mobile wallet',
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: '💰',
    connector: coinbaseWallet,
    description: 'Connect using Coinbase Wallet',
  },
]

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const [error, setError] = useState<string>('')
  const [isConnecting, setIsConnecting] = useState<string | null>(null)
  
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { isConnected, address } = useAccount()
  const connections = useConnections()

  // Close modal on successful connection
  useEffect(() => {
    if (isConnected && address) {
      onClose()
      setError('')
      setIsConnecting(null)
    }
  }, [isConnected, address, onClose])

  const handleConnect = async (wallet: typeof walletOptions[0]) => {
    try {
      setError('')
      setIsConnecting(wallet.id)
      
      // Find the corresponding connector
      const connector = connectors.find(c => c.id === wallet.id || c.name === wallet.name)
      
      if (connector) {
        connect({ connector })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet')
      setIsConnecting(null)
    }
  }

  const handleDisconnect = () => {
    const connection = connections[0]
    if (connection) {
      disconnect({ connector: connection.connector })
    }
    setError('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-card-bg rounded-xl shadow-2xl border border-purple/30 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-dark to-blue-dark px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">
                    {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-white/70 hover:text-white transition-colors text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>
                {isConnected && address && (
                  <p className="text-white/80 text-sm mt-1">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </p>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {isConnected ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-dark/30 rounded-lg border border-purple/30">
                      <p className="text-gray-400 text-sm mb-2">Connected Address</p>
                      <p className="text-white font-mono text-sm break-all">
                        {address}
                      </p>
                    </div>
                    <button
                      onClick={handleDisconnect}
                      className="w-full py-3 px-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 font-medium transition-colors"
                    >
                      Disconnect Wallet
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {walletOptions.map((wallet) => (
                      <button
                        key={wallet.id}
                        onClick={() => handleConnect(wallet)}
                        disabled={isConnecting !== null}
                        className="w-full p-4 bg-purple-dark/30 hover:bg-purple-dark/50 border border-purple/30 hover:border-purple/60 rounded-lg transition-all flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="text-3xl">{wallet.icon}</span>
                        <div className="text-left flex-1">
                          <p className="text-white font-medium">{wallet.name}</p>
                          <p className="text-gray-400 text-sm">{wallet.description}</p>
                        </div>
                        {isConnecting === wallet.id && (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-black/20 border-t border-white/10">
                <p className="text-gray-500 text-xs text-center">
                  By connecting, you agree to the Terms of Service
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
