/**
 * AI Card Analysis Service
 * Provides intelligent card analysis, team recommendations, and battle predictions
 */

import { Card, CardRarity, CardType } from '@/types'

// Card Analysis Interface
export interface CardAnalysis {
  overallScore: number
  attackRating: number
  defenseRating: number
  potential: string
  strengths: string[]
  weaknesses: string[]
  bestTeammates: string[]
  upgradeSuggestions: string[]
  battlePrediction: {
    strongAgainst: string[]
    weakAgainst: string[]
  }
  synergyTips: string[]
  educationalTips: string[]
}

// Team Composition Interface
export interface TeamAnalysis {
  teamName: string
  synergyScore: number
  overallPower: number
  strategy: string
  strengths: string[]
  weaknesses: string[]
  recommendedPositions: {
    cardId: string
    position: 'front' | 'middle' | 'back'
    role: string
  }[]
  comboDescriptions: string[]
}

// Battle Prediction Interface
export interface BattlePrediction {
  winner: 'player' | 'opponent' | 'draw'
  winProbability: number
  factors: {
    factor: string
    advantage: 'player' | 'opponent' | 'neutral'
    impact: number // 0-100
  }[]
  predictedDamage: {
    playerToOpponent: number
    opponentToPlayer: number
  }
  keyInsights: string[]
  recommendedStrategy: string
}

// Rarity multiplier for scoring
const rarityMultiplier: Record<CardRarity, number> = {
  Common: 1.0,
  Rare: 1.3,
  Epic: 1.6,
  Legendary: 2.0,
}

// Type advantages for battle prediction
const typeAdvantages: Record<CardType, CardType[]> = {
  [CardType.Attack]: [CardType.Defense, CardType.Support],
  [CardType.Defense]: [CardType.Special, CardType.Attack],
  [CardType.Support]: [CardType.Attack, CardType.Special],
  [CardType.Special]: [CardType.Support, CardType.Defense],
}

// Analyze a single card
export function analyzeCard(card: Card): CardAnalysis {
  const rarityMult = rarityMultiplier[card.rarity as CardRarity]
  
  // Calculate attack rating (0-100)
  const attackRating = Math.min(100, Math.round((card.attack / 100) * 100 * rarityMult))
  
  // Calculate defense rating (0-100)
  const defenseRating = Math.min(100, Math.round((card.defense / 100) * 100 * rarityMult))
  
  // Overall score calculation
  const baseOverall = (attackRating + defenseRating) / 2
  const abilityBonus = card.ability ? 15 : 0
  const overallScore = Math.min(100, Math.round(baseOverall + abilityBonus))
  
  // Determine potential
  const potential = determinePotential(card, overallScore)
  
  // Identify strengths
  const strengths = identifyStrengths(card, attackRating, defenseRating)
  
  // Identify weaknesses
  const weaknesses = identifyWeaknesses(card, attackRating, defenseRating)
  
  // Best teammates
  const bestTeammates = suggestBestTeammates(card)
  
  // Upgrade suggestions
  const upgradeSuggestions = suggestUpgrades(card)
  
  // Battle predictions
  const battlePrediction = predictBattleMatchups(card)
  
  // Synergy tips
  const synergyTips = generateSynergyTips(card)
  
  // Educational tips
  const educationalTips = generateEducationalTips(card)

  return {
    overallScore,
    attackRating,
    defenseRating,
    potential,
    strengths,
    weaknesses,
    bestTeammates,
    upgradeSuggestions,
    battlePrediction,
    synergyTips,
    educationalTips,
  }
}

// Determine card potential
function determinePotential(card: Card, overallScore: number): string {
  if (overallScore >= 85) return 'S-Tier Competitive Play'
  if (overallScore >= 70) return 'A-Tier Strong Performer'
  if (overallScore >= 55) return 'B-Tier Solid Choice'
  if (overallScore >= 40) return 'C-Tier Average Card'
  return 'D-Tier Needs Improvement'
}

