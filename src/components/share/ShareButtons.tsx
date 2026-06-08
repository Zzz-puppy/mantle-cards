'use client'

import { useState } from 'react'
import type { Card } from '@/types/card'
import type { BattleResult } from '@/types/battle'
import { ShareModal } from './ShareModal'
import { generateReferralCode } from '@/lib/social-share'

interface ShareButtonsProps {
  type: 'card' | 'battle'
  card?: Card
  battle?: BattleResult
  address?: `0x${string}`
  variant?: 'icon' | 'full' | 'floating'
  className?: string
}

export function ShareButtons({
  type,
  card,
  battle,
  address,
  variant = 'icon',
  className = '',
}: ShareButtonsProps) {
  const [showModal, setShowModal] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const referralCode = generateReferralCode(address)

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowModal(true)
  }

  // Floating variant (appears on card hover)
  if (variant === 'floating') {
    return (
      <>
        <button
          onClick={handleShare}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`absolute top-2 right-2 p-2 bg-black/70 backdrop-blur-sm rounded-lg 
                      border border-white/20 text-white/80 hover:text-white
                      transition-all duration-200 ${className}
                      ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
          title="Share"
        >
          <ShareIcon />
        </button>
        <ShareModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          data={{ type, card, battle }}
          referralCode={referralCode}
        />
      </>
    )
  }

  // Icon variant (compact button)
  if (variant === 'icon') {
    return (
      <>
        <button
          onClick={handleShare}
          className={`p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 
                      text-white/80 hover:text-white transition-all ${className}`}
          title="Share"
        >
          <ShareIcon />
        </button>
        <ShareModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          data={{ type, card, battle }}
          referralCode={referralCode}
        />
      </>
    )
  }

  // Full variant (button with text)
  return (
    <>
      <button
        onClick={handleShare}
        className={`flex items-center justify-center gap-2 py-2 px-4 
                    bg-white/5 hover:bg-white/10 rounded-xl border border-white/10
                    text-white/80 hover:text-white transition-all ${className}`}
      >
        <ShareIcon />
        <span>Share</span>
      </button>
      <ShareModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        data={{ type, card, battle }}
        referralCode={referralCode}
      />
    </>
  )
}

// Share icon component
function ShareIcon() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}

// Floating share button wrapper for cards
interface FloatingShareButtonProps {
  children: React.ReactNode
  type: 'card' | 'battle'
  card?: Card
  battle?: BattleResult
  address?: `0x${string}`
}

export function FloatingShareButton({
  children,
  type,
  card,
  battle,
  address,
}: FloatingShareButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const referralCode = generateReferralCode(address)

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <ShareButtons
        type={type}
        card={card}
        battle={battle}
        address={address}
        variant="floating"
        className={isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
      />
    </div>
  )
}

export default ShareButtons