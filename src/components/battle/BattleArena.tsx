'use client'

import { Card } from '@/types/card'
import type { BattleState, BattleLogEntry } from '@/types/battle'
import { AIProfile } from '@/lib/ai-profiles'
import { AgentIdentityMini } from '@/components/agent/AgentIdentity'
import { getAgentById } from '@/lib/agent-data'
import { CardSlot } from './CardSlot'
import { BattleEffect } from './BattleEffect'
import { FloatingDamage } from './BattleEffect'
import { useState, useEffect } from 'react'

interface BattleArenaProps {
  battleState: BattleState
  currentLogs: BattleLogEntry[]
  aiProfile: AIProfile | null
  agentId?: string
  isProcessing: boolean
  onSelectCard: (card: Card) => void
  onConfirmSelection: () => void
  onSurrender: () => void
}

export function BattleArena({
  battleState,
  currentLogs,
  aiProfile,
  agentId,
  isProcessing,
  onSelectCard,
  onConfirmSelection,
  onSurrender,
}: BattleArenaProps) {
  const [showEffect, setShowEffect] = useState<'attack' | 'damage' | 'victory' | 'defeat' | null>(null)
  const [floatingDamage, setFloatingDamage] = useState<{ player?: number; opponent?: number }>({})
  const [lastLog, setLastLog] = useState<BattleLogEntry | null>(null)

  // Get agent identity data
  const agentData = agentId ? getAgentById(agentId) : null

  useEffect(() => {
    if (currentLogs.length > 0) {
      const newLog = currentLogs[currentLogs.length - 1]
      if (newLog !== lastLog) {
        setLastLog(newLog)
        
        if (newLog.action === 'damage') {
          if (newLog.actor === 'player') {
            setFloatingDamage({ opponent: newLog.damage })
            setShowEffect('attack')
          } else {
            setFloatingDamage({ player: newLog.damage })
            setShowEffect('damage')
          }
        } else if (newLog.action === 'victory') {
          setShowEffect('victory')
        } else if (newLog.action === 'defeat') {
          setShowEffect('defeat')
        }

        setTimeout(() => {
          setShowEffect(null)
          setFloatingDamage({})
        }, 1500)
      }
    }
  }, [currentLogs, lastLog])

  const getTurnIndicator = () => {
    if (battleState.status === 'finished') {
      return battleState.winner === 'player' ? '🎉 VICTORY!' : '💀 DEFEAT'
    }
    if (battleState.status === 'selecting') {
      return battleState.turn === 'player' ? 'Your Turn - Select a Card' : 'AI is thinking...'
    }
    return 'Battling...'
  }

  const getStatusColor = () => {
    if (battleState.status === 'finished') {
      return battleState.winner === 'player' ? 'text-yellow-400' : 'text-gray-400'
    }
    return battleState.turn === 'player' ? 'text-green-400' : 'text-red-400'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-4">
      {showEffect && (
        <BattleEffect
          type={showEffect}
          onComplete={() => setShowEffect(null)}
        />
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-white mb-2">⚔️ Battle Arena</h1>
          <div className={`text-xl font-bold ${getStatusColor()}`}>
            {getTurnIndicator()}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            Round {battleState.round} / {battleState.maxRounds}
          </div>
        </div>

        {/* Opponent Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-xl overflow-hidden">
                {agentData?.avatar ? (
                  <img src={agentData.avatar} alt={aiProfile?.name} className="w-full h-full object-cover" />
                ) : (
                  '🤖'
                )}
              </div>
              <div>
                <div className="font-bold text-white">{aiProfile?.name || 'AI Opponent'}</div>
                {agentData && (
                  <AgentIdentityMini agent={agentData} showStreak />
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Health</div>
              <div className="text-2xl font-bold text-red-400">{battleState.opponent.health}</div>
            </div>
          </div>
          
          <div className="bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500"
              style={{ width: `${battleState.opponent.health}%` }}
            />
          </div>

          {/* Opponent Cards */}
          <div className="flex justify-center gap-4 mt-4">
            {battleState.opponent.cards.slice(0, 3).map((card, idx) => (
              <CardSlot
                key={card.id.toString()}
                card={battleState.opponent.selectedCard?.id === card.id ? battleState.opponent.selectedCard : null}
                position="opponent"
                isSelected={battleState.opponent.selectedCard?.id === card.id}
                disabled
              />
            ))}
          </div>
        </div>

        {/* VS Divider */}
        <div className="flex items-center justify-center my-4">
          <div className="h-px bg-gray-600 flex-1" />
          <div className="px-4 text-2xl font-black text-gray-500">VS</div>
          <div className="h-px bg-gray-600 flex-1" />
        </div>

        {/* Player Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-xl">
                👤
              </div>
              <div>
                <div className="font-bold text-white">You</div>
                <div className="text-xs text-gray-400">Your Deck</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Health</div>
              <div className="text-2xl font-bold text-blue-400">{battleState.player.health}</div>
            </div>
          </div>
          
          <div className="bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500"
              style={{ width: `${battleState.player.health}%` }}
            />
          </div>

          {/* Player Cards - Selectable */}
          <div className="flex justify-center gap-4 mt-4">
            {battleState.player.cards.map((card) => (
              <CardSlot
                key={card.id.toString()}
                card={card}
                position="player"
                isSelected={battleState.player.selectedCard?.id === card.id}
                isAttacking={battleState.status === 'battling' && battleState.player.selectedCard?.id === card.id}
                isDamaged={lastLog?.actor === 'opponent' && lastLog?.damage !== undefined}
                disabled={battleState.status !== 'selecting' || battleState.turn !== 'player' || isProcessing}
                onClick={() => onSelectCard(card)}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onConfirmSelection}
            disabled={!battleState.player.selectedCard || battleState.status !== 'selecting' || isProcessing}
            className={`
              px-8 py-3 rounded-lg font-bold text-lg transition-all
              ${!battleState.player.selectedCard || battleState.status !== 'selecting' || isProcessing
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-500 hover:to-green-400 shadow-lg hover:shadow-green-500/30'
              }
            `}
          >
            {isProcessing ? '⚔️ Attacking...' : '⚔️ Attack!'}
          </button>
          
          <button
            onClick={onSurrender}
            disabled={battleState.status === 'finished'}
            className="px-6 py-3 rounded-lg font-bold text-lg bg-gradient-to-r from-gray-600 to-gray-500 text-white hover:from-gray-500 hover:to-gray-400 transition-all disabled:opacity-50"
          >
            🏳️ Surrender
          </button>
        </div>

        {/* Battle Log */}
        <div className="mt-6 bg-gray-800/50 rounded-lg p-4 max-h-40 overflow-y-auto">
          <h3 className="text-sm font-bold text-gray-400 mb-2">Battle Log</h3>
          <div className="space-y-1">
            {currentLogs.map((log, idx) => (
              <div
                key={idx}
                className={`text-sm ${
                  log.actor === 'player' ? 'text-blue-400' : 'text-red-400'
                }`}
              >
                {log.message}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
