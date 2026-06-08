'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Card } from '@/types/card'
import type { BattleState, BattleResult, BattleLogEntry, DifficultyLevel } from '@/types/battle'
import { BattleEngine, battleEngine } from '@/lib/battle-engine'
import { AIProfile, getAIProfile, getRandomAIProfile } from '@/lib/ai-profiles'
import { battleRecorder } from '@/lib/battle-recorder'

interface UseBattleOptions {
  maxRounds?: number
  baseHealth?: number
}

interface UseBattleReturn {
  battleState: BattleState
  currentLogs: BattleLogEntry[]
  aiProfile: AIProfile | null
  isProcessing: boolean
  startBattle: (playerCards: Card[], aiProfileId?: string) => Promise<void>
  selectPlayerCard: (card: Card) => void
  confirmSelection: () => void
  surrender: () => void
  resetBattle: () => void
  getLastResult: () => BattleResult | null
}

export function useBattle(options: UseBattleOptions = {}): UseBattleReturn {
  const [battleState, setBattleState] = useState<BattleState>({
    player: {
      cards: [],
      selectedCard: null,
      health: options.baseHealth || 100,
    },
    opponent: {
      cards: [],
      selectedCard: null,
      health: options.baseHealth || 100,
    },
    turn: 'player',
    round: 1,
    maxRounds: options.maxRounds || 3,
    status: 'idle',
    winner: null,
  })

  const [currentLogs, setCurrentLogs] = useState<BattleLogEntry[]>([])
  const [aiProfile, setAIProfile] = useState<AIProfile | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastResult, setLastResult] = useState<BattleResult | null>(null)

  const engineRef = useRef<BattleEngine>(
    new BattleEngine({
      maxRounds: options.maxRounds || 3,
      baseHealth: options.baseHealth || 100,
    })
  )

  const startBattle = useCallback(async (playerCards: Card[], aiProfileId?: string) => {
    setIsProcessing(true)

    const profile = aiProfileId 
      ? getAIProfile(aiProfileId) 
      : getRandomAIProfile()

    setAIProfile(profile)
    engineRef.current.setAIProfile(profile)

    // Generate AI deck (same number of cards as player)
    const opponentCards = [...playerCards]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(playerCards.length, 5))

    const initialState = engineRef.current.createInitialBattleState(
      playerCards,
      opponentCards,
      profile
    )

    setBattleState(initialState)
    setCurrentLogs([{
      round: 0,
      action: 'select',
      actor: 'player',
      cardName: '',
      message: `Battle started against ${profile.name}!`,
    }])
    setLastResult(null)
    setIsProcessing(false)
  }, [])

  const selectPlayerCard = useCallback((card: Card) => {
    if (battleState.status !== 'selecting' || battleState.turn !== 'player') return

    setBattleState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        selectedCard: card,
      },
    }))
  }, [battleState.status, battleState.turn])

  const confirmSelection = useCallback(() => {
    if (battleState.status !== 'selecting' || !battleState.player.selectedCard) return

    setIsProcessing(true)
    setBattleState(prev => ({ ...prev, status: 'battling' }))

    // AI selects card
    const aiSelection = engineRef.current.executeAITurn(battleState)
    
    const aiCard = aiSelection.card

    setBattleState(prev => ({
      ...prev,
      opponent: {
        ...prev.opponent,
        selectedCard: aiCard,
      },
    }))

    // Small delay for dramatic effect
    setTimeout(() => {
      const result = engineRef.current.processRound(
        battleState,
        battleState.player.selectedCard!,
        aiCard
      )

      setBattleState(result.updatedState)
      setCurrentLogs(prev => [...prev, ...result.logs])

      if (result.updatedState.status === 'finished') {
        // Record battle result
        const battleResult = engineRef.current.createBattleResult(
          result.updatedState,
          'player', // Would be actual player address
          aiProfile?.name || 'AI',
          battleState.player.selectedCard!,
          aiCard,
          result.playerDamage,
          result.opponentDamage
        )
        setLastResult(battleResult)
        battleRecorder.recordBattle(battleResult)
      }

      setIsProcessing(false)
    }, 1000)
  }, [battleState, aiProfile])

  const surrender = useCallback(() => {
    setBattleState(prev => ({
      ...prev,
      status: 'finished',
      winner: 'opponent',
    }))

    setCurrentLogs(prev => [...prev, {
      round: prev.length + 1,
      action: 'defeat',
      actor: 'player',
      cardName: '',
      message: 'Player surrendered!',
    }])

    if (battleState.player.selectedCard) {
      const battleResult = engineRef.current.createBattleResult(
        battleState,
        'player',
        aiProfile?.name || 'AI',
        battleState.player.selectedCard,
        battleState.opponent.selectedCard || battleState.opponent.cards[0],
        0,
        battleState.player.health
      )
      setLastResult(battleResult)
      battleRecorder.recordBattle(battleResult)
    }
  }, [battleState, aiProfile])

  const resetBattle = useCallback(() => {
    setBattleState({
      player: {
        cards: [],
        selectedCard: null,
        health: options.baseHealth || 100,
      },
      opponent: {
        cards: [],
        selectedCard: null,
        health: options.baseHealth || 100,
      },
      turn: 'player',
      round: 1,
      maxRounds: options.maxRounds || 3,
      status: 'idle',
      winner: null,
    })
    setCurrentLogs([])
    setAIProfile(null)
    setLastResult(null)
  }, [options])

  const getLastResult = useCallback(() => lastResult, [lastResult])

  return {
    battleState,
    currentLogs,
    aiProfile,
    isProcessing,
    startBattle,
    selectPlayerCard,
    confirmSelection,
    surrender,
    resetBattle,
    getLastResult,
  }
}

export type { UseBattleReturn }
