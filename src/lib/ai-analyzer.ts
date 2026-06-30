import { Card, CardRarity } from '@/types'

type CardAnalysisType = 'Attack' | 'Defense' | 'Support' | 'Special'

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

export interface TeamAnalysis {
  teamName: string
  synergyScore: number
  overallPower: number
  strategy: string
  strengths: string[]
  weaknesses: string[]
  recommendedPositions: {
    cardId: bigint
    position: 'front' | 'middle' | 'back'
    role: string
  }[]
  comboDescriptions: string[]
}

export interface BattlePrediction {
  winner: 'player' | 'opponent' | 'draw'
  winProbability: number
  factors: {
    factor: string
    advantage: 'player' | 'opponent' | 'neutral'
    impact: number
  }[]
  predictedDamage: {
    playerToOpponent: number
    opponentToPlayer: number
  }
  keyInsights: string[]
  recommendedStrategy: string
}

const rarityMultiplier: Record<CardRarity, number> = {
  common: 1.0,
  rare: 1.3,
  epic: 1.6,
  legendary: 2.0,
}

function getCardAnalysisType(card: Card): CardAnalysisType {
  if (card.attack >= 70 && card.defense < 50) return 'Attack'
  if (card.defense >= 70 && card.attack < 50) return 'Defense'
  if (card.specialAbility && card.attack >= 50) return 'Special'
  return 'Support'
}

const typeAdvantages: Record<CardAnalysisType, CardAnalysisType[]> = {
  Attack: ['Defense', 'Support'],
  Defense: ['Special', 'Attack'],
  Support: ['Attack', 'Special'],
  Special: ['Support', 'Defense'],
}

export function analyzeCard(card: Card): CardAnalysis {
  const rarityMult = rarityMultiplier[card.rarity as CardRarity]
  const attackRating = Math.min(100, Math.round((card.attack / 100) * 100 * rarityMult))
  const defenseRating = Math.min(100, Math.round((card.defense / 100) * 100 * rarityMult))
  const baseOverall = (attackRating + defenseRating) / 2
  const abilityBonus = card.specialAbility ? 15 : 0
  const overallScore = Math.min(100, Math.round(baseOverall + abilityBonus))
  const potential = determinePotential(card, overallScore)
  const strengths = identifyStrengths(card, attackRating, defenseRating)
  const weaknesses = identifyWeaknesses(card, attackRating, defenseRating)
  const bestTeammates = suggestBestTeammates(card)
  const upgradeSuggestions = suggestUpgrades(card)
  const battlePrediction = predictBattleMatchups(card)
  const synergyTips = generateSynergyTips(card)
  const educationalTips = generateEducationalTips(card)
  return { overallScore, attackRating, defenseRating, potential, strengths, weaknesses, bestTeammates, upgradeSuggestions, battlePrediction, synergyTips, educationalTips }
}

function determinePotential(card: Card, overallScore: number): string {
  if (overallScore >= 85) return 'S-Tier Competitive Play'
  if (overallScore >= 70) return 'A-Tier Strong Performer'
  if (overallScore >= 55) return 'B-Tier Solid Choice'
  if (overallScore >= 40) return 'C-Tier Average Card'
  return 'D-Tier Needs Improvement'
}

function identifyStrengths(card: Card, attackRating: number, defenseRating: number): string[] {
  const strengths: string[] = []
  if (attackRating >= 80) strengths.push(' exceptional attack power (' + card.attack + ')')
  if (defenseRating >= 80) strengths.push(' outstanding defensive capability (' + card.defense + ')')
  if (card.specialAbility) strengths.push(' possesses a special ability that can turn the tide of battle')
  if (card.rarity === 'legendary') strengths.push(' Legendary rarity with maximum stat multipliers')
  if (card.rarity === 'epic') strengths.push(' Epic rarity with strong stat bonuses')
  const cardType = getCardAnalysisType(card)
  if (cardType === 'Attack' && attackRating >= 60) strengths.push(' high damage dealer ideal for aggressive strategies')
  if (cardType === 'Defense' && defenseRating >= 60) strengths.push(' excellent tank capable of absorbing damage')
  if (cardType === 'Support' && card.specialAbility) strengths.push(' support capabilities enhance team performance')
  if (cardType === 'Special') strengths.push(' unpredictable special moves create tactical opportunities')
  return strengths.length > 0 ? strengths : [' balanced stats suitable for various strategies']
}

