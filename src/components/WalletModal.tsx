'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const [error, setError] = useState<string>('')

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
                    Mock Wallet Connected
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-white/70 hover:text-white transition-colors text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>
                <p className="text-white/80 text-sm mt-1">
                  Using mock data for testing
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="p-4 bg-purple-dark/30 rounded-lg border border-purple/30">
                    <p className="text-gray-400 text-sm mb-2">Connected Address</p>
                    <p className="text-white font-mono text-sm break-all">
                      0x1234...7890
                    </p>
                  </div>
                  <div className="p-4 bg-purple-dark/30 rounded-lg border border-purple/30">
                    <p className="text-gray-400 text-sm mb-2">Network</p>
                    <p className="text-white font-mono text-sm">
                      Mantle Sepolia Testnet
                    </p>
                  </div>
                  <p className="text-gray-500 text-sm text-center">
                    This is a mock wallet for demonstration purposes.
                    Your data is stored locally.
                  </p>
                </div>
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
