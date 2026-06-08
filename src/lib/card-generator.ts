import type { CardRarity, CardMintParams } from '@/types/card'
import type { WalletPortfolio } from './mantle-data'
import { RARITY_VALUES } from './contracts'

// Card name prefixes based on rarity
const CARD_NAME_PREFIXES: Record<CardRarity, string[]> = {
  common: ['Apprentice', 'Novice', 'Beginner', 'Trainee', 'Learner'],
  rare: ['Knight', 'Guardian', 'Sentinel', 'Defender', 'Champion'],
  epic: ['Master', 'Grandmaster', 'Elder', 'Ancient', 'Mythic'],
  legendary: ['Divine', 'Celestial', 'Eternal', 'Transcendent', 'Omniscient'],
}

// Card name suffixes
const CARD_NAME_SUFFIXES = [
  'of Power', 'of Wisdom', 'of Courage', 'of Strength', 'of Shadow',
  'the Brave', 'the Wise', 'the Mighty', 'the Swift', 'the Silent',
]

// Special abilities based on wallet attributes
const SPECIAL_ABILITIES: Record<string, string[]> = {
  highBalance: [
    'Wealth Aura: Gain 20% more rewards from battles',
    'Golden Touch: Cards have 10% higher attack',
    'Rich Fortune: Critical hit chance increased by 15%',
  ],
  highTxCount: [
    'Battle Hardened: Immune to first attack each round',
    'Experienced: 25% bonus to defense stats',
    'Veteran: Draw an extra card at battle start',
  ],
  highGasSpent: [
    'Fueled Power: Attack increases by 30% when health is low',
    'Energy Surge: Special ability costs reduced by 50%',
    'Phoenix Rising: Recover 10% health when defeated',
  ],
  erc20Diversity: [
    'Token Harmony: +15 defense for each ERC20 token held',
    'Diversified: 20% resistance to special abilities',
    'Multi-Chain: Can use abilities of any card type',
  ],
}

// Rarity thresholds based on portfolio value
const RARITY_THRESHOLDS = {
  legendary: 10000, // $10,000+ portfolio
  epic: 1000,       // $1,000+ portfolio
  rare: 100,        // $100+ portfolio
  common: 0,        // Any portfolio
}

// Calculate rarity based on portfolio value
export function calculateRarity(portfolio: WalletPortfolio): CardRarity {
  const value = portfolio.totalValueUsd
  
  if (value >= RARITY_THRESHOLDS.legendary) return 'legendary'
  if (value >= RARITY_THRESHOLDS.epic) return 'epic'
  if (value >= RARITY_THRESHOLDS.rare) return 'rare'
  return 'common'
}

// Calculate attack based on MNT balance
export function calculateAttack(mntBalance: bigint): number {
  const balanceNum = Number(mntBalance) / 1e18
  // Base attack 10, +1 for each 0.1 MNT
  const baseAttack = 10
  const bonusAttack = Math.floor(balanceNum / 0.1)
  return Math.min(baseAttack + bonusAttack, 100) // Cap at 100
}

// Calculate defense based on ERC20 diversity
export function calculateDefense(erc20Count: number): number {
  // Base defense 10, +5 for each ERC20 token
  const baseDefense = 10
  const bonusDefense = erc20Count * 5
  return Math.min(baseDefense + bonusDefense, 100) // Cap at 100
}

// Calculate experience level based on transaction count
export function calculateExperienceLevel(txCount: number): number {
  if (txCount >= 1000) return 5 // Legendary experience
  if (txCount >= 500) return 4  // Epic experience
  if (txCount >= 100) return 3  // Rare experience
  if (txCount >= 20) return 2   // Normal experience
  return 1                        // Beginner
}

// Generate special abilities based on wallet attributes
export function generateSpecialAbilities(portfolio: WalletPortfolio): string[] {
  const abilities: string[] = []
  const mntBalance = Number(portfolio.mntBalance) / 1e18
  const txCount = portfolio.transactionCount
  const gasSpent = Number(portfolio.totalGasSpent) / 1e18
  const erc20Count = portfolio.erc20Tokens.length

  // High balance abilities
  if (mntBalance >= 10) {
    abilities.push(...SPECIAL_ABILITIES.highBalance)
  }

  // High transaction count abilities
  if (txCount >= 50) {
    abilities.push(...SPECIAL_ABILITIES.highTxCount)
  }

  // High gas spent abilities
  if (gasSpent >= 1) {
    abilities.push(...SPECIAL_ABILITIES.highGasSpent)
  }

  // ERC20 diversity abilities
  if (erc20Count >= 2) {
    abilities.push(...SPECIAL_ABILITIES.erc20Diversity)
  }

  return abilities
}