function identifyWeaknesses(card: Card, attackRating: number, defenseRating: number): string[] {
  const weaknesses: string[] = []
  if (attackRating < 40) weaknesses.push(' relatively low attack power')
  if (defenseRating < 40) weaknesses.push(' fragile defensive stats')
  if (!card.specialAbility) weaknesses.push(' lacks special ability for tactical advantage')
  if (card.rarity === 'common') weaknesses.push(' common rarity limits maximum potential')
  const cardType = getCardAnalysisType(card)
  if (cardType === 'Attack' && defenseRating < 50) weaknesses.push(' glass cannon vulnerability - high risk/reward')
  if (cardType === 'Defense' && attackRating < 50) weaknesses.push(' limited offensive options')
  if (cardType === 'Support' && attackRating < 30) weaknesses.push(' dependent on team for damage output')
  return weaknesses.length > 0 ? weaknesses : [' no significant weaknesses identified']
}

function suggestBestTeammates(card: Card): string[] {
  const teammates: string[] = []
  const cardType = getCardAnalysisType(card)
  if (cardType === 'Attack') {
    teammates.push('Guardian types to absorb damage while dealing damage')
    teammates.push('Support cards to enhance attack power')
  }
  if (cardType === 'Defense') {
    teammates.push('High damage Attack cards to capitalize on created opportunities')
    teammates.push('Support cards for healing and buffs')
  }
  if (cardType === 'Support') {
    teammates.push('Balanced cards that benefit from enhancement')
    teammates.push('Tank cards that can protect support')
  }
  if (cardType === 'Special') {
    teammates.push('versatile cards that adapt to various situations')
    teammates.push('cards with complementary abilities')
  }
  if (card.rarity === 'legendary' || card.rarity === 'epic') teammates.push('cards of similar ' + card.rarity + ' caliber for balanced team')
  return [...new Set(teammates)].slice(0, 4)
}

function suggestUpgrades(currentCard: Card): string[] {
  const suggestions: string[] = []
  const cardType = getCardAnalysisType(currentCard)
  if (currentCard.attack < 50) suggestions.push('focus on increasing attack power through leveling')
  if (currentCard.defense < 50) suggestions.push('improve defense stats for better survivability')
  if (!currentCard.specialAbility) suggestions.push('acquire or unlock special abilities')
  if (currentCard.rarity === 'common') suggestions.push('consider obtaining higher rarity variants')
  if (cardType === 'Attack') suggestions.push('pair with defensive gear or abilities')
  if (cardType === 'Defense') suggestions.push('enhance counter-attack capabilities')
  if (cardType === 'Support') suggestions.push('improve utility and healing output')
  return suggestions.length > 0 ? suggestions : ['card is well-rounded, maintain balance']
}

function predictBattleMatchups(card: Card): { strongAgainst: string[]; weakAgainst: string[] } {
  const strongAgainst: string[] = []
  const weakAgainst: string[] = []
  const cardType = getCardAnalysisType(card)
  const advantages = typeAdvantages[cardType] || []
  advantages.forEach(advType => { strongAgainst.push(advType + ' type cards') })
  Object.entries(typeAdvantages).forEach(([type, weakTo]) => {
    if (weakTo.includes(cardType)) { weakAgainst.push(type + ' type cards') }
  })
  if (card.attack > 70) strongAgainst.push('low defense opponents')
  if (card.defense > 70) strongAgainst.push('low attack opponents')
  if (card.attack < 40) weakAgainst.push('high defense opponents')
  if (card.defense < 40) weakAgainst.push('high attack opponents')
  return { strongAgainst: [...new Set(strongAgainst)].slice(0, 4), weakAgainst: [...new Set(weakAgainst)].slice(0, 4) }
}

