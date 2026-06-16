'use client'

import { ReferralProgram } from '@/components/share/ReferralProgram'
import { getShareStats } from '@/lib/social-share'
import { useEffect, useState } from 'react'
import { useWallet } from '@/contexts/WalletContext'
import { formatEther } from '@/lib/utils'

export default function Profile() {
  const [stats, setStats] = useState<{ totalShares: number; byPlatform: Record<string, number> } | null>(null)
  
  const { state, connect, disconnect } = useWallet()
  const { address, isConnected, balance } = state

  useEffect(() => {
    setStats(getShareStats())
  }, [])

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gold">Player Profile</h1>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Profile Info */}
        <div className="space-y-8">
          <div className="bg-card-bg border border-card-border rounded-xl p-8">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-purple to-blue rounded-full flex items-center justify-center">
                <span className="text-4xl">👤</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Player One</h2>
                <p className="text-gray-400">{isConnected && address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not Connected'}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-card-border rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-gold">42</p>
                <p className="text-gray-400">Cards</p>
              </div>
              <div className="bg-card-border rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-purple">15</p>
                <p className="text-gray-400">Wins</p>
              </div>
              <div className="bg-card-border rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue">8</p>
                <p className="text-gray-400">Losses</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Wallet</h3>
              {isConnected ? (
                <div className="space-y-4">
                  <div className="bg-black/30 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Connected Address</p>
                    <p className="font-mono text-white">{address}</p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Balance</p>
                    <p className="text-xl font-bold text-gold">{formatEther(balance)} MNT</p>
                  </div>
                  <button
                    onClick={disconnect}
                    className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              ) : (
                <button
                  onClick={connect}
                  className="px-6 py-3 bg-gradient-to-r from-gold to-gold-dark text-black font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>

          {/* Share Statistics */}
          <div className="bg-card-bg border border-card-border rounded-xl p-8">
            <h3 className="text-xl font-semibold mb-4 text-white">Share Statistics</h3>
            {stats && stats.totalShares > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Shares</span>
                  <span className="text-2xl font-bold text-gold">{stats.totalShares}</span>
                </div>
                <div className="border-t border-card-border pt-4">
                  <p className="text-sm text-gray-400 mb-2">By Platform</p>
                  {Object.entries(stats.byPlatform).map(([platform, count]) => (
                    <div key={platform} className="flex items-center justify-between text-sm">
                      <span className="text-gray-300 capitalize">{platform}</span>
                      <span className="text-purple">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No shares yet. Share your cards to see stats!</p>
            )}
          </div>
        </div>

        {/* Right Column - Referral Program */}
        <div>
          <ReferralProgram className="bg-card-bg border border-card-border rounded-xl p-8" />
        </div>
      </div>
    </div>
  )
}
