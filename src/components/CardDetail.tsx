'use client'

import type { Card as CardType } from '@/types'
import { useEffect, useState } from 'react'
import { Card } from './Card'
import { formatAddress } from '@/lib/utils'
import { analyzeCard, type CardAnalysis } from '@/lib/ai-analyzer'
import { ShareModal } from './share/ShareModal'

interface CardDetailProps {
  card: CardType
  isOpen: boolean
  onClose: () => void
  onBattle?: () => void
  onSell?: () => void
}

export function CardDetail({ card, isOpen, onClose, onBattle, onSell }: CardDetailProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [analysis, setAnalysis] = useState<CardAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10)
    } else {
      setIsVisible(false)
      setShowAnalysis(false)
    }
  }, [isOpen])

  const handleAnalyze = async () => {
    if (isAnalyzing) return
    setIsAnalyzing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    const result = analyzeCard(card)
    setAnalysis(result)
    setShowAnalysis(true)
    setIsAnalyzing(false)
  }

  if (!isOpen) return null

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 
                  transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      {/* Modal Content */}
      <div 
        className={`relative z-10 max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300
                   ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/60 hover:text-white text-3xl transition-colors"
        >
          ×
        </button>

        <div className="bg-gradient-to-br from-[#1a1625] via-[#2d1f3d] to-[#1a2535]
                        rounded-2xl border border-white/10 overflow-hidden
                        shadow-2xl shadow-[#7C6BAF]/20">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{card.name}</h2>
                <p className="text-gray-400 text-sm">Token ID: #{card.id.toString()}</p>
              </div>
              <RarityBadge rarity={card.rarity} />
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-8 p-6">
            {/* Left - Card Display */}
            <div className="flex justify-center">
              <div className="transform hover:scale-105 transition-transform duration-300">
                <Card card={card} />
              </div>
            </div>

            {/* Right - Stats & Info */}
            <div className="space-y-6">
              {/* Stats Section */}
              <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Battle Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <StatBox 
                    label="Attack" 
                    value={card.attack} 
                    icon="⚔️" 
                    color="red"
                  />
                  <StatBox 
                    label="Defense" 
                    value={card.defense} 
                    icon="🛡️" 
                    color="blue"
                  />
                </div>
              </div>

              {/* Type & Ability */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getTypeEmoji(card)}</span>
                  <div>
                    <p className="text-xs text-gray-400">Card Type</p>
                    <p className="text-white font-medium">{getCardTypeName(card)}</p>
                  </div>
                </div>

                {card.specialAbility && (
                  <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
                    <p className="text-xs text-purple-400 uppercase tracking-wide mb-1">Special Ability</p>
                    <p className="text-white text-sm">{card.specialAbility}</p>
                  </div>
                )}
              </div>

              {/* Owner Info */}
              <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Current Owner</p>
                <p className="text-gold font-mono text-sm">{formatAddress(card.owner)}</p>
              </div>

              {/* Transaction History Placeholder */}
              <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Transaction History</p>
                <div className="space-y-2">
                  <TransactionItem type="Minted" date="2024-01-15" />
                  <TransactionItem type="Sold" date="2024-01-20" />
                  <TransactionItem type="Transferred" date="2024-02-01" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={onBattle}
                  className="flex-1 bg-gradient-to-r from-rose-600 to-rose-500
                           text-white font-bold py-3 px-6 rounded-xl
                           hover:from-rose-500 hover:to-rose-400 transition-all
                           shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40
                           flex items-center justify-center gap-2"
                >
                  <span>⚔️</span> Battle
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="flex-1 bg-gradient-to-r from-[#7C6BAF] to-[#9B8AC9]
                           text-white font-bold py-3 px-6 rounded-xl
                           hover:from-[#9B8AC9] hover:to-[#7C6BAF] transition-all
                           shadow-lg shadow-[#7C6BAF]/25 hover:shadow-[#7C6BAF]/40
                           flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <span>🔮</span> Analyze
                    </>
                  )}
                </button>
                <button
                  onClick={onSell}
                  className="flex-1 bg-gradient-to-r from-[#C9A227] to-[#D4B445]
                           text-black font-bold py-3 px-6 rounded-xl
                           hover:from-[#D4B445] hover:to-[#C9A227] transition-all
                           shadow-lg shadow-[#C9A227]/25 hover:shadow-[#C9A227]/40
                           flex items-center justify-center gap-2"
                >
                  <span>💰</span> Sell
                </button>
              </div>

              {/* Share Button */}
              <button
                onClick={() => setIsShareOpen(true)}
                className="w-full bg-white/5 hover:bg-white/10 text-white/80
                         py-2 px-4 rounded-xl border border-white/10
                         transition-all flex items-center justify-center gap-2 text-sm"
              >
                <span>🔗</span> Share Card
              </button>

              {/* AI Analysis Result Panel */}
              {showAnalysis && analysis && (
                <div className="mt-4 p-4 bg-gradient-to-br from-[#7C6BAF]/20 to-[#9B8AC9]/20 rounded-xl border border-[#7C6BAF]/30 animate-fade-in-up">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-purple-400 flex items-center gap-2">
                      <span>🔮</span> AI Analysis
                    </h4>
                    <button
                      onClick={() => setShowAnalysis(false)}
                      className="text-white/60 hover:text-white text-lg"
                    >
                      ×
                    </button>
                  </div>

                  {/* Overall Score */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-2 border-purple-500/50 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-xl font-bold text-white">{analysis.overallScore}</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">{analysis.potential}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Attack: {analysis.attackRating} | Defense: {analysis.defenseRating}
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats Bars */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-red-400">Attack</span>
                        <span className="text-white">{analysis.attackRating}</span>
                      </div>
                      <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${analysis.attackRating}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-blue-400">Defense</span>
                        <span className="text-white">{analysis.defenseRating}</span>
                      </div>
                      <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${analysis.defenseRating}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <h5 className="text-xs font-semibold text-green-400 mb-1">💪 Strengths</h5>
                      <ul className="text-xs text-gray-300 space-y-1">
                        {analysis.strengths.slice(0, 2).map((s, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-green-400">•</span>
                            <span className="truncate">{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-xs font-semibold text-red-400 mb-1">⚠️ Weaknesses</h5>
                      <ul className="text-xs text-gray-300 space-y-1">
                        {analysis.weaknesses.slice(0, 2).map((w, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-red-400">•</span>
                            <span className="truncate">{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Battle Matchups */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-green-500/10 rounded-lg p-2 border border-green-500/20">
                      <h5 className="text-[10px] font-semibold text-green-400 mb-1">Strong Against</h5>
                      <div className="flex flex-wrap gap-1">
                        {analysis.battlePrediction.strongAgainst.slice(0, 2).map((t, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-red-500/10 rounded-lg p-2 border border-red-500/20">
                      <h5 className="text-[10px] font-semibold text-red-400 mb-1">Weak Against</h5>
                      <div className="flex flex-wrap gap-1">
                        {analysis.battlePrediction.weakAgainst.slice(0, 2).map((t, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Educational Tip */}
                  {analysis.educationalTips.length > 0 && (
                    <div className="bg-yellow-500/10 rounded-lg p-2 border border-yellow-500/20">
                      <h5 className="text-[10px] font-semibold text-yellow-400 mb-1">💡 Did You Know?</h5>
                      <p className="text-xs text-gray-300">{analysis.educationalTips[0]}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        data={{ type: 'card', card }}
      />
    </div>
  )
}

function RarityBadge({ rarity }: { rarity: string }) {
  const styles: Record<string, string> = {
    Legendary: 'bg-gradient-to-r from-amber-400 to-orange-400 text-black font-bold px-4 py-2 rounded-full',
    Epic: 'bg-violet-500/90 text-white font-semibold px-4 py-2 rounded-full',
    Rare: 'bg-blue-500/90 text-white font-semibold px-4 py-2 rounded-full',
    Common: 'bg-slate-500/90 text-white font-semibold px-4 py-2 rounded-full',
  }

  return (
    <span className={styles[rarity] || styles.Common}>
      {rarity}
    </span>
  )
}

function StatBox({ label, value, icon, color }: {
  label: string
  value: number
  icon: string
  color: 'red' | 'blue'
}) {
  const colorStyles = {
    red: 'from-red-500/15 to-red-600/15 border-red-500/25',
    blue: 'from-blue-500/15 to-blue-600/15 border-blue-500/25',
  }
  const valueStyles = {
    red: 'text-red-400',
    blue: 'text-blue-400',
  }

  return (
    <div className={`bg-gradient-to-br ${colorStyles[color]} rounded-xl p-4 border`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <span className="text-xs text-gray-400 uppercase tracking-wide">{label}</span>
      </div>
      <p className={`text-3xl font-bold ${valueStyles[color]}`}>{value}</p>
    </div>
  )
}

function TransactionItem({ type, date }: { type: string; date: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-300">{type}</span>
      <span className="text-gray-500">{date}</span>
    </div>
  )
}

function getTypeEmoji(card: CardType): string {
  if (card.attack >= 70 && card.defense < 50) return '⚔️'
  if (card.defense >= 70 && card.attack < 50) return '🛡️'
  if (card.specialAbility && card.attack >= 50) return '🌟'
  return '✨'
}

function getCardTypeName(card: CardType): string {
  if (card.attack >= 70 && card.defense < 50) return 'Attack'
  if (card.defense >= 70 && card.attack < 50) return 'Defense'
  if (card.specialAbility && card.attack >= 50) return 'Special'
  return 'Support'
}
