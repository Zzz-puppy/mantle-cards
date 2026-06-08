'use client'

import type { BattleResult as BattleResultType, BattleRewards } from '@/types/battle'
import { Card } from '@/types/card'
import { AIProfile } from '@/lib/ai-profiles'
import { AgentIdentityMini } from '@/components/agent/AgentIdentity'
import { getAgentById } from '@/lib/agent-data'
import { useState } from 'react'
import { ShareModal } from '@/components/share/ShareModal'
import { generateReferralCode } from '@/lib/social-share'

interface BattleResultProps {
  result: BattleResult
  rewards: BattleRewards
  aiProfile: AIProfile
  agentId?: string
  playerCards: Card[]
  opponentCards: Card[]
  onPlayAgain: () => void
  onReturnToCollection: () => void
}

export function BattleResult({
  result,
  rewards,
  aiProfile,
  agentId,
  playerCards,
  opponentCards,
  onPlayAgain,
  onReturnToCollection,
}: BattleResultProps) {
  const [showShare, setShowShare] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const isVictory = result.winner === 'player'
  const referralCode = generateReferralCode()

  // Get agent identity data
  const agentData = agentId ? getAgentById(agentId) : null

  const getShareText = () => {
    return `I just ${isVictory ? 'won' : 'lost'} a battle against ${aiProfile.name} in the AI Trading Card Game! ${isVictory ? '🏆' : '💀'}`
  }

  const handleShare = async () => {
    const text = getShareText()
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Battle Result',
          text: text,
        })
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(text)
      setShowShare(true)
      setTimeout(() => setShowShare(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Result Header */}
        <div className="text-center mb-8">
          <div className={`text-6xl mb-4 ${isVictory ? 'animate-bounce' : 'opacity-50'}`}>
            {isVictory ? '🏆' : '💀'}
          </div>
          <h1 className={`text-4xl font-black mb-2 ${isVictory ? 'text-yellow-400' : 'text-gray-400'}`}>
            {isVictory ? 'VICTORY!' : 'DEFEAT'}
          </h1>
          
          {/* Opponent Agent Identity */}
          <div className="mt-4 inline-flex items-center gap-3 px-4 py-2 bg-gray-800/50 rounded-full">
            <img
              src={agentData?.avatar || '/avatars/default-agent.png'}
              alt={aiProfile.name}
              className="w-10 h-10 rounded-full bg-gray-700"
            />
            <div className="text-left">
              <div className="text-sm text-gray-400">Defeated</div>
              <div className="font-bold text-white">{aiProfile.name}</div>
            </div>
            {agentData && (
              <div className="text-right">
                <AgentIdentityMini agent={agentData} />
              </div>
            )}
          </div>
          
          {/* Reputation Change */}
          {agentData && (
            <div className={`mt-4 text-lg font-bold ${isVictory ? 'text-green-400' : 'text-red-400'}`}>
              {isVictory ? '+' : '-'}{rewards.rankingPoints} Reputation Points
            </div>
          )}
        </div>

        {/* Final Stats */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">Final Statistics</h2>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Player Stats */}
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">{result.playerDamage}</div>
              <div className="text-sm text-gray-400">Your Damage Dealt</div>
            </div>
            
            {/* Opponent Stats */}
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-1">{result.opponentDamage}</div>
              <div className="text-sm text-gray-400">Damage Taken</div>
            </div>
          </div>
        </div>

        {/* Cards Used */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">Cards Used</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Player Card */}
            <div className="text-center">
              <div className="text-xs text-blue-400 mb-2">Your Card</div>
              <div className="p-3 rounded-lg bg-blue-900/30 border border-blue-600">
                <div className="w-full h-20 rounded bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center mb-2">
                  {result.playerCard.image ? (
                    <img src={result.playerCard.image} alt={result.playerCard.name} className="w-full h-full object-cover rounded" />
                  ) : (
                    <span className="text-3xl">🎴</span>
                  )}
                </div>
                <div className="text-sm font-bold text-white">{result.playerCard.name}</div>
                <div className="flex justify-center gap-2 text-xs mt-1">
                  <span className="text-red-400">⚔️ {result.playerCard.attack}</span>
                  <span className="text-blue-400">🛡️ {result.playerCard.defense}</span>
                </div>
              </div>
            </div>

            {/* Opponent Card */}
            <div className="text-center">
              <div className="text-xs text-red-400 mb-2">Opponent Card</div>
              <div className="p-3 rounded-lg bg-red-900/30 border border-red-600">
                <div className="w-full h-20 rounded bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center mb-2">
                  {result.opponentCard.image ? (
                    <img src={result.opponentCard.image} alt={result.opponentCard.name} className="w-full h-full object-cover rounded" />
                  ) : (
                    <span className="text-3xl">🎴</span>
                  )}
                </div>
                <div className="text-sm font-bold text-white">{result.opponentCard.name}</div>
                <div className="flex justify-center gap-2 text-xs mt-1">
                  <span className="text-red-400">⚔️ {result.opponentCard.attack}</span>
                  <span className="text-blue-400">🛡️ {result.opponentCard.defense}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rewards */}
        {isVictory && (
          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-xl p-6 mb-6 border border-yellow-600/50">
            <h2 className="text-lg font-bold text-yellow-400 mb-4">🎁 Rewards Earned</h2>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">+{rewards.exp}</div>
                <div className="text-xs text-gray-400">EXP</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">+{rewards.tokens}</div>
                <div className="text-xs text-gray-400">Tokens</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">+{rewards.rankingPoints}</div>
                <div className="text-xs text-gray-400">Rank Points</div>
              </div>
            </div>
          </div>
        )}

        {/* Opponent Achievements */}
        {isVictory && agentData && agentData.achievements.length > 0 && (
          <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-bold text-white mb-4">🏆 Opponent Achievements</h2>
            <p className="text-sm text-gray-400 mb-3">These achievements were earned by {aiProfile.name} in past battles:</p>
            <div className="grid grid-cols-3 gap-3">
              {agentData.achievements.slice(0, 6).map((ach) => (
                <div key={ach.id} className="text-center">
                  <div className="w-12 h-12 mx-auto mb-1 rounded-full bg-yellow-900/30 border border-yellow-600/50 flex items-center justify-center text-2xl">
                    🏆
                  </div>
                  <p className="text-xs text-white font-medium">{ach.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Battle Timestamp */}
        <div className="text-center text-gray-500 text-sm mb-6">
          Battle ID: {result.id}
          <br />
          {new Date(result.timestamp).toLocaleString()}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onPlayAgain}
            className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg"
          >
            ⚔️ Play Again
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className="flex-1 py-3 rounded-xl font-bold bg-gray-700 text-white hover:bg-gray-600 transition-all"
            >
              {showShare ? '✓ Copied!' : '📤 Share Result'}
            </button>
            
            <button
              onClick={onReturnToCollection}
              className="flex-1 py-3 rounded-xl font-bold bg-gray-700 text-white hover:bg-gray-600 transition-all"
            >
              🃏 Return to Collection
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        data={{ type: 'battle', battle: result }}
        referralCode={referralCode}
      />
    </div>
  )
}
