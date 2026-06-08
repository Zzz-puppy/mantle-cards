'use client'

import { useState, useEffect } from 'react'
import type { Card } from '@/types'

export function useCards() {
  const [cards, setCards] = useState<Card[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Placeholder - will be connected to Web3
    const fetchCards = async () => {
      try {
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
