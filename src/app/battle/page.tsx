'use client'

import { useState } from 'react'
import { Card } from '@/types/card'
import { useBattle } from '@/hooks/useBattle'
import { BattleSelection } from '@/components/battle/BattleSelection'
import { BattleArena } from '@/components/battle/BattleArena'
import { BattleResult } from '@/components/battle/BattleResult'
import { battleRecorder, type BattleHistoryRecord } from '@/lib/battle-recorder'
import { getPresetBattleDeck } from '@/lib/battle-data'

type BattlePhase = 'selection' | 'battle' | 'result'

export default function BattlePage() {
  const [phase, setPhase] = useState<BattlePhase>('selection')
  const [selectedPlayerCards, setSelectedPlayerCards] = useState<Card[]>([])
  const [selectedAIProfileId, setSelectedAIProfileId] = useState<string>('')
  const [battleRecord, setBattleRecord] = useState<BattleHistoryRecord | null>(null)

  const {
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
  } = useBattle({ maxRounds: 3, baseHealth: 100 })

  const handleStartBattle = async (cards: Card[], aiProfileId: string) => {
    setSelectedPlayerCards(cards)
    setSelectedAIProfileId(aiProfileId)
    await startBattle(cards, aiProfileId)
    setPhase('battle')
  }

  const handleConfirmSelection = () => {
    confirmSelection()
    if (battleState.status === 'finished') {
      const result = getLastResult()
      if (result) {
        const record = battleRecorder.getBattleHistory().slice(-1)[0]
        setBattleRecord(record || null)
      }
      setPhase('result')
    }
  }

  const handleSurrender = () => {
    surrender()
    setPhase('result')
  }

  const handlePlayAgain = () => {
    resetBattle()
    setPhase('selection')
    setSelectedPlayerCards([])
    setSelectedAIProfileId('')
    setBattleRecord(null)
  }

  const handleReturnToCollection = () => {
    resetBattle()
    setPhase('selection')
    setSelectedPlayerCards([])
    setSelectedAIProfileId('')
    setBattleRecord(null)
  }

  const mockPlayerCards = getPresetBattleDeck()

  if (phase === 'selection') {
    return (
      <BattleSelection
        playerCards={mockPlayerCards}
        onStartBattle={handleStartBattle}
      />
    )
  }

  if (phase === 'result' && battleRecord) {
    return (
      <BattleResult
        result={battleRecord.result}
        rewards={battleRecord.rewards}
        aiProfile={aiProfile!}
        playerCards={selectedPlayerCards}
        opponentCards={battleState.opponent.cards}
        onPlayAgain={handlePlayAgain}
        onReturnToCollection={handleReturnToCollection}
      />
    )
  }

  return (
    <BattleArena
      battleState={battleState}
      currentLogs={currentLogs}
      aiProfile={aiProfile}
      isProcessing={isProcessing}
      onSelectCard={selectPlayerCard}
      onConfirmSelection={handleConfirmSelection}
      onSurrender={handleSurrender}
    />
  )
}