// Identify card strengths
function identifyStrengths(card: Card, attackRating: number, defenseRating: number): string[] {
  const strengths: string[] = []
  
  if (attackRating >= 80) {
    strengths.push(` exceptional attack power (${card.attack})`)
  }
  if (defenseRating >= 80) {
    strengths.push(` outstanding defensive capability (${card.defense})`)
  }
  if (card.ability) {
    strengths.push(' possesses a special ability that can turn the tide of battle')
  }
  if (card.rarity === 'Legendary') {
    strengths.push(' Legendary rarity with maximum stat multipliers')
  }
  if (card.rarity === 'Epic') {
    strengths.push(' Epic rarity with strong stat bonuses')
  }
  
  // Type-based strengths
  if (card.type === CardType.Attack && attackRating >= 60) {
    strengths.push(' high damage dealer ideal for aggressive strategies')
  }
  if (card.type === CardType.Defense && defenseRating >= 60) {
    strengths.push(' excellent tank capable of absorbing damage')
  }
  if (card.type === CardType.Support && card.ability) {
    strengths.push(' support capabilities enhance team performance')
  }
  if (card.type === CardType.Special) {
    strengths.push(' unpredictable special moves create tactical opportunities')
  }
  
  return strengths.length > 0 ? strengths : [' balanced stats suitable for various strategies']
}

// Identify card weaknesses
function identifyWeaknesses(card: Card, attackRating: number, defenseRating: number): string[] {
  const weaknesses: string[] = []
  
  if (attackRating < 40) {
    weaknesses.push(' relatively low attack power')
  }
  if (defenseRating < 40) {
    weaknesses.push(' fragile defensive stats')
  }
  if (!card.ability) {
    weaknesses.push(' lacks special ability for tactical advantage')
  }
  if (card.rarity === 'Common') {
    weaknesses.push(' common rarity limits maximum potential')
  }
  
  // Type-based weaknesses
  if (card.type === CardType.Attack && defenseRating < 50) {
    weaknesses.push(' glass cannon vulnerability - high risk/reward')
  }
  if (card.type === CardType.Defense && attackRating < 50) {
    weaknesses.push(' limited offensive options')
  }
  if (card.type === CardType.Support && attackRating < 30) {
    weaknesses.push(' dependent on team for damage output')
  }
  
  return weaknesses.length > 0 ? weaknesses : [' no significant weaknesses identified']
}

// Suggest best teammates
function suggestBestTeammates(card: Card): string[] {
  const teammates: string[] = []
  
  if (card.type === CardType.Attack) {
    teammates.push('Guardian types to absorb damage while dealing damage')
    teammates.push('Support cards to enhance attack power')
  }
  if (card.type === CardType.Defense) {
    teammates.push('High damage Attack cards to capitalize on created opportunities')
    teammates.push('Support cards for healing and buffs')
  }
  if (card.type === CardType.Support) {
    teammates.push('Balanced cards that benefit from enhancement')
    teammates.push('Tank cards that can protect support')
  }
  if (card.type === CardType.Special) {
    teammates.push('versatile cards that adapt to various situations')
    teammates.push('cards with complementary abilities')
  }
  
  // Rarity-based suggestions
  if (card.rarity === 'Legendary' || card.rarity === 'Epic') {
    teammates.push(`cards of similar ${card.rarity.toLowerCase()} caliber for balanced team`)
  }
  
  return [...new Set(teammates)].slice(0, 4)
}

// Suggest upgrades
function suggestUpgrades(currentCard: Card): string[] {
  const suggestions: string[] = []
  
  if (currentCard.attack < 50) {
    suggestions.push('focus on increasing attack power through leveling')
  }
  if (currentCard.defense < 50) {
    suggestions.push('improve defense stats for better survivability')
  }
  if (!currentCard.ability) {
    suggestions.push('acquire or unlock special abilities')
  }
  if (currentCard.rarity === 'Common') {
    suggestions.push('consider obtaining higher rarity variants')
  }
  
  // Specific type suggestions
  if (currentCard.type === CardType.Attack) {
    suggestions.push('pair with defensive gear or abilities')
  }
  if (currentCard.type === CardType.Defense) {
    suggestions.push('enhance counter-attack capabilities')
  }
  if (currentCard.type === CardType.Support) {
    suggestions.push('improve utility and healing output')
  }
  
  return suggestions.length > 0 ? suggestions : ['card is well-rounded, maintain balance']
}

