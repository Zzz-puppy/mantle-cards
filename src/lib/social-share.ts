import type { Card } from '@/types/card'
import type { BattleResult } from '@/types/battle'

// Base URL for the app
const APP_BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://mantle.cards'

export interface ShareData {
  type: 'card' | 'battle'
  card?: Card
  battle?: BattleResult
}

/**
 * Generate a referral link with optional referral code
 */
export function generateReferralLink(referralCode?: string): string {
  if (referralCode) {
    return `${APP_BASE_URL}?ref=${referralCode}`
  }
  return APP_BASE_URL
}

/**
 * Generate unique referral code from wallet address or random
 */
export function generateReferralCode(address?: `0x${string}`): string {
  if (address) {
    // Create a short code from address
    return address.slice(2, 8).toUpperCase()
  }
  // Generate random 6-char code
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

/**
 * Generate engaging share text for a card
 */
export function generateShareText(data: ShareData): string {
  if (data.type === 'card' && data.card) {
    const { card } = data
    const rarityEmoji = {
      legendary: '✨',
      epic: '💎',
      rare: '🔵',
      common: '⚪',
    }[card.rarity] || '⚪'

    const rarityHashtag = `#${card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)}Card`

    return `🎴 Check out my ${rarityEmoji} ${card.rarity.toUpperCase()} card "${card.name}"!
    
⚔️ Attack: ${card.attack} | 🛡️ Defense: ${card.defense}
${card.specialAbility ? `✨ ${card.specialAbility}` : ''}

${rarityHashtag} #AITradingCardGame #Mantle`
  }

  if (data.type === 'battle' && data.battle) {
    const { battle } = data
    const isVictory = battle.winner === 'player'
    const resultEmoji = isVictory ? '🏆' : '💀'
    const resultText = isVictory ? 'VICTORY!' : 'DEFEAT'

    return `${resultEmoji} ${resultText} in AI Card Game Battle!

I ${isVictory ? 'dealt' : 'took'} ${battle.playerDamage} damage vs ${battle.opponentCard.name}!

#AITradingCardGame #Mantle #BlockchainGaming`
  }

  return '🎴 Play AI Trading Card Game on Mantle Network!'
}

/**
 * Share content to Twitter/X
 */
export function shareToTwitter(
  data: ShareData,
  message?: string,
  referralCode?: string
): void {
  const text = encodeURIComponent(message || generateShareText(data))
  const url = encodeURIComponent(generateReferralLink(referralCode))
  const hashtags = encodeURIComponent('AITradingCardGame,Mantle,Web3')

  // Open Twitter intent URL
  const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtags}`

  if (typeof window !== 'undefined') {
    window.open(twitterUrl, '_blank', 'width=550,height=420')
  }
}

/**
 * Share content to Facebook
 */
export function shareToFacebook(referralCode?: string): void {
  const url = encodeURIComponent(generateReferralLink(referralCode))
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`

  if (typeof window !== 'undefined') {
    window.open(facebookUrl, '_blank', 'width=550,height=420')
  }
}

/**
 * Share content via native Web Share API (mobile)
 */
export async function nativeShare(
  data: ShareData,
  referralCode?: string
): Promise<boolean> {
  const shareData = {
    title: 'AI Trading Card Game',
    text: generateShareText(data),
    url: generateReferralLink(referralCode),
  }

  if (data.type === 'card' && data.card) {
    shareData.title = `${data.card.name} - ${data.card.rarity} Card`
  } else if (data.type === 'battle' && data.battle) {
    const isVictory = data.battle.winner === 'player'
    shareData.title = `Battle ${isVictory ? 'Victory' : 'Defeat'}!`
  }

  if (navigator.share) {
    try {
      await navigator.share(shareData)
      return true
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        // User cancelled
        return false
      }
      throw error
    }
  }

  return false
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch {
      document.body.removeChild(textArea)
      return false
    }
  }
}

/**
 * Track share event (for analytics)
 */
export interface ShareEvent {
  type: 'card' | 'battle'
  platform: 'twitter' | 'facebook' | 'native' | 'copy' | 'download'
  cardId?: string
  battleId?: string
  referralCode?: string
  timestamp: number
}

export function trackShare(event: Omit<ShareEvent, 'timestamp'>): void {
  const fullEvent: ShareEvent = {
    ...event,
    timestamp: Date.now(),
  }

  // Store in localStorage for demo purposes
  // In production, this would send to an analytics endpoint
  try {
    const shares = JSON.parse(localStorage.getItem('share_events') || '[]')
    shares.push(fullEvent)
    // Keep last 100 events
    if (shares.length > 100) {
      shares.shift()
    }
    localStorage.setItem('share_events', JSON.stringify(shares))
  } catch {
    console.warn('Failed to track share event')
  }
}

/**
 * Get share statistics from local storage
 */
export interface ShareStats {
  totalShares: number
  byPlatform: Record<string, number>
  byType: Record<string, number>
  recentShares: ShareEvent[]
}

export function getShareStats(): ShareStats {
  try {
    const shares = JSON.parse(localStorage.getItem('share_events') || '[]') as ShareEvent[]

    const byPlatform: Record<string, number> = {}
    const byType: Record<string, number> = {}

    shares.forEach((share) => {
      byPlatform[share.platform] = (byPlatform[share.platform] || 0) + 1
      byType[share.type] = (byType[share.type] || 0) + 1
    })

    return {
      totalShares: shares.length,
      byPlatform,
      byType,
      recentShares: shares.slice(-10).reverse(),
    }
  } catch {
    return {
      totalShares: 0,
      byPlatform: {},
      byType: {},
      recentShares: [],
    }
  }
}

/**
 * Clear share statistics
 */
export function clearShareStats(): void {
  localStorage.removeItem('share_events')
}
