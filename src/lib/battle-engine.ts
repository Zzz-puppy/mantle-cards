import { Card } from '@/types/card'
import type { BattleState, BattleResult, BattleLogEntry, DifficultyLevel } from '@/types/battle'
import { AIProfile, getAIProfile, analyzeTradingPattern, selectBestMatchingAI } from './ai-profiles'

export interface BattleEngineConfig {
  maxRounds: number
  baseHealth: number
  criticalMultiplier: number
  abilityBoost: number
}

export const DEFAULT_BATTLE_CONFIG: BattleEngineConfig = {
  maxRounds: 3,
  baseHealth: 100,
  criticalMultiplier: 1.5,
  abilityBoost: 1.25,
}

export class BattleEngine {
  private config: BattleEngineConfig
  private aiProfile: AIProfile | null = null

  constructor(config: Partial<BattleEngineConfig> = {}) {
    this.config = { ...DEFAULT_BATTLE_CONFIG, ...config }
  }

  setAIProfile(profile: AIProfile) {
    this.aiProfile = profile
  }

  async fetchUserTradingPattern(address: `0x${string}`): Promise<{ value: number; frequency: number }[]> {
    // TODO: Fetch real transaction history from on-chain data
    // This would integrate with mantle-data.ts to get actual wallet transactions
    return []
  }

  async analyzeUserAndSelectAI(address: `0x${string}`): Promise<AIProfile> {
    const transactions = await this.fetchUserTradingPattern(address)
    const pattern = analyzeTradingPattern(transactions)
    const selectedAI = selectBestMatchingAI(pattern)
    this.aiProfile = selectedAI
    return selectedAI
  }

  createInitialBattleState(
    playerCards: Card[],
    opponentCards: Card[],
    aiProfile?: AIProfile
  ): BattleState {
    return {
      player: {
        cards: [...playerCards],
        selectedCard: null,
        health: this.config.baseHealth,
      },
      opponent: {
        cards: [...opponentCards],
        selectedCard: null,
        health: this.config.baseHealth,
      },
      turn: 'player',
      round: 1,
      maxRounds: this.config.maxRounds,
      status: 'selecting',
      winner: null,
    }
  }

  calculateDamage(attacker: Card, defender: Card, isCritical: boolean = false): number {
    const baseDamage = attacker.attack - defender.defense / 2
    const modifier = isCritical ? this.config.criticalMultiplier : 1
    const finalDamage = Math.max(1, Math.floor(baseDamage * modifier))
    return finalDamage
  }

  checkCriticalHit(attacker: Card): boolean {
    const critChance = 0.1 + (attacker.attack / 1000)
    return Math.random() < critChance
  }

  shouldUseAbility(card: Card, battleState: BattleState): boolean {
    if (!this.aiProfile) return Math.random() > 0.5

    const riskTolerance = this.aiProfile.riskTolerance
    const healthPercentage = (battleState.player.health / this.config.baseHealth) * 100

    if (healthPercentage < 30) {
      return riskTolerance > 0.3
    }

    if (card.attack > 80) {
      return riskTolerance > 0.5
    }

    return Math.random() < riskTolerance
  }

  selectAICard(cards: Card[], difficulty: DifficultyLevel): Card {
    switch (difficulty) {
      case 'easy':
        return this.selectRandomCard(cards)
      case 'medium':
        return this.selectMediumCard(cards)
      case 'hard':
        return this.selectOptimalCard(cards)
      default:
        return this.selectMediumCard(cards)
    }
  }

  private selectRandomCard(cards: Card[]): Card {
    return cards[Math.floor(Math.random() * cards.length)]
  }

  private selectMediumCard(cards: Card[]): Card {
    const attackCards = cards.filter(c => c.attack > 50)
    if (attackCards.length > 0 && Math.random() > 0.4) {
      return attackCards[Math.floor(Math.random() * attackCards.length)]
    }
    return cards[Math.floor(Math.random() * cards.length)]
  }

  private selectOptimalCard(cards: Card[]): Card {
    if (!this.aiProfile) {
      return cards.reduce((best, card) => 
        card.attack > best.attack ? card : best, cards[0])
    }

    const preferredTypes = this.aiProfile.preferredCardTypes

    const preferredCards = cards.filter(card => 
      preferredTypes.some(type => 
        card.specialAbility?.toLowerCase().includes(type.toLowerCase()) ||
        card.name.toLowerCase().includes(type)
      )
    )

    if (preferredCards.length > 0) {
      return preferredCards.reduce((best, card) =>
        card.attack > best.attack ? card : best, preferredCards[0])
    }

    return cards.reduce((best, card) =>
      card.attack > best.attack ? card : best, cards[0])
  }

  executeAITurn(battleState: BattleState): { card: Card; useAbility: boolean } {
    const difficulty = this.aiProfile?.difficulty || 'medium'
    const selectedCard = this.selectAICard(battleState.opponent.cards, difficulty)
    const useAbility = this.shouldUseAbility(selectedCard, battleState)

    return { card: selectedCard, useAbility }
  }

