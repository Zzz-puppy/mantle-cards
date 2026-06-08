import { Card, CardRarity } from '@/types/card'
import type { DifficultyLevel, TradingPattern } from '@/types/battle'

export interface AIProfile {
  id: string
  name: string
  avatar: string
  personality: string
  difficulty: DifficultyLevel
  tradingStyle: 'aggressive' | 'conservative' | 'balanced'
  preferredCardTypes: string[]
  preferredRarity: CardRarity
  riskTolerance: number
  description: string
  winAnimation: string
  loseAnimation: string
  battleCry: string[]
}

export const AI_PROFILES: AIProfile[] = [
  {
    id: 'whale-hunter',
    name: 'Whale Hunter',
    avatar: '/avatars/whale-hunter.png',
    personality: 'Aggressive Risk Taker',
    difficulty: 'hard',
    tradingStyle: 'aggressive',
    preferredCardTypes: ['Attack', 'Special'],
    preferredRarity: 'legendary',
    riskTolerance: 0.9,
    description: 'A high-rolling trader who loves风险的快攻战术',
    winAnimation: 'triumphant-roar',
    loseAnimation: 'respectful-bow',
    battleCry: ['All in!', 'Maximum risk, maximum reward!', 'Feel the whale power!'],
  },
  {
    id: 'defensive-strategist',
    name: 'Defensive Strategist',
    avatar: '/avatars/defensive-strategist.png',
    personality: 'Patient Defender',
    difficulty: 'medium',
    tradingStyle: 'conservative',
    preferredCardTypes: ['Defense', 'Support'],
    preferredRarity: 'rare',
    riskTolerance: 0.2,
    description: 'A patient player who waits for the perfect moment to strike',
    winAnimation: 'steady-bow',
    loseAnimation: ' philosophical-shrug',
    battleCry: ['Patience wins wars', 'Defense is the best offense', 'I’ll wait...'],
  },
  {
    id: 'balanced-trader',
    name: 'Balanced Trader',
    avatar: '/avatars/balanced-trader.png',
    personality: 'Adaptive Strategist',
    difficulty: 'medium',
    tradingStyle: 'balanced',
    preferredCardTypes: ['Attack', 'Defense', 'Support'],
    preferredRarity: 'epic',
    riskTolerance: 0.5,
    description: 'A versatile player who adapts to any situation',
    winAnimation: 'balanced-stance',
    loseAnimation: 'tip-of-hat',
    battleCry: ['Versatility is key', 'Adapting to win', 'Balanced approach!'],
  },
  {
    id: 'crypto-veteran',
    name: 'Crypto Veteran',
    avatar: '/avatars/crypto-veteran.png',
    personality: 'Experienced Veteran',
    difficulty: 'hard',
    tradingStyle: 'aggressive',
    preferredCardTypes: ['Special', 'Attack'],
    preferredRarity: 'legendary',
    riskTolerance: 0.7,
    description: 'An experienced player with deep market knowledge',
    winAnimation: 'veteran-salute',
    loseAnimation: 'wise-nod',
    battleCry: ['I’ve seen it all', 'Experience matters', 'Let’s play!'],
  },
  {
    id: 'paper-hands',
    name: 'Paper Hands',
    avatar: '/avatars/paper-hands.png',
    personality: 'Fearful Newcomer',
    difficulty: 'easy',
    tradingStyle: 'conservative',
    preferredCardTypes: ['Defense', 'Support'],
    preferredRarity: 'common',
    riskTolerance: 0.1,
    description: 'A nervous newcomer who fears losses',
    winAnimation: 'nervous-cheer',
    loseAnimation: 'sad-tears',
    battleCry: ['Please don’t hurt me...', 'I hope I win...', 'So scary!'],
  },
  {
    id: 'degen-trader',
    name: 'Degen Trader',
    avatar: '/avatars/degen-trader.png',
    personality: 'Degenerate Gambler',
    difficulty: 'medium',
    tradingStyle: 'aggressive',
    preferredCardTypes: ['Attack', 'Special'],
    preferredRarity: 'epic',
    riskTolerance: 0.95,
    description: 'A reckless gambler who bets it all',
    winAnimation: 'wild-celebration',
    loseAnimation: 'shrug-it-off',
    battleCry: ['WAGMI!', 'To the moon!', 'YOLO!'],
  },
]

export function getAIProfile(profileId: string): AIProfile {
  return AI_PROFILES.find(p => p.id === profileId) || AI_PROFILES[1]
}

export function getRandomAIProfile(): AIProfile {
  return AI_PROFILES[Math.floor(Math.random() * AI_PROFILES.length)]
}

export function getAIProfileByDifficulty(difficulty: DifficultyLevel): AIProfile[] {
  return AI_PROFILES.filter(p => p.difficulty === difficulty)
}

export function analyzeTradingPattern(
  transactionHistory: { value: number; frequency: number }[]
): TradingPattern {
  if (transactionHistory.length === 0) {
    return {
      style: 'balanced',
      avgTransactionSize: 1000,
      transactionFrequency: 1,
      riskTolerance: 0.5,
      preferredRarity: 'common',
    }
  }

  const avgValue = transactionHistory.reduce((sum, t) => sum + t.value, 0) / transactionHistory.length
  const avgFreq = transactionHistory.reduce((sum, t) => sum + t.frequency, 0) / transactionHistory.length

  let style: 'aggressive' | 'conservative' | 'balanced'
  let riskTolerance: number
  let preferredRarity: 'common' | 'rare' | 'epic' | 'legendary'

  if (avgValue > 10000 && avgFreq > 5) {
    style = 'aggressive'
    riskTolerance = 0.8
    preferredRarity = avgValue > 50000 ? 'legendary' : 'epic'
  } else if (avgValue < 1000 || avgFreq < 2) {
    style = 'conservative'
    riskTolerance = 0.2
    preferredRarity = 'common'
  } else {
    style = 'balanced'
    riskTolerance = 0.5
    preferredRarity = 'rare'
  }

  return {
    style,
    avgTransactionSize: avgValue,
    transactionFrequency: avgFreq,
    riskTolerance,
    preferredRarity,
  }
}

export function selectBestMatchingAI(tradingPattern: TradingPattern): AIProfile {
  const matchingProfiles = AI_PROFILES.filter(p => p.tradingStyle === tradingPattern.style)
  
  if (matchingProfiles.length > 0) {
    return matchingProfiles[Math.floor(Math.random() * matchingProfiles.length)]
  }
  
  return AI_PROFILES.find(p => p.preferredRarity === tradingPattern.preferredRarity) || AI_PROFILES[1]
}
