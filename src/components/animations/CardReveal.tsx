'use client'

import type { Card as CardType } from '@/types'
import { Card } from '../Card'
import { useState, useEffect, useCallback } from 'react'

interface CardRevealProps {
  card: CardType
  onRevealComplete?: () => void
  autoRevealDelay?: number
}

export function CardReveal({ 
  card, 
  onRevealComplete,
  autoRevealDelay = 2000 
}: CardRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false)
  const [isFlipping, setIsFlipping] = useState(false)
  const [showSparkles, setShowSparkles] = useState(false)

  const triggerSparkles = useCallback(() => {
    setShowSparkles(true)
    setTimeout(() => {
      setShowSparkles(false)
      onRevealComplete?.()
    }, 1500)
  }, [onRevealComplete])

  const setIsRevealing = useCallback(() => {
    setIsFlipping(true)
    setTimeout(() => {
      setIsRevealed(true)
      setIsFlipping(false)
      triggerSparkles()
    }, 600)
  }, [triggerSparkles])

  useEffect(() => {
    const revealTimer = setTimeout(() => {
      setIsRevealing()
    }, autoRevealDelay)

    return () => clearTimeout(revealTimer)
  }, [autoRevealDelay, setIsRevealing])

  const handleManualReveal = useCallback(() => {
    if (!isRevealed) {
      setIsRevealing()
    }
  }, [isRevealed, setIsRevealing])

  return (
    <div className="relative inline-block">
      {/* Sparkle Effects */}
      {showSparkles && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-sparkle"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
                  fill={getSparkleColor(card.rarity)}
                />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* Glow Effect on Reveal */}
      {isRevealed && (
        <div 
          className="absolute -inset-4 rounded-2xl blur-xl animate-reveal-glow z-[-1]"
          style={{
            background: getRarityGlow(card.rarity),
          }}
        />
      )}

      {/* Card */}
      <div 
        onClick={handleManualReveal}
        className="cursor-pointer"
      >
        <Card 
          card={card} 
          showBack={!isRevealed}
          isFlipping={isFlipping}
        />
      </div>

      {/* Reveal Button (if not auto-revealed) */}
      {!isRevealed && (
        <button
          onClick={handleManualReveal}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 
                     bg-gradient-to-r from-gold to-yellow-500 
                     text-black font-bold px-4 py-2 rounded-full
                     text-sm animate-pulse hover:scale-105 transition-transform
                     shadow-lg shadow-gold/30"
        >
          Tap to Reveal ✨
        </button>
      )}
    </div>
  )
}

function getSparkleColor(rarity: string): string {
  switch (rarity) {
    case 'Legendary':
      return '#FFD700'
    case 'Epic':
      return '#A78BFA'
    case 'Rare':
      return '#60A5FA'
    default:
      return '#9CA3AF'
  }
}

function getRarityGlow(rarity: string): string {
  switch (rarity) {
    case 'Legendary':
      return 'radial-gradient(circle, rgba(255,215,0,0.4) 0%, rgba(255,165,0,0.2) 50%, transparent 70%)'
    case 'Epic':
      return 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, rgba(139,92,246,0.2) 50%, transparent 70%)'
    case 'Rare':
      return 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(59,130,246,0.2) 50%, transparent 70%)'
    default:
      return 'radial-gradient(circle, rgba(156,163,175,0.3) 0%, transparent 70%)'
  }
}
