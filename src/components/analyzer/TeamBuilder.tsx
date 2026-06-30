'use client'

import { useState, useMemo } from 'react'
import type { Card } from '@/types'
import { suggestTeam, type TeamAnalysis } from '@/lib/ai-analyzer'

interface TeamBuilderProps {
  cards: Card[]
  maxTeamSize?: number
  onClose?: () => void
}

export function TeamBuilder({ cards, maxTeamSize = 5, onClose }: TeamBuilderProps) {
  const [selectedCards, setSelectedCards] = useState<Card[]>([])
  const [teamAnalysis, setTeamAnalysis] = useState<TeamAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleCardToggle = (card: Card) => {
    setSelectedCards(prev => {
      const isSelected = prev.some(c => c.id === card.id)
      if (isSelected) {
        return prev.filter(c => c.id !== card.id)
      } else if (prev.length >= maxTeamSize) {
        return prev
      }
      return [...prev, card]
    })
    setTeamAnalysis(null)
  }

  const handleAnalyzeTeam = async () => {
    if (selectedCards.length === 0) return
    
    setIsAnalyzing(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const analysis = suggestTeam(selectedCards)
    setTeamAnalysis(analysis)
    setIsAnalyzing(false)
  }

  const handleClearTeam = () => {
    setSelectedCards([])
    setTeamAnalysis(null)
  }

  const recommendedCards = useMemo(() => {
    if (selectedCards.length === 0) return []
    
    // Find cards that would complement the current selection
    const types = selectedCards.map(c => getCardTypeFromStats(c))
    return cards
      .filter(c => !selectedCards.some(s => s.id === c.id))
      .sort((a, b) => {
        // Prioritize complementary types
        const aComplement = !types.includes(getCardTypeFromStats(a)) ? 1 : 0
        const bComplement = !types.includes(getCardTypeFromStats(b)) ? 1 : 0
        return bComplement - aComplement
      })
      .slice(0, 4)
  }, [selectedCards, cards])

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">🛡️</span>
              Team Builder
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Build optimal team composition ({selectedCards.length}/{maxTeamSize})
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white text-3xl transition-colors"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Selected Team */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
              Your Team
            </label>
            {selectedCards.length > 0 && (
              <button
                onClick={handleClearTeam}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
          
          <div className="flex gap-3 min-h-[120px] p-4 bg-black/30 rounded-xl border border-white/5 overflow-x-auto scrollbar-hide">
            {selectedCards.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <span>Select cards below to build your team</span>
              </div>
            ) : (
              selectedCards.map((card, index) => (
                <TeamCard key={card.id} card={card} position={index} />
              ))
            )}
          </div>
        </div>

        {/* Team Synergy Score (when analyzed) */}
        {teamAnalysis && (
          <div className="animate-fade-in-up">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
              <div className="text-center mb-4">
                <div className="text-sm text-purple-400 uppercase tracking-wide">Team Synergy Score</div>
                <div className="text-5xl font-bold text-white mt-2">{teamAnalysis.synergyScore}</div>
                <div className="text-sm text-gray-400 mt-1">/100</div>
              </div>
              
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gold">{teamAnalysis.teamName}</h3>
                <p className="text-gray-400 text-sm mt-1">{teamAnalysis.strategy}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center">
                  <div className="text-xs text-gray-400">Overall Power</div>
                  <div className="text-xl font-bold text-red-400">{teamAnalysis.overallPower}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400">Cards</div>
                  <div className="text-xl font-bold text-purple-400">{selectedCards.length}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400">Combos</div>
                  <div className="text-xl font-bold text-blue-400">{teamAnalysis.comboDescriptions.length}</div>
                </div>
              </div>

              {/* Strengths */}
              {teamAnalysis.strengths.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                    <span>💪</span> Team Strengths
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {teamAnalysis.strengths.map((strength, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-green-500/20 text-green-300 text-xs">
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Weaknesses */}
              {teamAnalysis.weaknesses.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
                    <span>⚠️</span> Weaknesses
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {teamAnalysis.weaknesses.map((weakness, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-red-500/20 text-red-300 text-xs">
                        {weakness}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Positions */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-purple-400 mb-2 flex items-center gap-2">
                  <span>📍</span> Recommended Positions
                </h4>
                <div className="space-y-2">
                  {teamAnalysis.recommendedPositions.map((pos, i) => (
                    <div key={i} className="flex items-center justify-between bg-black/30 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <PositionIcon position={pos.position} />
                        <span className="text-white text-sm">
                          {selectedCards.find(c => c.id === pos.cardId)?.name}
                        </span>
                      </div>
                      <span className="text-xs text-purple-300">{pos.role}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Combos */}
              {teamAnalysis.comboDescriptions.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                    <span>⚡</span> Team Combos
                  </h4>
                  <div className="space-y-2">
                    {teamAnalysis.comboDescriptions.map((combo, i) => (
                      <div key={i} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="text-yellow-400">◆</span>
                        {combo}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleAnalyzeTeam}
            disabled={selectedCards.length === 0 || isAnalyzing}
            className={`flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
              selectedCards.length === 0 || isAnalyzing
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-500 hover:to-emerald-500 shadow-lg shadow-green-500/30 hover:shadow-green-500/50'
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <span className="text-2xl">🎯</span>
                Analyze Team
              </>
            )}
          </button>
        </div>

        {/* Available Cards */}
        <div>
          <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Available Cards
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto scrollbar-hide">
            {cards.map(card => (
              <button
                key={card.id}
                onClick={() => handleCardToggle(card)}
                disabled={selectedCards.length >= maxTeamSize && !selectedCards.some(c => c.id === card.id)}
                className={`relative p-3 rounded-xl border-2 transition-all duration-200 ${
                  selectedCards.some(c => c.id === card.id)
                    ? 'border-gold bg-gold/20'
                    : selectedCards.length >= maxTeamSize
                      ? 'border-white/5 bg-black/30 opacity-50 cursor-not-allowed'
                      : 'border-white/10 bg-black/30 hover:border-white/30 hover:bg-black/50'
                }`}
              >
                <div className="text-2xl mb-1">{getCardEmoji(card)}</div>
                <div className="text-xs text-white truncate">{card.name}</div>
                <div className="flex gap-1 mt-1 justify-center">
                  <span className="text-[10px] px-1 py-0.5 rounded bg-red-500/80 text-white">
                    {card.attack}
                  </span>
                  <span className="text-[10px] px-1 py-0.5 rounded bg-blue-500/80 text-white">
                    {card.defense}
                  </span>
                </div>
                {selectedCards.some(c => c.id === card.id) && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gold rounded-full flex items-center justify-center">
                    <span className="text-black text-xs">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Recommended Additions */}
        {recommendedCards.length > 0 && selectedCards.length > 0 && selectedCards.length < maxTeamSize && (
          <div>
            <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
              💡 Recommended Additions
            </label>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {recommendedCards.map(card => (
                <button
                  key={card.id}
                  onClick={() => handleCardToggle(card)}
                  className="shrink-0 p-3 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 transition-all"
                >
                  <div className="text-2xl mb-1">{getCardEmoji(card)}</div>
                  <div className="text-xs text-white whitespace-nowrap">{card.name}</div>
                  <div className="text-[10px] text-purple-400 mt-1">+Synergy</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Team Card Display Component
function TeamCard({ card, position }: { card: Card; position: number }) {
  const positionLabels: Record<number, string> = {
    0: 'Front',
    1: 'Mid',
    2: 'Back',
    3: 'Reserve',
    4: 'Reserve',
  }

  return (
    <div className="shrink-0 w-[100px] p-2 rounded-xl bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30">
      <div className="text-center">
        <div className="text-3xl mb-1">{getCardEmoji(card)}</div>
        <div className="text-[10px] text-purple-400 uppercase tracking-wider">
          {positionLabels[position] || 'Flex'}
        </div>
        <div className="text-xs text-white truncate mt-1" title={card.name}>
          {card.name}
        </div>
        <div className="flex gap-1 mt-2 justify-center">
          <span className="text-[10px] px-1 rounded bg-red-500/80 text-white">
            {card.attack}
          </span>
          <span className="text-[10px] px-1 rounded bg-blue-500/80 text-white">
            {card.defense}
          </span>
        </div>
      </div>
    </div>
  )
}

// Position Icon Component
function PositionIcon({ position }: { position: string }) {
  const icons: Record<string, string> = {
    front: '🔴',
    middle: '🟡',
    back: '🔵',
  }
  return <span>{icons[position] || '⚪'}</span>
}

// Helper to derive card type from stats
function getCardTypeFromStats(card: Card): string {
  if (card.attack >= 70 && card.defense < 50) return 'Attack'
  if (card.defense >= 70 && card.attack < 50) return 'Defense'
  if (card.specialAbility && card.attack >= 50) return 'Special'
  return 'Support'
}

function getCardEmoji(card: Card): string {
  if (!card) return '🎴'
  const type = getCardTypeFromStats(card)
  const emojis: Record<string, string> = {
    Attack: '⚔️',
    Defense: '🛡️',
    Support: '✨',
    Special: '🌟',
  }
  return emojis[type] || '🎴'
}
