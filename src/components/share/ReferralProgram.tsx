'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/Button'
import {
  generateReferralCode,
  generateReferralLink,
  copyToClipboard,
  getShareStats,
  type ShareStats,
} from '@/lib/social-share'

interface ReferralProgramProps {
  address?: `0x${string}`
  className?: string
}

export function ReferralProgram({ address, className = '' }: ReferralProgramProps) {
  const [referralCode, setReferralCode] = useState<string>('')
  const [referralLink, setReferralLink] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [stats, setStats] = useState<ShareStats | null>(null)

  useEffect(() => {
    // Generate or retrieve referral code
    const code = generateReferralCode(address)
    setReferralCode(code)
    setReferralLink(generateReferralLink(code))

    // Load stats
    setStats(getShareStats())
  }, [address])

  const handleCopyLink = useCallback(async () => {
    const success = await copyToClipboard(referralLink)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [referralLink])

  const handleShare = useCallback((platform: 'twitter' | 'facebook' | 'native') => {
    const message = encodeURIComponent(
      `🎴 Join me in the AI Trading Card Game on Mantle Network! Use my referral link to get started:`
    )
    const url = encodeURIComponent(referralLink)

    if (platform === 'twitter') {
      window.open(
        `https://twitter.com/intent/tweet?text=${message}&url=${url}&hashtags=AITradingCardGame,Mantle,Web3`,
        '_blank',
        'width=550,height=420'
      )
    } else if (platform === 'facebook') {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        '_blank',
        'width=550,height=420'
      )
    }
  }, [referralLink])

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gold mb-2">🎁 Referral Program</h3>
        <p className="text-gray-400 text-sm">
          Share your referral link and earn rewards when friends join!
        </p>
      </div>

      {/* Referral Link */}
      <div className="bg-black/30 rounded-xl p-4 border border-white/10">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Your Referral Link</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono truncate"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleCopyLink}
            className="shrink-0"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Referral Code: <span className="text-gold font-mono">{referralCode}</span>
        </p>
      </div>

      {/* Share Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => handleShare('twitter')}
          className="flex flex-col items-center gap-2 p-3 bg-black/30 rounded-xl border border-white/10 hover:border-white/20 transition-colors"
        >
          <XIcon />
          <span className="text-xs text-gray-400">Post to X</span>
        </button>

        <button
          onClick={() => handleShare('facebook')}
          className="flex flex-col items-center gap-2 p-3 bg-black/30 rounded-xl border border-white/10 hover:border-white/20 transition-colors"
        >
          <FacebookIcon />
          <span className="text-xs text-gray-400">Facebook</span>
        </button>

        {typeof navigator !== 'undefined' && navigator.share && (
          <button
            onClick={() => handleShare('native')}
            className="flex flex-col items-center gap-2 p-3 bg-black/30 rounded-xl border border-white/10 hover:border-white/20 transition-colors"
          >
            <ShareIcon />
            <span className="text-xs text-gray-400">More</span>
          </button>
        )}
      </div>

      {/* Rewards Info */}
      <div className="bg-gradient-to-r from-purple/20 to-blue/20 rounded-xl p-4 border border-purple/30">
        <h4 className="font-bold text-white mb-2">How to Earn</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Share your link on social media</li>
          <li>• Friends sign up using your code</li>
          <li>• Earn 10 tokens per referral</li>
          <li>• Get bonus NFTs for 5+ referrals</li>
        </ul>
      </div>

      {/* Referral Stats */}
      {stats && stats.totalShares > 0 && (
        <div className="bg-black/30 rounded-xl p-4 border border-white/10">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Your Referral Stats</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gold">{stats.totalShares}</p>
              <p className="text-xs text-gray-500">Total Shares</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple">
                {stats.recentShares.filter((s) => s.platform !== 'copy' && s.platform !== 'download').length}
              </p>
              <p className="text-xs text-gray-500">Social Clicks</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue">0</p>
              <p className="text-xs text-gray-500">Referrals</p>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Preview */}
      <div className="bg-black/30 rounded-xl p-4 border border-white/10">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Top Referrers</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gold">🥇</span>
              <span className="text-gray-300">0x1234...5678</span>
            </div>
            <span className="text-gold">127 referrals</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-300">🥈</span>
              <span className="text-gray-300">0xABCD...EFGH</span>
            </div>
            <span className="text-gray-400">89 referrals</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-amber-600">🥉</span>
              <span className="text-gray-300">0x9876...IJKL</span>
            </div>
            <span className="text-gray-400">54 referrals</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Icons
function XIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}

export default ReferralProgram