// Predict battle matchups
function predictBattleMatchups(card: Card): { strongAgainst: string[]; weakAgainst: string[] } {
  const strongAgainst: string[] = []
  const weakAgainst: string[] = []
  
  // Type-based matchups
  const advantages = typeAdvantages[card.type as CardType] || []
  
  advantages.forEach(advType => {
    strongAgainst.push(`${advType} type cards`)
  })
  
  // Find types that counter this card
  Object.entries(typeAdvantages).forEach(([type, weakTo]) => {
    if (weakTo.includes(card.type as CardType)) {
      weakAgainst.push(`${type} type cards`)
    }
  })
  
  // Stat-based predictions
  if (card.attack > 70) {
    strongAgainst.push('low defense opponents')
  }
  if (card.defense > 70) {
    strongAgainst.push('low attack opponents')
  }
  if (card.attack < 40) {
    weakAgainst.push('high defense opponents')
  }
  if (card.defense < 40) {
    weakAgainst.push('high attack opponents')
  }
  
  return {
    strongAgainst: [...new Set(strongAgainst)].slice(0, 4),
    weakAgainst: [...new Set(weakAgainst)].slice(0, 4),
  }
}

// Generate synergy tips
function generateSynergyTips(card: Card): string[] {
  const tips: string[] = []
  
  if (card.type === CardType.Attack) {
    tips.push('place behind defensive cards for maximum damage output')
    tips.push('combine with support buffs for devastating attacks')
  }
  if (card.type === CardType.Defense) {
    tips.push('position at front to absorb initial damage')
    tips.push('protects weaker allied cards from attacks')
  }
  if (card.type === CardType.Support) {
    tips.push('keep safe until allies need assistance')
    tips.push('timing is crucial - use abilities when most effective')
  }
  if (card.type === CardType.Special) {
    tips.push(' unpredictable - great for mind games')
    tips.push('ability synergies vary based on opponent')
  }
  
  if (card.ability?.toLowerCase().includes('heal')) {
    tips.push('maintain health advantage throughout battle')
  }
  if (card.ability?.toLowerCase().includes('critical')) {
    tips.push('save for high-impact moments')
  }
  if (card.ability?.toLowerCase().includes('shield')) {
    tips.push('use preemptively against strong opponents')
  }
  
  return tips.length > 0 ? tips : ['versatile card suitable for multiple strategies']
}

// Generate educational tips
function generateEducationalTips(card: Card): string[] {
  const tips: string[] = []
  
  tips.push(`${card.rarity} cards have ${rarityMultiplier[card.rarity as CardRarity]}x stat multiplier`)
  
  if (card.type === CardType.Attack) {
    tips.push('Attack cards excel at dealing damage but often sacrifice defense')
    tips.push('Best used against Support and Defense types')
  }
  if (card.type === CardType.Defense) {
    tips.push('Defense cards can absorb significant damage')
    tips.push('Most effective against Special and Attack types')
  }
  if (card.type === CardType.Support) {
    tips.push('Support cards enhance allies rather than directly attacking')
    tips.push('Position strategically to maximize utility')
  }
  if (card.type === CardType.Special) {
    tips.push('Special cards have unique abilities not fitting standard categories')
    tips.push('Read abilities carefully - effects vary greatly')
  }
  
  if (card.ability) {
    tips.push(`Special Ability: ${card.ability}`)
  }
  
  return tips
}

