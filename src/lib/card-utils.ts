/**
 * Card Utilities
 * Provides consistent handling of card-related operations with unified type system
 */

import { Card, CardRarity } from '@/types/card'

/**
 * Rarity score mapping for comparisons
 */
export const RARITY_SCORES: Record<CardRarity, number> = {
  common: 1,
  rare: 2,
  epic: 3,
  legendary: 4,
}

/**
 * Get the numerical score for a rarity
 */
export function getRarityScore(rarity: CardRarity): number {
  return RARITY_SCORES[rarity] || 0
}

/**
 * Compare two rarities
 * @returns negative if a < b, positive if a > b, 0 if equal
 */
export function compareRarity(a: CardRarity, b: CardRarity): number {
  return getRarityScore(a) - getRarityScore(b)
}

/**
 * Format rarity for display (capitalize first letter)
 */
export function formatRarity(rarity: CardRarity): string {
  return rarity.charAt(0).toUpperCase() + rarity.slice(1)
}

/**
 * Get color class for rarity
 */
export function getRarityColor(rarity: CardRarity): string {
  const colors: Record<CardRarity, string> = {
    legendary: 'text-yellow-400',
    epic: 'text-purple-400',
    rare: 'text-blue-400',
    common: 'text-gray-400',
  }
  return colors[rarity] || colors.common
}

/**
 * Get background color class for rarity
 */
export function getRarityBgColor(rarity: CardRarity): string {
  const colors: Record<CardRarity, string> = {
    legendary: 'bg-yellow-500/20',
    epic: 'bg-purple-500/20',
    rare: 'bg-blue-500/20',
    common: 'bg-gray-500/20',
  }
  return colors[rarity] || colors.common
}

/**
 * Get border color class for rarity
 */
export function getRarityBorderColor(rarity: CardRarity): string {
  const colors: Record<CardRarity, string> = {
    legendary: 'border-yellow-500/30',
    epic: 'border-purple-500/30',
    rare: 'border-blue-500/30',
    common: 'border-gray-500/30',
  }
  return colors[rarity] || colors.common
}

/**
 * Get gradient color class for rarity
 */
export function getRarityGradient(rarity: CardRarity): string {
  const gradients: Record<CardRarity, string> = {
    legendary: 'from-yellow-500 via-orange-500 to-red-600',
    epic: 'from-purple-600 to-purple-900',
    rare: 'from-blue-600 to-blue-900',
    common: 'from-gray-600 to-gray-800',
  }
  return gradients[rarity] || gradients.common
}

/**
 * Check if a card has high rarity
 */
export function isHighRarity(rarity: CardRarity): boolean {
  return rarity === 'legendary' || rarity === 'epic'
}

/**
 * Sort cards by rarity (descending)
 */
export function sortByRarity(cards: Card[], ascending = false): Card[] {
  return [...cards].sort((a, b) => {
    const scoreA = getRarityScore(a.rarity)
    const scoreB = getRarityScore(b.rarity)
    return ascending ? scoreA - scoreB : scoreB - scoreA
  })
}

/**
 * Count cards by rarity
 */
export function countByRarity(cards: Card[]): Record<CardRarity, number> {
  const counts: Record<CardRarity, number> = {
    common: 0,
    rare: 0,
    epic: 0,
    legendary: 0,
  }

  cards.forEach(card => {
    if (counts[card.rarity] !== undefined) {
      counts[card.rarity]++
    }
  })

  return counts
}

/**
 * Filter cards by rarity
 */
export function filterByRarity(cards: Card[], rarity: CardRarity): Card[] {
  return cards.filter(card => card.rarity === rarity)
}

/**
 * Get all rarity types
 */
export function getAllRarities(): CardRarity[] {
  return ['legendary', 'epic', 'rare', 'common']
}
