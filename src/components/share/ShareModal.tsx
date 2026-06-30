'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Card } from '@/types/card'
import type { BattleResult } from '@/types/battle'
import { useShareCard } from './ShareCard'
import { shareToTwitter, generateShareText, generateReferralLink } from '@/lib/social-share'
import { Button } from '@/components/Button'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  data: {
    type: 'card' | 'battle'
    card?: Card
    battle?: BattleResult
  }
  referralCode?: string
}

export function ShareModal({ isOpen, onClose, data, referralCode }: ShareModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [customMessage, setCustomMessage] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const { generateCardShare, generateBattleShare } = useShareCard()

  const generatePreview = useCallback(async () => {
    setIsGenerating(true)
    try {
      let url: string
      if (data.type === 'card' && data.card) {
        url = await generateCardShare(data.card, referralCode)
      } else if (data.type === 'battle' && data.battle) {
        url = await generateBattleShare(data.battle, 'Player', referralCode)
      } else {
        return
      }
      setPreviewUrl(url)
    } catch (error) {
      console.error('Failed to generate preview:', error)
    } finally {
      setIsGenerating(false)
    }
  }, [data, referralCode, generateCardShare, generateBattleShare])

  useEffect(() => {
    if (isOpen) {
      generatePreview()
      // Set default message
      if (data.type === 'card' && data.card) {
        setCustomMessage(`Check out my ${data.card.rarity} ${data.card.name} card! 🎴`)
      } else if (data.type === 'battle' && data.battle) {
        const isVictory = data.battle.winner === 'player'
        setCustomMessage(
          `I just ${isVictory ? 'won' : 'lost'} a battle in AI Card Game! ${isVictory ? '🏆' : '💀'}`
        )
      }
    }
  }, [isOpen, generatePreview, data])

  const handleDownload = async () => {
    if (!previewUrl) return

    const link = document.createElement('a')
    link.download =
      data.type === 'card'
        ? `card-${data.card?.name || 'share'}.png`
        : `battle-result.png`
    link.href = previewUrl
    link.click()
  }

  const handleCopyLink = async () => {
    const link = generateReferralLink(referralCode)
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTwitterShare = () => {
    if (data.type === 'card' && data.card) {
      const message = customMessage || generateShareText({ type: 'card', card: data.card })
      shareToTwitter({ type: 'card', card: data.card }, message, referralCode)
    } else if (data.type === 'battle' && data.battle) {
      const message = customMessage || generateShareText({ type: 'battle', battle: data.battle })
      shareToTwitter({ type: 'battle', battle: data.battle }, message, referralCode)
    }
  }

  const handleNativeShare = async () => {
    const shareData: ShareData = {
      title: 'AI Trading Card Game',
      text: customMessage,
    }

    if (previewUrl) {
      // Convert data URL to blob for sharing
      const response = await fetch(previewUrl)
      const blob = await response.blob()
      const file = new File([blob], 'share-image.png', { type: 'image/png' })
      shareData.files = [file]
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Share failed:', error)
        }
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative z-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#1a1625] via-[#1f1833] to-[#1a2535] rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-[#7C6BAF]/20">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Share Your Achievement</h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white text-3xl transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Preview */}
          <div className="relative aspect-[1200/630] bg-gray-800 rounded-xl overflow-hidden">
            {isGenerating ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold" />
              </div>
            ) : previewUrl ? (
              <img
                src={previewUrl}
                alt="Share preview"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                Preview not available
              </div>
            )}
          </div>

          {/* Custom Message */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Custom Message
            </label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              maxLength={280}
              rows={3}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="Write your message..."
            />
            <p className="text-xs text-gray-500 mt-1 text-right">{customMessage.length}/280</p>
          </div>

          {/* Share Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {/* Twitter/X */}
            <Button
              variant="primary"
              className="bg-black hover:bg-gray-900 text-white border border-gray-700 flex items-center justify-center gap-2"
              onClick={handleTwitterShare}
            >
              <XIcon />
              Share on X
            </Button>

            {/* Copy Link */}
            <Button
              variant="secondary"
              className="flex items-center justify-center gap-2"
              onClick={handleCopyLink}
            >
              {copied ? (
                <>
                  <CheckIcon />
                  Copied!
                </>
              ) : (
                <>
                  <LinkIcon />
                  Copy Link
                </>
              )}
            </Button>

            {/* Download */}
            <Button
              variant="outline"
              className="col-span-2 flex items-center justify-center gap-2 border-white/20 text-white hover:bg-white/10"
              onClick={handleDownload}
              disabled={!previewUrl}
            >
              <DownloadIcon />
              Download Image
            </Button>

            {/* Native Share (mobile) */}
            {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
              <Button
                variant="outline"
                className="col-span-2 flex items-center justify-center gap-2 border-white/20 text-white hover:bg-white/10"
                onClick={handleNativeShare}
              >
                <ShareIcon />
                Share via...
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="bg-black/30 rounded-xl p-4 border border-white/5">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Share Stats</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xl font-bold text-gold">0</p>
                <p className="text-xs text-gray-500">Views</p>
              </div>
              <div>
                <p className="text-xl font-bold text-purple">0</p>
                <p className="text-xs text-gray-500">Clicks</p>
              </div>
              <div>
                <p className="text-xl font-bold text-blue">0</p>
                <p className="text-xs text-gray-500">Referrals</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Simple SVG icons
function XIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}

export default ShareModal
