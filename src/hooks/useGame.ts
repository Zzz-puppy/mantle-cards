'use client'

import { useState, useCallback } from 'react'
import type { GameState, Card } from '@/types'

export function useGame() {
  const [gameState, setGameState] = useState<GameState>({
    playerHealth: 100,
    opponentHealth: 100,
    playerDeck: [],
    opponentDeck: [],
    currentTurn: 'player',
    battleLog: [],
  })

  const startBattle = useCallback(async (playerDeck: Card[], opponentDeck: Card[]) => {
    setGameState({
      playerHealth: 100,
      opponentHealth: 100,
      playerDeck,
      opponentDeck,
      currentTurn: 'player',
      battleLog: ['Battle started!'],
    })
  }, [])

  const playCard = useCallback((card: Card) => {
    setGameState((prev) => ({
      ...prev,
      battleLog: [...prev.battleLog, `Played ${card.name}!`],
    }))
  }, [])

  return { gameState, startBattle, playCard }
}