  processRound(
    battleState: BattleState,
    playerCard: Card,
    opponentCard: Card
  ): {
    updatedState: BattleState
    playerDamage: number
    opponentDamage: number
    logs: BattleLogEntry[]
  } {
    const logs: BattleLogEntry[] = []
    let playerDamage = 0
    let opponentDamage = 0

    const playerCrit = this.checkCriticalHit(playerCard)
    const opponentCrit = this.checkCriticalHit(opponentCard)

    opponentDamage = this.calculateDamage(playerCard, opponentCard, playerCrit)
    logs.push({
      round: battleState.round,
      action: 'damage',
      actor: 'player',
      cardName: playerCard.name,
      message: playerCrit 
        ? `${playerCard.name} CRITICAL HIT for ${opponentDamage} damage!`
        : `${playerCard.name} attacks ${opponentCard.name} for ${opponentDamage} damage!`,
      damage: opponentDamage,
    })

    playerDamage = this.calculateDamage(opponentCard, playerCard, opponentCrit)
    logs.push({
      round: battleState.round,
      action: 'damage',
      actor: 'opponent',
      cardName: opponentCard.name,
      message: opponentCrit
        ? `${opponentCard.name} CRITICAL HIT for ${playerDamage} damage!`
        : `${opponentCard.name} attacks ${playerCard.name} for ${playerDamage} damage!`,
      damage: playerDamage,
    })

    const newPlayerHealth = Math.max(0, battleState.player.health - playerDamage)
    const newOpponentHealth = Math.max(0, battleState.opponent.health - opponentDamage)

    const newState: BattleState = {
      ...battleState,
      player: {
        ...battleState.player,
        health: newPlayerHealth,
        selectedCard: null,
      },
      opponent: {
        ...battleState.opponent,
        health: newOpponentHealth,
        selectedCard: null,
      },
      round: battleState.round + 1,
      status: newPlayerHealth === 0 || newOpponentHealth === 0 ? 'finished' : 'selecting',
      winner: newOpponentHealth === 0 ? 'player' : newPlayerHealth === 0 ? 'opponent' : null,
    }

    if (newState.winner) {
      logs.push({
        round: battleState.round,
        action: newState.winner === 'player' ? 'victory' : 'defeat',
        actor: newState.winner,
        cardName: '',
        message: newState.winner === 'player' ? 'Victory!' : 'Defeat!',
      })
    }

    return { updatedState: newState, playerDamage, opponentDamage, logs }
  }

  determineWinner(battleState: BattleState): 'player' | 'opponent' | 'draw' {
    if (battleState.player.health === battleState.opponent.health) {
      return 'draw'
    }
    return battleState.player.health > battleState.opponent.health ? 'player' : 'opponent'
  }

  createBattleResult(
    battleState: BattleState,
    playerAddress: string,
    opponentAddress: string,
    playerCard: Card,
    opponentCard: Card,
    playerDamage: number,
    opponentDamage: number
  ): BattleResult {
    const winner = this.determineWinner(battleState)
    
    return {
      id: `battle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      player: playerAddress,
      opponent: opponentAddress,
      playerCard,
      opponentCard,
      playerDamage,
      opponentDamage,
      winner: winner === 'draw' ? 'opponent' : winner,
      timestamp: Date.now(),
    }
  }

  simulateBattle(playerDeck: Card[], opponentDeck: Card[]): BattleResult[] {
    const results: BattleResult[] = []
    let currentPlayerDeck = [...playerDeck]
    let currentOpponentDeck = [...opponentDeck]

    for (let round = 1; round <= this.config.maxRounds; round++) {
      if (currentPlayerDeck.length === 0 || currentOpponentDeck.length === 0) break

      const playerCard = currentPlayerDeck[Math.floor(Math.random() * currentPlayerDeck.length)]
      const opponentCard = currentOpponentDeck[Math.floor(Math.random() * currentOpponentDeck.length)]

      const playerDamage = this.calculateDamage(playerCard, opponentCard, this.checkCriticalHit(playerCard))
      const opponentDamage = this.calculateDamage(opponentCard, playerCard, this.checkCriticalHit(opponentCard))

      results.push({
        id: `round-${round}`,
        player: 'player',
        opponent: 'ai',
        playerCard,
        opponentCard,
        playerDamage,
        opponentDamage,
        winner: playerDamage > opponentDamage ? 'player' : 'opponent',
        timestamp: Date.now(),
      })

      currentPlayerDeck = currentPlayerDeck.filter(c => c.id !== playerCard.id)
      currentOpponentDeck = currentOpponentDeck.filter(c => c.id !== opponentCard.id)
    }

    return results
  }
}

export const battleEngine = new BattleEngine()