// Random selection helper
function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

// Random number in range
function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Generate card name based on rarity
export function generateCardName(rarity: CardRarity): string {
  const prefix = randomElement(CARD_NAME_PREFIXES[rarity])
  const suffix = randomElement(CARD_NAME_SUFFIXES)
  return `${prefix} ${suffix}`
}

// Select special ability from pool
export function selectSpecialAbility(portfolio: WalletPortfolio): string {
  const abilities = generateSpecialAbilities(portfolio)
  if (abilities.length === 0) {
    return 'Basic Strike: Deal 5 damage to opponent'
  }
  return randomElement(abilities)
}

// Generate card attributes based on wallet portfolio
export interface GeneratedCardAttributes {
  name: string
  rarity: CardRarity
  rarityValue: number
  attack: number
  defense: number
  specialAbility: string
  baseToken: string
  tokenBalance: bigint
  transactionCount: number
  experienceLevel: number
}

export function generateCardAttributes(
  portfolio: WalletPortfolio,
  forceRarity?: CardRarity
): GeneratedCardAttributes {
  // Determine rarity
  const rarity = forceRarity || calculateRarity(portfolio)
  const rarityValue = RARITY_VALUES[rarity]

  // Calculate base stats
  const attack = calculateAttack(portfolio.mntBalance)
  const defense = calculateDefense(portfolio.erc20Tokens.length)
  const transactionCount = portfolio.transactionCount
  const experienceLevel = calculateExperienceLevel(transactionCount)

  // Apply rarity multipliers
  const rarityMultiplier = 1 + (rarityValue * 0.25) // 0%, 25%, 50%, 75%
  const finalAttack = Math.min(Math.floor(attack * rarityMultiplier), 100)
  const finalDefense = Math.min(Math.floor(defense * rarityMultiplier), 100)

  // Generate card name
  const name = generateCardName(rarity)

  // Select special ability
  const specialAbility = selectSpecialAbility(portfolio)

  return {
    name,
    rarity,
    rarityValue,
    attack: finalAttack,
    defense: finalDefense,
    specialAbility,
    baseToken: 'MNT',
    tokenBalance: portfolio.mntBalance,
    transactionCount,
    experienceLevel,
  }
}

// Preview card generation without committing
export function previewCardAttributes(portfolio: WalletPortfolio): GeneratedCardAttributes {
  return generateCardAttributes(portfolio)
}

// Generate multiple card options for user to choose from
export function generateCardOptions(
  portfolio: WalletPortfolio,
  count: number = 3
): GeneratedCardAttributes[] {
  const options: GeneratedCardAttributes[] = []
  const baseRarity = calculateRarity(portfolio)
  const rarityValues: CardRarity[] = ['common', 'rare', 'epic', 'legendary']
  const baseIndex = rarityValues.indexOf(baseRarity)

  for (let i = 0; i < count; i++) {
    // Each option has a chance of being higher rarity
    const bonusRarityIndex = Math.min(baseIndex + Math.floor(i / 2), 3)
    const rarity = rarityValues[bonusRarityIndex]
    options.push(generateCardAttributes(portfolio, rarity))
  }

  return options
}

// Convert to mint params
export function toMintParams(attributes: GeneratedCardAttributes): CardMintParams {
  return {
    name: attributes.name,
    rarity: attributes.rarity,
    attack: attributes.attack,
    defense: attributes.defense,
    specialAbility: attributes.specialAbility,
    imageURI: '', // Set during minting
  }
}

// Card image generation (returns placeholder URL)
export function generateCardImageURL(tokenId: number, rarity: CardRarity): string {
  const images: Record<CardRarity, string> = {
    common: `https://api.dicebear.com/7.x/shapes/svg?seed=${tokenId}-common`,
    rare: `https://api.dicebear.com/7.x/shapes/svg?seed=${tokenId}-rare`,
    epic: `https://api.dicebear.com/7.x/shapes/svg?seed=${tokenId}-epic`,
    legendary: `https://api.dicebear.com/7.x/shapes/svg?seed=${tokenId}-legendary`,
  }
  return images[rarity]
}

// Validate card attributes
export function validateCardAttributes(params: CardMintParams): string[] {
  const errors: string[] = []

  if (!params.name || params.name.length < 3) {
    errors.push('Card name must be at least 3 characters')
  }
  if (params.name.length > 30) {
    errors.push('Card name must be less than 30 characters')
  }
  if (params.attack < 1 || params.attack > 100) {
    errors.push('Attack must be between 1 and 100')
  }
  if (params.defense < 1 || params.defense > 100) {
    errors.push('Defense must be between 1 and 100')
  }
  if (!params.specialAbility) {
    errors.push('Special ability is required')
  }

  return errors
}
