'use client'

import { Card } from '@/types/card'
import { AIProfile, AI_PROFILES } from '@/lib/ai-profiles'
import { AgentIdentityCard } from '@/components/agent/AgentIdentity'
import { getAgentById } from '@/lib/agent-data'
import { useState } from 'react'

interface BattleSelectionProps {
  playerCards: Card[]
  onStartBattle: (selectedCards: Card[], aiProfileId: string) => void
  onAgentSelected?: (agentId: string) => void
  isLoading?: boolean
}

export function BattleSelection({
  playerCards,
  onStartBattle,
  onAgentSelected,
  isLoading = false,
}: BattleSelectionProps) {
  const [selectedCards, setSelectedCards] = useState<Card[]>([])
  const [selectedAI, setSelectedAI] = useState<string>('')
  const [showAIProfiles, setShowAIProfiles] = useState(false)

  // Get agent identity data for selected AI
  const selectedAgent = selectedAI ? getAgentById(`agent-${selectedAI}`) : null

  const maxSelectableCards = 3

  const toggleCardSelection = (card: Card) => {
    setSelectedCards(prev => {
      const isSelected = prev.some(c => c.id === card.id)
      if (isSelected) {
        return prev.filter(c => c.id !== card.id)
      }
      if (prev.length >= maxSelectableCards) {
        return prev
      }
      return [...prev, card]
    })
  }

  const handleStartBattle = () => {
    if (selectedCards.length > 0 && selectedAI) {
      onStartBattle(selectedCards, selectedAI)
    }
  }

  const getDifficultyBadgeColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-600'
      case 'medium':
        return 'bg-yellow-600'
      case 'hard':
        return 'bg-red-600'
      default:
        return 'bg-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">⚔️ Select Your Battle</h1>
          <p className="text-gray-400">Choose up to {maxSelectableCards} cards and an AI opponent</p>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Card Selection */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Your Cards ({selectedCards.length}/{maxSelectableCards})</h2>
            
            <div className="grid grid-cols-2 gap-3">
              {playerCards.map(card => {
                const isSelected = selectedCards.some(c => c.id === card.id)
                return (
                  <div
                    key={card.id.toString()}
                    onClick={() => toggleCardSelection(card)}
                    className={`
                      relative p-3 rounded-xl border-2 cursor-pointer transition-all
                      ${isSelected
                        ? 'border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/20'
                        : 'border-gray-600 bg-gray-800/50 hover:border-gray-400'
                      }
                    `}
                  >
                    {/* Card content */}
                    <div className="w-full h-32 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center mb-2">
                      {card.image ? (
                        <img src={card.image} alt={card.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <span className="text-4xl">🎴</span>
                      )}
                    </div>
                    
                    <div className="text-sm font-bold text-white truncate">{card.name}</div>
                    <div className="flex gap-2 text-xs mt-1">
                      <span className="text-red-400">⚔️ {card.attack}</span>
                      <span className="text-blue-400">🛡️ {card.defense}</span>
                    </div>
                    
                    {/* Rarity indicator */}
                    <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
                      card.rarity === 'legendary' ? 'bg-purple-500' :
                      card.rarity === 'epic' ? 'bg-orange-500' :
                      card.rarity === 'rare' ? 'bg-blue-500' :
                      'bg-gray-500'
                    }`} />

                    {/* Selected indicator */}
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-black text-sm font-bold">✓</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {playerCards.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No cards available. Collect some cards first!
              </div>
            )}
          </div>

          {/* Right Column - AI Selection */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Select Opponent</h2>
            
            {/* Agent Identity Card - Shows when AI is selected */}
            {selectedAgent && (
              <div className="mb-4">
                <AgentIdentityCard
                  agent={selectedAgent}
                  size="lg"
                  showDetails
                />
              </div>
            )}
            
            <div className="space-y-3">
              {AI_PROFILES.map(profile => {
                const agentData = getAgentById(`agent-${profile.id}`)
                return (
                  <div
                    key={profile.id}
                    onClick={() => {
                      setSelectedAI(profile.id)
                      onAgentSelected?.(`agent-${profile.id}`)
                    }}
                    className={`
                      p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${selectedAI === profile.id
                        ? 'border-yellow-400 bg-yellow-400/10'
                        : 'border-gray-600 bg-gray-800/50 hover:border-gray-400'
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-3xl overflow-hidden">
                        {agentData?.avatar ? (
                          <img src={agentData.avatar} alt={profile.name} className="w-full h-full object-cover" />
                        ) : (
                          '🤖'
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{profile.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${getDifficultyBadgeColor(profile.difficulty)}`}>
                            {profile.difficulty.toUpperCase()}
                          </span>
                          {agentData && (
                            <span className="text-xs px-2 py-0.5 rounded bg-purple-900/50 text-purple-300">
                              🏆 {agentData.reputation} RP
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-400">{profile.personality}</div>
                        {agentData && (
                          <div className="flex gap-3 mt-1 text-xs">
                            <span className="text-green-400">⚔️ {agentData.wins}W</span>
                            <span className="text-red-400">💀 {agentData.losses}L</span>
                            <span className="text-yellow-400">📊 {agentData.winRate}%</span>
                            {agentData.currentStreak >= 3 && (
                              <span className="text-orange-400">🔥 {agentData.currentStreak}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Battle stats preview */}
                    <div className="flex gap-4 mt-3 text-xs text-gray-400">
                      <span>Style: {profile.tradingStyle}</span>
                      <span>Risk: {(profile.riskTolerance * 100).toFixed(0)}%</span>
                    </div>

                    {selectedAI === profile.id && (
                      <div className="mt-2 text-yellow-400 text-sm font-bold">
                        ✓ Selected as opponent
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Battle Rules */}
        <div className="mt-8 bg-gray-800/50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-3">📜 Battle Rules</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>• Each battle consists of up to {maxSelectableCards} rounds</li>
            <li>• In each round, both players select one card to battle</li>
            <li>• Damage is calculated based on attack vs defense stats</li>
            <li>• Critical hits deal 1.5x damage</li>
            <li>• The player with remaining health wins</li>
            <li>• Winners earn EXP, tokens, and ranking points</li>
          </ul>
        </div>

        {/* Start Battle Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleStartBattle}
            disabled={selectedCards.length === 0 || !selectedAI || isLoading}
            className={`
              px-12 py-4 rounded-xl font-bold text-xl transition-all
              ${selectedCards.length === 0 || !selectedAI || isLoading
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/30 hover:scale-105'
              }
            `}
          >
            {isLoading ? '⚔️ Preparing Battle...' : '⚔️ Start Battle'}
          </button>
          
          {selectedCards.length === 0 && (
            <p className="text-gray-500 text-sm mt-2">Select at least one card to battle</p>
          )}
          
          {!selectedAI && selectedCards.length > 0 && (
            <p className="text-gray-500 text-sm mt-2">Select an AI opponent</p>
          )}
        </div>
      </div>
    </div>
  )
}