function generateSynergyTips(card: Card): string[] {
  const tips: string[] = []
  const cardType = getCardAnalysisType(card)
  if (cardType === 'Attack') { tips.push('place behind defensive cards for maximum damage output'); tips.push('combine with support buffs for devastating attacks') }
  if (cardType === 'Defense') { tips.push('position at front to absorb initial damage'); tips.push('protects weaker allied cards from attacks') }
  if (cardType === 'Support') { tips.push('keep safe until allies need assistance'); tips.push('timing is crucial - use abilities when most effective') }
  if (cardType === 'Special') { tips.push(' unpredictable - great for mind games'); tips.push('ability synergies vary based on opponent') }
  if (card.specialAbility?.toLowerCase().includes('heal')) tips.push('maintain health advantage throughout battle')
  if (card.specialAbility?.toLowerCase().includes('critical')) tips.push('save for high-impact moments')
  if (card.specialAbility?.toLowerCase().includes('shield')) tips.push('use preemptively against strong opponents')
  return tips.length > 0 ? tips : ['versatile card suitable for multiple strategies']
}

function generateEducationalTips(card: Card): string[] {
  const tips: string[] = []
  const cardType = getCardAnalysisType(card)
  tips.push(card.rarity + ' cards have ' + rarityMultiplier[card.rarity] + 'x stat multiplier')
  if (cardType === 'Attack') { tips.push('Attack cards excel at dealing damage but often sacrifice defense'); tips.push('Best used against Support and Defense types') }
  if (cardType === 'Defense') { tips.push('Defense cards can absorb significant damage'); tips.push('Most effective against Special and Attack types') }
  if (cardType === 'Support') { tips.push('Support cards enhance allies rather than directly attacking'); tips.push('Position strategically to maximize utility') }
  if (cardType === 'Special') { tips.push('Special cards have unique abilities not fitting standard categories'); tips.push('Read abilities carefully - effects vary greatly') }
  if (card.specialAbility) tips.push('Special Ability: ' + card.specialAbility)
  return tips
}

export function suggestTeam(cards: Card[]): TeamAnalysis {
  if (cards.length === 0) {
    return { teamName: 'Empty Team', synergyScore: 0, overallPower: 0, strategy: 'No cards selected', strengths: [], weaknesses: [], recommendedPositions: [], comboDescriptions: [] }
  }
  const attackCards = cards.filter(c => getCardAnalysisType(c) === 'Attack')
  const defenseCards = cards.filter(c => getCardAnalysisType(c) === 'Defense')
  const supportCards = cards.filter(c => getCardAnalysisType(c) === 'Support')
  const specialCards = cards.filter(c => getCardAnalysisType(c) === 'Special')
  const totalAttack = cards.reduce((sum, c) => sum + c.attack, 0)
  const totalDefense = cards.reduce((sum, c) => sum + c.defense, 0)
  const avgAttack = totalAttack / cards.length
  const avgDefense = totalDefense / cards.length
  const overallPower = Math.round((avgAttack + avgDefense) / 2)
  let synergyScore = 50
  const typeCount = [attackCards.length, defenseCards.length, supportCards.length, specialCards.length].filter(count => count > 0).length
  synergyScore += typeCount * 10
  const balance = Math.abs(avgAttack - avgDefense)
  if (balance < 20) synergyScore += 20
  else if (balance < 40) synergyScore += 10
  const hasLegendary = cards.some(c => c.rarity === 'legendary')
  const hasEpic = cards.some(c => c.rarity === 'epic')
  if (hasLegendary && hasEpic) synergyScore += 15
  if (cards.length >= 3 && typeCount >= 3) synergyScore += 10
  synergyScore = Math.min(100, synergyScore)
  let strategy = ''
  if (attackCards.length > defenseCards.length) { strategy = ' aggressive offensive strategy - overwhelm opponents with damage' }
  else if (defenseCards.length > attackCards.length) { strategy = ' defensive strategy - outlast opponents' }
  else { strategy = ' balanced strategy - adaptable to opponent' }
  const strengths: string[] = []
  if (attackCards.length >= 2) strengths.push('strong offensive presence')
  if (defenseCards.length >= 2) strengths.push('excellent damage absorption')
  if (supportCards.length >= 1) strengths.push('battle enhancement capabilities')
  if (typeCount >= 3) strengths.push('type diversity for matchup flexibility')
  const weaknesses: string[] = []
  if (attackCards.length === 0) weaknesses.push('no dedicated damage dealers')
  if (defenseCards.length === 0) weaknesses.push('vulnerable to sustained attacks')
  if (cards.length < 3) weaknesses.push('small team size limits strategy')
  const recommendedPositions = cards.map((card, index) => {
    let position: 'front' | 'middle' | 'back' = 'middle'
    let role = 'versatile'
    const cardType = getCardAnalysisType(card)
    if (cardType === 'Defense') { position = 'front'; role = 'tank/damage absorber' }
    else if (cardType === 'Support') { position = 'back'; role = 'support/enhancer' }
    else if (cardType === 'Attack') { position = index === 0 ? 'front' : 'middle'; role = 'damage dealer' }
    else { role = 'specialist' }
    return { cardId: card.id, position, role }
  })
  const comboDescriptions: string[] = []
  if (defenseCards.length >= 1 && attackCards.length >= 1) comboDescriptions.push('Defense absorbs hits while Attack deals damage')
  if (supportCards.length >= 1 && attackCards.length >= 1) comboDescriptions.push('Support buffs Attack for critical strikes')
  if (specialCards.length >= 1) comboDescriptions.push('Special cards provide unpredictable tactical options')
  const prefixes = ['Elite', 'Shadow', 'Golden', 'Mystic', 'Thunder', 'Frost', 'Inferno', 'Storm']
  const suffixes = ['Legion', 'Squad', 'Force', 'Guard', 'Council', 'Order', 'Alliance', 'Tribe']
  const avgPower = cards.reduce((sum, c) => sum + c.attack + c.defense, 0) / (cards.length * 2)
  let prefix = prefixes[Math.floor(avgPower / 30)]
  let suffix = suffixes[cards.length % suffixes.length]
  if (cards.some(c => c.rarity === 'legendary')) { prefix = 'Legendary ' + prefix }
  const teamName = prefix + ' ' + suffix
  return { teamName, synergyScore, overallPower, strategy, strengths, weaknesses, recommendedPositions, comboDescriptions }
}

