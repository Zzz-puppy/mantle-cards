'use client'

import { useState } from 'react'
import type { Card } from '@/types'
import { analyzeCard, type CardAnalysis } from '@/lib/ai-analyzer'

interface CardAnalyzerProps {
  cards: Card[]
  onClose?: () => void
}

export function CardAnalyzer({ cards, onClose }: CardAnalyzerProps) {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [analysis, setAnalysis] = useState<CardAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'battle' | 'synergy' | 'tips'>('overview')

  const handleAnalyze = async () => {
    if (!selectedCard) return
    
    setIsAnalyzing(true)
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const result = analyzeCard(selectedCard)
    setAnalysis(result)
    setIsAnalyzing(false)
  }

  const handleCardSelect = (card: Card) => {
    setSelectedCard(card)
    setAnalysis(null)
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">🔮</span>
              AI Card Analyzer
            </h2>
            <p className="text-gray-400 text-sm mt-1">Get detailed insights and recommendations</p>
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

      <div className="p-6">
        {/* Card Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Select a Card to Analyze
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[200px] overflow-y-auto scrollbar-hide">
            {cards.map(card => (
              <button
                key={card.id}
                onClick={() => handleCardSelect(card)}
                className={`relative p-3 rounded-xl border-2 transition-all duration-200 ${
                  selectedCard?.id === card.id
                    ? 'border-gold bg-gold/20 scale-105'
                    : 'border-white/10 bg-black/30 hover:border-white/30 hover:bg-black/50'
                }`}
              >
                <div className="text-3xl mb-1">{getCardEmoji(card)}</div>
                <div className="text-xs text-white truncate">{card.name}</div>
                <div className="flex gap-1 mt-1 justify-center">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/80 text-white">
                    {card.attack}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/80 text-white">
                    {card.defense}
                  </span>
                </div>
                {selectedCard?.id === card.id && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gold rounded-full flex items-center justify-center">
                    <span className="text-black text-xs">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={!selectedCard || isAnalyzing}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
            !selectedCard || isAnalyzing
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50'
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            <>
              <span className="text-2xl">⚡</span>
              Analyze Card
            </>
          )}
        </button>

        {/* Analysis Results */}
        {analysis && (
          <div className="mt-6 animate-fade-in-up">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
              {(['overview', 'battle', 'synergy', 'tips'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {tab === 'overview' && '📊 Overview'}
                  {tab === 'battle' && '⚔️ Battle'}
                  {tab === 'synergy' && '🤝 Synergy'}
                  {tab === 'tips' && '💡 Tips'}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
              {activeTab === 'overview' && (
                <OverviewTab analysis={analysis} card={selectedCard!} />
              )}
              {activeTab === 'battle' && (
                <BattleTab analysis={analysis} />
              )}
              {activeTab === 'synergy' && (
                <SynergyTab analysis={analysis} />
              )}
              {activeTab === 'tips' && (
                <TipsTab analysis={analysis} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Overview Tab Component
function OverviewTab({ analysis, card }: { analysis: CardAnalysis; card: Card }) {
  return (
    <div className="space-y-4">
      {/* Overall Score */}
      <div className="text-center mb-6">
        <div className="inline-block relative">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-4 border-purple-500/50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{analysis.overallScore}</div>
              <div className="text-xs text-gray-400">Overall Score</div>
            </div>
          </div>
          <div className="absolute -inset-2 rounded-full border-2 border-dashed border-purple-500/30 animate-spin-slow" style={{ animationDuration: '20s' }} />
        </div>
        <div className="mt-3 text-lg font-semibold text-purple-400">{analysis.potential}</div>
      </div>

      {/* Stats Bars */}
      <div className="grid grid-cols-2 gap-4">
        <StatBar label="Attack" value={analysis.attackRating} color="red" />
        <StatBar label="Defense" value={analysis.defenseRating} color="blue" />
      </div>

      {/* Strengths */}
      <div>
        <h4 className="text-sm font-semibold text-green-400 uppercase tracking-wide mb-2 flex items-center gap-2">
          <span>💪</span> Strengths
        </h4>
        <ul className="space-y-1">
          {analysis.strengths.map((strength, i) => (
            <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
              <span className="text-green-400">•</span>
              {strength}
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses */}
      <div>
        <h4 className="text-sm font-semibold text-red-400 uppercase tracking-wide mb-2 flex items-center gap-2">
          <span>⚠️</span> Weaknesses
        </h4>
        <ul className="space-y-1">
          {analysis.weaknesses.map((weakness, i) => (
            <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
              <span className="text-red-400">•</span>
              {weakness}
            </li>
          ))}
        </ul>
      </div>

      {/* Upgrade Suggestions */}
      <div>
        <h4 className="text-sm font-semibold text-yellow-400 uppercase tracking-wide mb-2 flex items-center gap-2">
          <span>⬆️</span> Upgrade Suggestions
        </h4>
        <ul className="space-y-1">
          {analysis.upgradeSuggestions.map((suggestion, i) => (
            <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
              <span className="text-yellow-400">→</span>
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// Battle Tab Component
function BattleTab({ analysis }: { analysis: CardAnalysis }) {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-white flex items-center gap-2">
        <span>⚔️</span> Battle Predictions
      </h4>

      {/* Strong Against */}
      <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/30">
        <h5 className="text-sm font-semibold text-green-400 uppercase tracking-wide mb-2">
          Strong Against
        </h5>
        <div className="flex flex-wrap gap-2">
          {analysis.battlePrediction.strongAgainst.map((type, i) => (
            <span key={i} className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm">
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* Weak Against */}
      <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/30">
        <h5 className="text-sm font-semibold text-red-400 uppercase tracking-wide mb-2">
          Weak Against
        </h5>
        <div className="flex flex-wrap gap-2">
          {analysis.battlePrediction.weakAgainst.map((type, i) => (
            <span key={i} className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-sm">
              {type}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// Synergy Tab Component
function SynergyTab({ analysis }: { analysis: CardAnalysis }) {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-white flex items-center gap-2">
        <span>🤝</span> Team Synergy
      </h4>

      {/* Best Teammates */}
      <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/30">
        <h5 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-2">
          Best Teammates
        </h5>
        <ul className="space-y-2">
          {analysis.bestTeammates.map((teammate, i) => (
            <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
              <span className="text-purple-400">◆</span>
              {teammate}
            </li>
          ))}
        </ul>
      </div>

      {/* Synergy Tips */}
      <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
        <h5 className="text-sm font-semibold text-blue-400 uppercase tracking-wide mb-2">
          Synergy Tips
        </h5>
        <ul className="space-y-2">
          {analysis.synergyTips.map((tip, i) => (
            <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
              <span className="text-blue-400">✦</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// Tips Tab Component
function TipsTab({ analysis }: { analysis: CardAnalysis }) {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-white flex items-center gap-2">
        <span>💡</span> Educational Tips
      </h4>

      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/30">
        <ul className="space-y-3">
          {analysis.educationalTips.map((tip, i) => (
            <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
              <span className="text-yellow-400">★</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// Stat Bar Component
function StatBar({ label, value, color }: { label: string; value: number; color: 'red' | 'blue' }) {
  const colorMap = {
    red: { bg: 'bg-red-500', text: 'text-red-400' },
    blue: { bg: 'bg-blue-500', text: 'text-blue-400' },
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className={`text-sm font-semibold ${colorMap[color].text}`}>{label}</span>
        <span className={`text-sm font-bold ${colorMap[color].text}`}>{value}/100</span>
      </div>
      <div className="h-3 bg-black/50 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorMap[color].bg} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

function getCardEmoji(card: Card): string {
  if (!card) return '🎴'
  // Derive display type from card stats
  if (card.attack >= 70 && card.defense < 50) return '⚔️'
  if (card.defense >= 70 && card.attack < 50) return '🛡️'
  if (card.specialAbility && card.attack >= 50) return '🌟'
  return '🎴'
}
