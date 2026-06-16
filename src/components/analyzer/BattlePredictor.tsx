'use client'

import { useState } from 'react'
import type { Card } from '@/types'
import { predictBattle, type BattlePrediction } from '@/lib/ai-analyzer'
import { getRarityBgColor, formatRarity } from '@/lib/card-utils'

interface BattlePredictorProps {
  cards: Card[]
  opponentCards?: Card[]
  onClose?: () => void
}

export function BattlePredictor({ cards, opponentCards, onClose }: BattlePredictorProps) {
  const [playerCard, setPlayerCard] = useState<Card | null>(null)
  const [opponentCard, setOpponentCard] = useState<Card | null>(null)
  const [prediction, setPrediction] = useState<BattlePrediction | null>(null)
  const [isPredicting, setIsPredicting] = useState(false)
  const [showComparison, setShowComparison] = useState(false)

  const handlePredict = async () => {
    if (!playerCard || !opponentCard) return
    
    setIsPredicting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const result = predictBattle(playerCard, opponentCard)
    setPrediction(result)
    setShowComparison(true)
    setIsPredicting(false)
  }

  const handleReset = () => {
    setPlayerCard(null)
    setOpponentCard(null)
    setPrediction(null)
    setShowComparison(false)
  }

  const availableOpponents = opponentCards || cards

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">⚔️</span>
              Battle Predictor
            </h2>
            <p className="text-gray-400 text-sm mt-1">Predict battle outcomes with AI analysis</p>
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
        {/* VS Display */}
        <div className="relative">
          <div className="flex items-center justify-between gap-4">
            {/* Player Card Selection */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-red-400 uppercase tracking-wide mb-3 text-center">
                Your Card
              </label>
              <CardSelector
                cards={cards}
                selectedCard={playerCard}
                onSelect={setPlayerCard}
                color="red"
              />
            </div>

            {/* VS Badge */}
            <div className="shrink-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-4 border-white/20">
                <span className="text-2xl font-black text-white">VS</span>
              </div>
            </div>

            {/* Opponent Card Selection */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-blue-400 uppercase tracking-wide mb-3 text-center">
                Opponent Card
              </label>
              <CardSelector
                cards={availableOpponents}
                selectedCard={opponentCard}
                onSelect={setOpponentCard}
                color="blue"
              />
            </div>
          </div>
        </div>

        {/* Predict Button */}
        <button
          onClick={handlePredict}
          disabled={!playerCard || !opponentCard || isPredicting}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
            !playerCard || !opponentCard || isPredicting
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-500 hover:to-red-500 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50'
          }`}
        >
          {isPredicting ? (
            <>
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              Calculating Battle...
            </>
          ) : (
            <>
              <span className="text-2xl">🔮</span>
              Predict Battle Outcome
            </>
          )}
        </button>

        {/* Battle Results */}
        {prediction && showComparison && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Winner Banner */}
            <div className={`text-center py-6 rounded-xl ${
              prediction.winner === 'player' 
                ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30'
                : prediction.winner === 'opponent'
                  ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30'
                  : 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
            }`}>
              <div className="text-sm uppercase tracking-wider text-gray-400 mb-2">
                {prediction.winner === 'player' ? 'Victory Prediction' 
                  : prediction.winner === 'opponent' ? 'Defeat Prediction'
                  : 'Draw Prediction'}
              </div>
              <div className={`text-4xl font-black ${
                prediction.winner === 'player' ? 'text-green-400'
                  : prediction.winner === 'opponent' ? 'text-red-400'
                  : 'text-yellow-400'
              }`}>
                {prediction.winner === 'player' ? '🏆 YOU WIN!' 
                  : prediction.winner === 'opponent' ? '💀 OPPONENT WINS'
                  : '🤝 DRAW'}
              </div>
              <div className="mt-4">
                <div className="text-5xl font-black text-white">
                  {prediction.winProbability}%
                </div>
                <div className="text-sm text-gray-400">Win Probability</div>
              </div>
            </div>

            {/* Win Probability Bar */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-red-400">Opponent Win</span>
                <span className="text-gray-400">50%</span>
                <span className="text-green-400">Your Win</span>
              </div>
              <div className="relative h-8 bg-black/50 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-1000"
                  style={{ width: '100%' }}
                />
                <div
                  className="absolute top-0 h-full w-1 bg-white shadow-lg transition-all duration-1000"
                  style={{ left: `${prediction.winProbability}%` }}
                />
              </div>
            </div>

            {/* Card Comparison */}
            <div className="grid grid-cols-2 gap-4">
              {/* Your Stats */}
              <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/30">
                <h4 className="text-sm font-semibold text-red-400 uppercase tracking-wide mb-3 text-center">
                  Your Card
                </h4>
                <div className="text-center mb-3">
                  <div className="text-3xl">{getCardEmoji(playerCard!.type)}</div>
                  <div className="text-sm text-white mt-1 truncate">{playerCard!.name}</div>
                </div>
                <div className="space-y-2">
                  <StatComparison
                    label="Attack"
                    playerValue={playerCard!.attack}
                    opponentValue={opponentCard!.attack}
                    color="red"
                  />
                  <StatComparison
                    label="Defense"
                    playerValue={playerCard!.defense}
                    opponentValue={opponentCard!.defense}
                    color="blue"
                  />
                </div>
                <div className="mt-3 text-xs text-center">
                  <span className={`px-2 py-1 rounded ${getRarityBgColor(playerCard!.rarity)} ${playerCard!.rarity === 'legendary' ? 'text-yellow-400' : playerCard!.rarity === 'epic' ? 'text-purple-400' : playerCard!.rarity === 'rare' ? 'text-blue-400' : 'text-gray-400'}`}>
                    {formatRarity(playerCard!.rarity)}
                  </span>
                </div>
              </div>

              {/* Opponent Stats */}
              <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
                <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wide mb-3 text-center">
                  Opponent Card
                </h4>
                <div className="text-center mb-3">
                  <div className="text-3xl">{getCardEmoji(opponentCard!.type)}</div>
                  <div className="text-sm text-white mt-1 truncate">{opponentCard!.name}</div>
                </div>
                <div className="space-y-2">
                  <StatComparison
                    label="Attack"
                    playerValue={opponentCard!.attack}
                    opponentValue={playerCard!.attack}
                    color="red"
                    inverted
                  />
                  <StatComparison
                    label="Defense"
                    playerValue={opponentCard!.defense}
                    opponentValue={playerCard!.defense}
                    color="blue"
                    inverted
                  />
                </div>
                <div className="mt-3 text-xs text-center">
                  <span className={`px-2 py-1 rounded ${getRarityBgColor(opponentCard!.rarity)} ${opponentCard!.rarity === 'legendary' ? 'text-yellow-400' : opponentCard!.rarity === 'epic' ? 'text-purple-400' : opponentCard!.rarity === 'rare' ? 'text-blue-400' : 'text-gray-400'}`}>
                    {formatRarity(opponentCard!.rarity)}
                  </span>
                </div>
              </div>
            </div>

            {/* Predicted Damage */}
            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Predicted Damage Exchange
              </h4>
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {prediction.predictedDamage.playerToOpponent}
                  </div>
                  <div className="text-xs text-gray-400">Your Damage</div>
                </div>
                <div className="text-2xl text-gray-500">←→</div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {prediction.predictedDamage.opponentToPlayer}
                  </div>
                  <div className="text-xs text-gray-400">Opponent Damage</div>
                </div>
              </div>
            </div>

            {/* Key Factors */}
            <div>
              <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-3">
                Battle Factors
              </h4>
              <div className="space-y-2">
                {prediction.factors.map((factor, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      factor.advantage === 'player' ? 'bg-green-500/10 border border-green-500/20'
                        : factor.advantage === 'opponent' ? 'bg-red-500/10 border border-red-500/20'
                        : 'bg-gray-500/10 border border-gray-500/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-lg ${
                        factor.advantage === 'player' ? 'text-green-400'
                          : factor.advantage === 'opponent' ? 'text-red-400'
                          : 'text-gray-400'
                      }`}>
                        {factor.advantage === 'player' ? '▲' 
                          : factor.advantage === 'opponent' ? '▼'
                          : '◆'}
                      </span>
                      <span className="text-sm text-white">{factor.factor}</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      Impact: {Math.round(factor.impact)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Insights */}
            {prediction.keyInsights.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-yellow-400 uppercase tracking-wide mb-3">
                  💡 Key Insights
                </h4>
                <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/30">
                  <ul className="space-y-2">
                    {prediction.keyInsights.map((insight, i) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="text-yellow-400">★</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Recommended Strategy */}
            <div>
              <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wide mb-3">
                🎯 Recommended Strategy
              </h4>
              <div className="bg-cyan-500/10 rounded-xl p-4 border border-cyan-500/30">
                <p className="text-white text-sm">{prediction.recommendedStrategy}</p>
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="w-full py-3 rounded-xl font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              Compare Another Card
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Card Selector Component
function CardSelector({
  cards,
  selectedCard,
  onSelect,
  color
}: {
  cards: Card[]
  selectedCard: Card | null
  onSelect: (card: Card) => void
  color: 'red' | 'blue'
}) {
  const borderColors = {
    red: 'border-red-500/30 hover:border-red-400',
    blue: 'border-blue-500/30 hover:border-blue-400',
  }
  
  const accentColors = {
    red: 'text-red-400',
    blue: 'text-blue-400',
  }

  if (selectedCard) {
    return (
      <button
        onClick={() => onSelect(null as any)}
        className={`w-full p-4 rounded-xl bg-gradient-to-br ${borderColors[color]} bg-black/30 border-2 transition-all hover:scale-105`}
      >
        <div className="text-4xl mb-2">{getCardEmoji(selectedCard.type)}</div>
        <div className="text-sm text-white truncate">{selectedCard.name}</div>
        <div className="flex gap-2 mt-2 justify-center">
          <span className="text-xs px-2 py-1 rounded bg-red-500/80 text-white">{selectedCard.attack}</span>
          <span className="text-xs px-2 py-1 rounded bg-blue-500/80 text-white">{selectedCard.defense}</span>
        </div>
        <div className="text-xs text-gray-400 mt-2">Click to change</div>
      </button>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto scrollbar-hide">
      {cards.slice(0, 6).map(card => (
        <button
          key={card.id}
          onClick={() => onSelect(card)}
          className={`p-3 rounded-xl border ${borderColors[color]} bg-black/30 hover:bg-black/50 transition-all`}
        >
          <div className="text-2xl mb-1">{getCardEmoji(card.type)}</div>
          <div className="text-xs text-white truncate">{card.name}</div>
          <div className="flex gap-1 mt-1 justify-center">
            <span className="text-[10px] px-1 rounded bg-red-500/80 text-white">{card.attack}</span>
            <span className="text-[10px] px-1 rounded bg-blue-500/80 text-white">{card.defense}</span>
          </div>
        </button>
      ))}
    </div>
  )
}

// Stat Comparison Component
function StatComparison({
  label,
  playerValue,
  opponentValue,
  color,
  inverted = false
}: {
  label: string
  playerValue: number
  opponentValue: number
  color: 'red' | 'blue'
  inverted?: boolean
}) {
  const playerHigher = inverted ? playerValue < opponentValue : playerValue > opponentValue
  const percentage = Math.min(100, (playerValue / (playerValue + opponentValue)) * 100)
  
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className={color === 'red' ? 'text-red-400' : 'text-blue-400'}>{label}</span>
        <span className="text-white font-bold">{playerValue}</span>
      </div>
      <div className="h-2 bg-black/50 rounded-full overflow-hidden">
        <div
          className={`h-full ${color === 'red' ? 'bg-red-500' : 'bg-blue-500'} transition-all duration-1000`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {playerHigher && (
        <div className="text-[10px] text-green-400 mt-1">▲ Advantage</div>
      )}
    </div>
  )
}

function getCardEmoji(type: string): string {
  const emojis: Record<string, string> = {
    Attack: '⚔️',
    Defense: '🛡️',
    Support: '✨',
    Special: '🌟',
  }
  return emojis[type] || '🎴'
}