// Suggest optimal team composition
export function suggestTeam(cards: Card[]): TeamAnalysis {
  if (cards.length === 0) {
    return {
      teamName: 'Empty Team',
      synergyScore: 0,
      overallPower: 0,
      strategy: 'No cards selected',
      strengths: [],
      weaknesses: [],
      recommendedPositions: [],
      comboDescriptions: [],
    }
  }
  
  // Sort cards by type
  const attackCards = cards.filter(c => c.type === CardType.Attack)
  const defenseCards = cards.filter(c => c.type === CardType.Defense)
  const supportCards = cards.filter(c => c.type === CardType.Support)
  const specialCards = cards.filter(c => c.type === CardType.Special)
  
  // Calculate team stats
  const totalAttack = cards.reduce((sum, c) => sum + c.attack, 0)
  const totalDefense = cards.reduce((sum, c) => sum + c.defense, 0)
  const avgAttack = totalAttack / cards.length
  const avgDefense = totalDefense / cards.length
  const overallPower = Math.round((avgAttack + avgDefense) / 2)
  
  // Calculate synergy score
  let synergyScore = 50 // base
  
  // Type diversity bonus
  const typeCount = [attackCards.length, defenseCards.length, supportCards.length, specialCards.length]
    .filter(count => count > 0).length
  synergyScore += typeCount * 10
  
  // Balance bonus
  const balance = Math.abs(avgAttack - avgDefense)
  if (balance < 20) synergyScore += 20
  else if (balance < 40) synergyScore += 10
  
  // Rarity synergy
  const hasLegendary = cards.some(c => c.rarity === 'Legendary')
  const hasEpic = cards.some(c => c.rarity === 'Epic')
  if (hasLegendary && hasEpic) synergyScore += 15
  if (cards.length >= 3 && typeCount >= 3) synergyScore += 10
  
  synergyScore = Math.min(100, synergyScore)
  
  // Determine strategy
  let strategy = ''
  if (attackCards.length > defenseCards.length) {
    strategy = ' aggressive offensive strategy - overwhelm opponents with damage'
  } else if (defenseCards.length > attackCards.length) {
    strategy = ' defensive strategy - outlast opponents'
  } else {
    strategy = ' balanced strategy - adaptable to opponent'
  }
  
  // Team strengths
  const strengths: string[] = []
  if (attackCards.length >= 2) strengths.push('strong offensive presence')
  if (defenseCards.length >= 2) strengths.push('excellent damage absorption')
  if (supportCards.length >= 1) strengths.push('battle enhancement capabilities')
  if (typeCount >= 3) strengths.push('type diversity for matchup flexibility')
  
  // Team weaknesses
  const weaknesses: string[] = []
  if (attackCards.length === 0) weaknesses.push('no dedicated damage dealers')
  if (defenseCards.length === 0) weaknesses.push('vulnerable to sustained attacks')
  if (supportCards.length === 0) strengths.push('no healing or buffs')
  if (cards.length < 3) weaknesses.push('small team size limits strategy')
  
  // Recommended positions
  const recommendedPositions = cards.map((card, index) => {
    let position: 'front' | 'middle' | 'back' = 'middle'
    let role = 'versatile'
    
    if (card.type === CardType.Defense) {
      position = 'front'
      role = 'tank/damage absorber'
    } else if (card.type === CardType.Support) {
      position = 'back'
      role = 'support/enhancer'
    } else if (card.type === CardType.Attack) {
      position = index === 0 ? 'front' : 'middle'
      role = 'damage dealer'
    } else {
      role = 'specialist'
    }
    
    return { cardId: card.id, position, role }
  })
  
  // Combo descriptions
  const comboDescriptions: string[] = []
  if (defenseCards.length >= 1 && attackCards.length >= 1) {
    comboDescriptions.push('Defense absorbs hits while Attack deals damage')
  }
  if (supportCards.length >= 1 && attackCards.length >= 1) {
    comboDescriptions.push('Support buffs Attack for critical strikes')
  }
  if (specialCards.length >= 1) {
    comboDescriptions.push('Special cards provide unpredictable tactical options')
  }
  
  // Generate team name
  const teamName = generateTeamName(cards)
  
  return {
    teamName,
    synergyScore,
    overallPower,
    strategy,
    strengths,
    weaknesses,
    recommendedPositions,
    comboDescriptions,
  }
}

// Generate a creative team name
function generateTeamName(cards: Card[]): string {
  const prefixes = ['Elite', 'Shadow', 'Golden', 'Mystic', 'Thunder', 'Frost', 'Inferno', 'Storm']
  const suffixes = ['Legion', 'Squad', 'Force', 'Guard', 'Council', 'Order', 'Alliance', 'Tribe']
  
  const avgPower = cards.reduce((sum, c) => sum + c.attack + c.defense, 0) / (cards.length * 2)
  
  let prefix = prefixes[Math.floor(avgPower / 30)]
  let suffix = suffixes[cards.length % suffixes.length]
  
  if (cards.some(c => c.rarity === 'Legendary')) {
    prefix = 'Legendary ' + prefix
  }
  
  return `${prefix} ${suffix}`
}