export function predictPerformance(card: Card): BattlePrediction {
  const opponentAttack = 50 + Math.random() * 40
  const opponentDefense = 50 + Math.random() * 40
  const playerEffectiveAttack = card.attack * (rarityMultiplier[card.rarity as CardRarity])
  const playerEffectiveDefense = card.defense * (rarityMultiplier[card.rarity as CardRarity])
  const powerDiff = (playerEffectiveAttack + playerEffectiveDefense) - (opponentAttack + opponentDefense)
  let winProbability = 50 + (powerDiff / 2)
  const cardType = getCardAnalysisType(card)
  if (typeAdvantages[cardType]?.some(t => t === 'Defense')) { winProbability += 5 }
  winProbability = Math.max(5, Math.min(95, winProbability))
  let winner: 'player' | 'opponent' | 'draw' = 'player'
  if (winProbability < 40) winner = 'opponent'
  else if (winProbability >= 40 && winProbability <= 60) winner = Math.random() > 0.5 ? 'player' : 'opponent'
  const factors: BattlePrediction['factors'] = []
  factors.push({ factor: 'Attack Power', advantage: card.attack > opponentAttack ? 'player' : 'opponent', impact: Math.abs(card.attack - opponentAttack) })
  factors.push({ factor: 'Defense Stats', advantage: card.defense > opponentDefense ? 'player' : 'opponent', impact: Math.abs(card.defense - opponentDefense) })
  factors.push({ factor: 'Card Rarity', advantage: 'player', impact: rarityMultiplier[card.rarity as CardRarity] * 10 })
  if (card.specialAbility) { factors.push({ factor: 'Special Ability', advantage: 'player', impact: 15 }) }
  const playerToOpponent = Math.max(1, card.attack - opponentDefense / 2)
  const opponentToPlayer = Math.max(1, opponentAttack - playerEffectiveDefense / 2)
  const keyInsights: string[] = []
  if (card.attack > opponentDefense) keyInsights.push('your attack can penetrate opponent defense')
  if (card.defense > opponentAttack) keyInsights.push('you can effectively block opponent attacks')
  if (card.specialAbility) keyInsights.push('special ability could be decisive factor')
  let recommendedStrategy = ''
  if (cardType === 'Attack') { recommendedStrategy = 'focus on dealing damage quickly before opponent can respond' }
  else if (cardType === 'Defense') { recommendedStrategy = 'let opponent attack first, then capitalize on their weakened state' }
  else if (cardType === 'Support') { recommendedStrategy = 'support your team at critical moments for maximum impact' }
  else { recommendedStrategy = 'adapt your strategy based on opponent type and abilities' }
  return { winner, winProbability: Math.round(winProbability), factors, predictedDamage: { playerToOpponent: Math.round(playerToOpponent), opponentToPlayer: Math.round(opponentToPlayer) }, keyInsights, recommendedStrategy }
}

