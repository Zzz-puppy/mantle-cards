'use client'

import { useState, useEffect } from 'react'
import type { Card } from '@/types'
import { getPresetBattleDeck } from '@/lib/battle-data'

export function useCards() {
  const [cards, setCards] = useState<Card[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setIsLoading(true)
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const battleCards = getPresetBattleDeck()
        setCards(battleCards)
        
        setIsLoading(false)
      } catch (err) {
        setError(err as Error)
        setIsLoading(false)
      }
    }
    
    fetchCards()
  }, [])

  return { cards, isLoading, error }
}