// Predict battle outcome
export function predictPerformance(card: Card): BattlePrediction {
  const opponentAttack = 50 + Math.random() * 40
  const opponentDefense = 50 + Math.random() * 40
  
  const playerEffectiveAttack = card.attack * (rarityMultiplier[card.rarity as CardRarity])
  const playerEffectiveDefense = card.defense * (rarityMultiplier[card.rarity as CardRarity])
  
  // Calculate base win probability
  const powerDiff = (playerEffectiveAttack + playerEffectiveDefense) - (opponentAttack + opponentDefense)
  let winProbability = 50 + (powerDiff / 2)
  
  // Type advantage adjustment
  if (typeAdvantages[card.type as CardType]?.some(t => t === 'Defense')) {
    winProbability += 5
  }
  
  winProbability = Math.max(5, Math.min(95, winProbability))
  
  // Determine winner
  let winner: 'player' | 'opponent' | 'draw' = 'player'
  if (winProbability < 40) winner = 'opponent'
  else if (winProbability >= 40 && winProbability <= 60) winner = Math.random() > 0.5 ? 'player' : 'opponent'
  
  // Factors
  const factors: BattlePrediction['factors'] = []
  
  factors.push({
    factor: 'Attack Power',
    advantage: card.attack > opponentAttack ? 'player' : 'opponent',
    impact: Math.abs(card.attack - opponentAttack),
  })
  
  factors.push({
    factor: 'Defense Stats',
    advantage: card.defense > opponentDefense ? 'player' : 'opponent',
    impact: Math.abs(card.defense - opponentDefense),
  })
  
  factors.push({
    factor: 'Card Rarity',
    advantage: 'player',
    impact: rarityMultiplier[card.rarity as CardRarity] * 10,
  })
  
  if (card.ability) {
    factors.push({
      factor: 'Special Ability',
      advantage: 'player',
      impact: 15,
    })
  }
  
  // Predicted damage
  const playerToOpponent = Math.max(1, card.attack - opponentDefense / 2)
  const opponentToPlayer = Math.max(1, opponentAttack - playerEffectiveDefense / 2)
  
  // Key insights
  const keyInsights: string[] = []
  if (card.attack > opponentDefense) {
    keyInsights.push('your attack can penetrate opponent defense')
  }
  if (card.defense > opponentAttack) {
    keyInsights.push('you can effectively block opponent attacks')
  }
  if (card.ability) {
    keyInsights.push('special ability could be decisive factor')
  }
  
  // Recommended strategy
  let recommendedStrategy = ''
  if (card.type === CardType.Attack) {
    recommendedStrategy = 'focus on dealing damage quickly before opponent can respond'
  } else if (card.type === CardType.Defense) {
    recommendedStrategy = 'let opponent attack first, then capitalize on their weakened state'
  } else if (card.type === CardType.Support) {
    recommendedStrategy = 'support your team at critical moments for maximum impact'
  } else {
    recommendedStrategy = 'adapt your strategy based on opponent type and abilities'
  }
  
  return {
    winner,
    winProbability: Math.round(winProbability),
    factors,
    predictedDamage: {
      playerToOpponent: Math.round(playerToOpponent),
      opponentToPlayer: Math.round(opponentToPlayer),
    },
    keyInsights,
    recommendedStrategy,
  }
}

