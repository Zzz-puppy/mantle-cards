'use client'

import { useState } from 'react'
import { Card } from '@/types/card'
import { useBattle } from '@/hooks/useBattle'
import { BattleSelection } from '@/components/battle/BattleSelection'
import { BattleArena } from '@/components/battle/BattleArena'
import { BattleResult } from '@/components/battle/BattleResult'
import { battleRecorder, type BattleHistoryRecord } from '@/lib/battle-recorder'

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

  // Mock player cards for selection screen
  const mockPlayerCards: Card[] = [
    {
      id: BigInt(1),
      name: 'Bitcoin Hero',
      rarity: 'legendary',
      attack: 95,
      defense: 70,
      specialAbility: 'Moon Shot - Deal 150% damage',
      image: '',
      owner: '0x1234',
      mintedAt: Date.now(),
      baseToken: 'BTC',
      tokenBalance: BigInt(1000000),
      transactionCount: 150,
    },
    {
      id: BigInt(2),
      name: 'ETH Defender',
      rarity: 'epic',
      attack: 75,
      defense: 90,
      specialAbility: 'Gas Shield - Reduce incoming damage by 30%',
      image: '',
      owner: '0x1234',
      mintedAt: Date.now(),
      baseToken: 'ETH',
      tokenBalance: BigInt(500000),
      transactionCount: 80,
    },
    {
      id: BigInt(3),
      name: 'Meme Lord',
      rarity: 'rare',
      attack: 80,
      defense: 60,
      specialAbility: 'Viral Attack - 20% chance to double damage',
      image: '',
      owner: '0x1234',
      mintedAt: Date.now(),
      baseToken: 'DOGE',
      tokenBalance: BigInt(100000),
      transactionCount: 45,
    },
    {
      id: BigInt(4),
      name: 'DeFi Whale',
      rarity: 'epic',
      attack: 85,
      defense: 75,
      specialAbility: 'Yield Farming - Heal 20 HP after battle',
      image: '',
      owner: '0x1234',
      mintedAt: Date.now(),
      baseToken: 'UNI',
      tokenBalance: BigInt(300000),
      transactionCount: 60,
    },
    {
      id: BigInt(5),
      name: 'NFT Collector',
      rarity: 'rare',
      attack: 65,
      defense: 80,
      specialAbility: 'Collection Boost - +10 defense per NFT owned',
      image: '',
      owner: '0x1234',
      mintedAt: Date.now(),
      baseToken: 'MATIC',
      tokenBalance: BigInt(200000),
      transactionCount: 35,
    },
    {
      id: BigInt(6),
      name: 'Newbie Trader',
      rarity: 'common',
      attack: 50,
      defense: 50,
      specialAbility: 'Learning Curve - Gain 10% more EXP',
      image: '',
      owner: '0x1234',
      mintedAt: Date.now(),
      baseToken: 'SHIB',
      tokenBalance: BigInt(50000),
      transactionCount: 15,
    },
  ]

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