export function predictBattle(playerCard: Card, opponentCard: Card): BattlePrediction {
  const playerMult = rarityMultiplier[playerCard.rarity]
  const opponentMult = rarityMultiplier[opponentCard.rarity]
  const playerAttack = playerCard.attack * playerMult
  const playerDefense = playerCard.defense * playerMult
  const opponentAttack = opponentCard.attack * opponentMult
  const opponentDefense = opponentCard.defense * opponentMult
  const playerPower = playerAttack + playerDefense
  const opponentPower = opponentAttack + opponentDefense
  let winProbability = (playerPower / (playerPower + opponentPower)) * 100
  const playerCardType = getCardAnalysisType(playerCard)
  const opponentCardType = getCardAnalysisType(opponentCard)
  if (typeAdvantages[playerCardType]?.includes(opponentCardType)) { winProbability += 15 }
  if (typeAdvantages[opponentCardType]?.includes(playerCardType)) { winProbability -= 15 }
  if (playerCard.specialAbility && !opponentCard.specialAbility) { winProbability += 10 }
  else if (!playerCard.specialAbility && opponentCard.specialAbility) { winProbability -= 10 }
  winProbability = Math.max(5, Math.min(95, winProbability))
  const winner: 'player' | 'opponent' | 'draw' = winProbability > 55 ? 'player' : winProbability < 45 ? 'opponent' : 'draw'
  const factors: BattlePrediction['factors'] = [
    { factor: 'Attack Comparison', advantage: playerCard.attack > opponentCard.attack ? 'player' : 'opponent', impact: Math.abs(playerCard.attack - opponentCard.attack) * playerMult },
    { factor: 'Defense Comparison', advantage: playerCard.defense > opponentCard.defense ? 'player' : 'opponent', impact: Math.abs(playerCard.defense - opponentCard.defense) * playerMult },
    { factor: 'Type Matchup', advantage: typeAdvantages[playerCardType]?.includes(opponentCardType) ? 'player' : typeAdvantages[opponentCardType]?.includes(playerCardType) ? 'opponent' : 'neutral', impact: 20 },
    { factor: 'Rarity Advantage', advantage: playerMult > opponentMult ? 'player' : playerMult < opponentMult ? 'opponent' : 'neutral', impact: Math.abs(playerMult - opponentMult) * 10 },
    { factor: 'Special Ability', advantage: (playerCard.specialAbility ? 1 : 0) > (opponentCard.specialAbility ? 1 : 0) ? 'player' : (playerCard.specialAbility ? 1 : 0) < (opponentCard.specialAbility ? 1 : 0) ? 'opponent' : 'neutral', impact: 15 },
  ]
  const playerToOpponent = Math.max(1, Math.round(playerAttack - opponentDefense / 2))
  const opponentToPlayer = Math.max(1, Math.round(opponentAttack - playerDefense / 2))
  const keyInsights: string[] = []
  if (playerToOpponent > opponentToPlayer) { keyInsights.push('you deal more damage than you receive') }
  else if (playerToOpponent < opponentToPlayer) { keyInsights.push('you will take more damage than you deal - be cautious') }
  if (playerCard.specialAbility) { keyInsights.push('your ability \"' + playerCard.specialAbility + '\" could turn the tide') }
  if (typeAdvantages[playerCardType]?.includes(opponentCardType)) { keyInsights.push('your ' + playerCardType + ' type has type advantage over ' + opponentCardType) }
  let recommendedStrategy = ''
  const playerType = getCardAnalysisType(playerCard)
  if (playerType === 'Attack' && playerCard.attack > opponentCard.defense) { recommendedStrategy = 'overwhelm with aggressive attacks - your damage exceeds their defense' }
  else if (playerType === 'Defense' && playerCard.defense > opponentCard.attack) { recommendedStrategy = 'play defensively - you can absorb their attacks effectively' }
  else if (playerCard.specialAbility) { recommendedStrategy = 'save your special ability for the decisive moment' }
  else { recommendedStrategy = 'focus on exploiting type advantages and stat differences' }
  return { winner, winProbability: Math.round(winProbability), factors, predictedDamage: { playerToOpponent, opponentToPlayer }, keyInsights, recommendedStrategy }
}