// Predict direct battle between two cards
export function predictBattle(playerCard: Card, opponentCard: Card): BattlePrediction {
  const playerMult = rarityMultiplier[playerCard.rarity as CardRarity]
  const opponentMult = rarityMultiplier[opponentCard.rarity as CardRarity]
  
  const playerAttack = playerCard.attack * playerMult
  const playerDefense = playerCard.defense * playerMult
  const opponentAttack = opponentCard.attack * opponentMult
  const opponentDefense = opponentCard.defense * opponentMult
  
  // Calculate win probability
  const playerPower = playerAttack + playerDefense
  const opponentPower = opponentAttack + opponentDefense
  let winProbability = (playerPower / (playerPower + opponentPower)) * 100
  
  // Type advantages
  if (typeAdvantages[playerCard.type as CardType]?.includes(opponentCard.type as CardType)) {
    winProbability += 15
  }
  if (typeAdvantages[opponentCard.type as CardType]?.includes(playerCard.type as CardType)) {
    winProbability -= 15
  }
  
  // Ability bonus
  if (playerCard.ability && !opponentCard.ability) {
    winProbability += 10
  } else if (!playerCard.ability && opponentCard.ability) {
    winProbability -= 10
  }
  
  winProbability = Math.max(5, Math.min(95, winProbability))
  
  const winner: 'player' | 'opponent' | 'draw' = 
    winProbability > 55 ? 'player' : winProbability < 45 ? 'opponent' : 'draw'
  
  // Factors
  const factors: BattlePrediction['factors'] = [
    {
      factor: 'Attack Comparison',
      advantage: playerCard.attack > opponentCard.attack ? 'player' : 'opponent',
      impact: Math.abs(playerCard.attack - opponentCard.attack) * playerMult,
    },
    {
      factor: 'Defense Comparison',
      advantage: playerCard.defense > opponentCard.defense ? 'player' : 'opponent',
      impact: Math.abs(playerCard.defense - opponentCard.defense) * playerMult,
    },
    {
      factor: 'Type Matchup',
      advantage: typeAdvantages[playerCard.type as CardType]?.includes(opponentCard.type as CardType) 
        ? 'player' 
        : typeAdvantages[opponentCard.type as CardType]?.includes(playerCard.type as CardType)
          ? 'opponent'
          : 'neutral',
      impact: 20,
    },
    {
      factor: 'Rarity Advantage',
      advantage: playerMult > opponentMult ? 'player' : playerMult < opponentMult ? 'opponent' : 'neutral',
      impact: Math.abs(playerMult - opponentMult) * 10,
    },
    {
      factor: 'Special Ability',
      advantage: (playerCard.ability ? 1 : 0) > (opponentCard.ability ? 1 : 0) ? 'player' 
        : (playerCard.ability ? 1 : 0) < (opponentCard.ability ? 1 : 0) ? 'opponent' : 'neutral',
      impact: 15,
    },
  ]
  
  // Predicted damage
  const playerToOpponent = Math.max(1, Math.round(playerAttack - opponentDefense / 2))
  const opponentToPlayer = Math.max(1, Math.round(opponentAttack - playerDefense / 2))
  
  // Key insights
  const keyInsights: string[] = []
  if (playerToOpponent > opponentToPlayer) {
    keyInsights.push('you deal more damage than you receive')
  } else if (playerToOpponent < opponentToPlayer) {
    keyInsights.push('you will take more damage than you deal - be cautious')
  }
  
  if (playerCard.ability) {
    keyInsights.push(`your ability "${playerCard.ability}" could turn the tide`)
  }
  
  if (typeAdvantages[playerCard.type as CardType]?.includes(opponentCard.type as CardType)) {
    keyInsights.push(`your ${playerCard.type} type has type advantage over ${opponentCard.type}`)
  }
  
  // Recommended strategy
  let recommendedStrategy = ''
  if (playerCard.type === CardType.Attack && playerCard.attack > opponentCard.defense) {
    recommendedStrategy = 'overwhelm with aggressive attacks - your damage exceeds their defense'
  } else if (playerCard.type === CardType.Defense && playerCard.defense > opponentCard.attack) {
    recommendedStrategy = 'play defensively - you can absorb their attacks effectively'
  } else if (playerCard.ability) {
    recommendedStrategy = 'save your special ability for the decisive moment'
  } else {
    recommendedStrategy = 'focus on exploiting type advantages and stat differences'
  }
  
  return {
    winner,
    winProbability: Math.round(winProbability),
    factors,
    predictedDamage: { playerToOpponent, opponentToPlayer },
    keyInsights,
    recommendedStrategy,
  }
}
