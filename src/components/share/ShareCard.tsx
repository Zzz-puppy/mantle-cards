'use client'

import { useCallback, useRef, useEffect, useState } from 'react'
import type { Card } from '@/types/card'
import type { BattleResult } from '@/types/battle'

interface ShareCardData {
  type: 'card' | 'battle'
  card?: Card
  battle?: BattleResult
  playerName?: string
  referralCode?: string
}

interface ShareCardProps {
  data: ShareCardData
  onGenerated?: (dataUrl: string) => void
}

// Rarity colors
const rarityColors = {
  legendary: { primary: '#FFD700', secondary: '#FFA500', glow: 'rgba(255, 215, 0, 0.5)' },
  epic: { primary: '#8B5CF6', secondary: '#A78BFA', glow: 'rgba(139, 92, 246, 0.5)' },
  rare: { primary: '#3B82F6', secondary: '#60A5FA', glow: 'rgba(59, 130, 246, 0.5)' },
  common: { primary: '#6B7280', secondary: '#9CA3AF', glow: 'rgba(107, 114, 128, 0.5)' },
}

export function ShareCard({ data, onGenerated }: ShareCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateShareImage = useCallback(async (): Promise<string> => {
    const canvas = canvasRef.current
    if (!canvas) throw new Error('Canvas not available')

    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas context not available')

    // Set canvas size for social media (1200x630)
    canvas.width = 1200
    canvas.height = 630

    setIsGenerating(true)

    try {
      if (data.type === 'card' && data.card) {
        await drawCardShare(ctx, data.card, data.referralCode)
      } else if (data.type === 'battle' && data.battle) {
        await drawBattleShare(ctx, data.battle, data.playerName, data.referralCode)
      }

      const dataUrl = canvas.toDataURL('image/png', 1.0)
      onGenerated?.(dataUrl)
      return dataUrl
    } finally {
      setIsGenerating(false)
    }
  }, [data, onGenerated])

  useEffect(() => {
    generateShareImage()
  }, [generateShareImage])

  return (
    <div className="share-card-generator">
      <canvas
        ref={canvasRef}
        className="hidden"
      />
      {isGenerating && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
        </div>
      )}
    </div>
  )
}

async function drawCardShare(
  ctx: CanvasRenderingContext2D,
  card: Card,
  referralCode?: string
) {
  const colors = rarityColors[card.rarity] || rarityColors.common

  // Background gradient
  const bgGradient = ctx.createLinearGradient(0, 0, 1200, 630)
  bgGradient.addColorStop(0, '#1a1a2e')
  bgGradient.addColorStop(0.5, '#16213e')
  bgGradient.addColorStop(1, '#0f3460')
  ctx.fillStyle = bgGradient
  ctx.fillRect(0, 0, 1200, 630)

  // Decorative corner elements
  drawCornerDecoration(ctx, 0, 0, colors.primary, 1)
  drawCornerDecoration(ctx, 1200, 0, colors.primary, -1)
  drawCornerDecoration(ctx, 0, 630, colors.primary, -1)
  drawCornerDecoration(ctx, 1200, 630, colors.primary, 1)

  // Logo/Brand area (top left)
  ctx.fillStyle = colors.primary
  ctx.font = 'bold 28px Arial'
  ctx.fillText('🎴 AI CARD GAME', 50, 55)

  // Card image area
  const cardX = 100
  const cardY = 140
  const cardW = 400
  const cardH = 350

  // Card glow effect
  ctx.shadowColor = colors.glow
  ctx.shadowBlur = 30
  ctx.fillStyle = '#1a1a2e'
  ctx.beginPath()
  ctx.roundRect(cardX, cardY, cardW, cardH, 20)
  ctx.fill()
  ctx.shadowBlur = 0

  // Card border with rarity color
  ctx.strokeStyle = colors.primary
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.roundRect(cardX, cardY, cardW, cardH, 20)
  ctx.stroke()

  // Card name
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 36px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(card.name, cardX + cardW / 2, cardY + 50)

  // Card image placeholder (gradient background with icon)
  const imgY = cardY + 70
  const imgH = 180
  const imgGradient = ctx.createLinearGradient(cardX + 20, imgY, cardX + 20, imgY + imgH)
  imgGradient.addColorStop(0, colors.secondary)
  imgGradient.addColorStop(1, colors.primary)
  ctx.fillStyle = imgGradient
  ctx.beginPath()
  ctx.roundRect(cardX + 20, imgY, cardW - 40, imgH, 10)
  ctx.fill()

  // Card type icon
  ctx.fillStyle = 'rgba(0,0,0,0.3)'
  ctx.font = '80px Arial'
  ctx.fillText('🎴', cardX + cardW / 2, imgY + imgH / 2 + 25)

  // Attack and Defense stats
  const statsY = cardY + 280
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 32px Arial'

  // Attack
  ctx.fillStyle = '#EF4444'
  ctx.fillText(`⚔️ ${card.attack}`, cardX + 80, statsY)

  // Defense
  ctx.fillStyle = '#3B82F6'
  ctx.fillText(`🛡️ ${card.defense}`, cardX + cardW - 180, statsY)

  // Rarity badge
  ctx.fillStyle = colors.primary
  ctx.font = 'bold 24px Arial'
  ctx.fillText(card.rarity.toUpperCase(), cardX + cardW / 2, statsY + 50)

  // Right side content
  const rightX = 560

  // Title
  ctx.fillStyle = '#FFD700'
  ctx.font = 'bold 48px Arial'
  ctx.textAlign = 'left'
  ctx.fillText('CHECK OUT', rightX, 200)
  ctx.fillText('MY CARD!', rightX, 260)

  // Card stats summary
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '24px Arial'
  ctx.fillText(`Token ID: #${card.id.toString()}`, rightX, 320)
  ctx.fillText(`Rarity: ${card.rarity}`, rightX, 360)

  if (card.specialAbility) {
    ctx.fillStyle = '#A78BFA'
    ctx.fillText(`Ability: ${card.specialAbility}`, rightX, 400)
  }

  // Referral/Share link
  if (referralCode) {
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.font = '18px Arial'
    ctx.fillText(`Play & earn: yoursite.com/?ref=${referralCode}`, rightX, 500)
  }

  // Footer branding
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.font = '16px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('Mantle AI Trading Card Game | mantlenetwork.io', 600, 600)

  ctx.textAlign = 'left'
}

async function drawBattleShare(
  ctx: CanvasRenderingContext2D,
  battle: BattleResult,
  playerName?: string,
  referralCode?: string
) {
  const isVictory = battle.winner === 'player'
  const primaryColor = isVictory ? '#FFD700' : '#6B7280'
  const secondaryColor = isVictory ? '#FFA500' : '#9CA3AF'

  // Background gradient
  const bgGradient = ctx.createLinearGradient(0, 0, 1200, 630)
  bgGradient.addColorStop(0, '#1a1a2e')
  bgGradient.addColorStop(0.5, '#16213e')
  bgGradient.addColorStop(1, '#0f3460')
  ctx.fillStyle = bgGradient
  ctx.fillRect(0, 0, 1200, 630)

  // Victory/Defeat header
  ctx.fillStyle = primaryColor
  ctx.font = 'bold 72px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(isVictory ? '🏆 VICTORY!' : '💀 DEFEAT', 600, 100)

  // Battle result subtitle
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '28px Arial'
  ctx.fillText(
    `${playerName || 'Player'} vs ${battle.opponentCard.name}`,
    600,
    150
  )

  // VS divider line
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(100, 200)
  ctx.lineTo(1100, 200)
  ctx.stroke()

  // Player card (left)
  drawBattleCard(ctx, battle.playerCard, battle.playerDamage, 150, 250, true, battle.winner === 'player')

  // VS text
  ctx.fillStyle = '#FFD700'
  ctx.font = 'bold 48px Arial'
  ctx.fillText('VS', 600, 450)

  // Opponent card (right)
  drawBattleCard(ctx, battle.opponentCard, battle.opponentDamage, 700, 250, false, battle.winner === 'opponent')

  // Stats summary
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '24px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(`Your Damage: ${battle.playerDamage} | Damage Taken: ${battle.opponentDamage}`, 600, 540)

  // Footer
  if (referralCode) {
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.font = '18px Arial'
    ctx.fillText(`Play & earn: yoursite.com/?ref=${referralCode}`, 600, 580)
  }

  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.font = '16px Arial'
  ctx.fillText('Mantle AI Trading Card Game | mantlenetwork.io', 600, 610)

  ctx.textAlign = 'left'
}

function drawBattleCard(
  ctx: CanvasRenderingContext2D,
  card: Card,
  damage: number,
  x: number,
  y: number,
  isPlayer: boolean,
  isWinner: boolean
) {
  const cardW = 350
  const cardH = 250

  // Card glow if winner
  if (isWinner) {
    ctx.shadowColor = 'rgba(255, 215, 0, 0.5)'
    ctx.shadowBlur = 20
  }

  // Card background
  ctx.fillStyle = isWinner ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)'
  ctx.beginPath()
  ctx.roundRect(x, y, cardW, cardH, 15)
  ctx.fill()

  // Border
  ctx.strokeStyle = isWinner ? '#FFD700' : 'rgba(255, 255, 255, 0.2)'
  ctx.lineWidth = 3
  ctx.stroke()
  ctx.shadowBlur = 0

  // Card name
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 24px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(card.name, x + cardW / 2, y + 40)

  // Card type/owner
  ctx.fillStyle = isPlayer ? '#3B82F6' : '#EF4444'
  ctx.font = '16px Arial'
  ctx.fillText(isPlayer ? 'Your Card' : 'Opponent', x + cardW / 2, y + 65)

  // Card image placeholder
  const imgY = y + 80
  const imgH = 100
  const imgGradient = ctx.createLinearGradient(x + 25, imgY, x + 25, imgY + imgH)
  imgGradient.addColorStop(0, isPlayer ? '#3B82F6' : '#EF4444')
  imgGradient.addColorStop(1, isPlayer ? '#1D4ED8' : '#B91C1C')
  ctx.fillStyle = imgGradient
  ctx.beginPath()
  ctx.roundRect(x + 25, imgY, cardW - 50, imgH, 8)
  ctx.fill()

  // Card icon
  ctx.fillStyle = 'rgba(0,0,0,0.3)'
  ctx.font = '50px Arial'
  ctx.fillText('🎴', x + cardW / 2, imgY + imgH / 2 + 15)

  // Stats
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 20px Arial'
  ctx.fillText(
    `⚔️ ${card.attack}  🛡️ ${card.defense}`,
    x + cardW / 2,
    y + 210
  )

  // Damage dealt
  ctx.fillStyle = isPlayer ? '#22C55E' : '#EF4444'
  ctx.font = 'bold 18px Arial'
  ctx.fillText(
    `${isPlayer ? 'Dealt' : 'Took'}: ${damage}`,
    x + cardW / 2,
    y + 235
  )
}

function drawCornerDecoration(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  direction: number
) {
  ctx.fillStyle = color
  ctx.globalAlpha = 0.3

  // Draw decorative corner shapes
  ctx.beginPath()
  if (direction === 1) {
    ctx.moveTo(x, y + 50)
    ctx.lineTo(x, y)
    ctx.lineTo(x + 50, y)
  } else if (direction === -1) {
    ctx.moveTo(x, y - 50)
    ctx.lineTo(x, y)
    ctx.lineTo(x - 50, y)
  } else if (direction === 2) {
    ctx.moveTo(x, y - 50)
    ctx.lineTo(x, y)
    ctx.lineTo(x - 50, y)
  } else {
    ctx.moveTo(x, y + 50)
    ctx.lineTo(x, y)
    ctx.lineTo(x + 50, y)
  }
  ctx.closePath()
  ctx.fill()
  ctx.globalAlpha = 1
}

// Hook for generating share images
export function useShareCard() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const getCanvas = useCallback(() => {
    if (typeof window === 'undefined') return null
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas')
    }
    return canvasRef.current
  }, [])

  const generateCardShare = useCallback(
    async (card: Card, referralCode?: string): Promise<string> => {
      const canvas = getCanvas()
      if (!canvas) throw new Error('Canvas not available')

      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas context not available')

      canvas.width = 1200
      canvas.height = 630

      await drawCardShare(ctx, card, referralCode)
      return canvas.toDataURL('image/png', 1.0)
    },
    [getCanvas]
  )

  const generateBattleShare = useCallback(
    async (
      battle: BattleResult,
      playerName?: string,
      referralCode?: string
    ): Promise<string> => {
      const canvas = getCanvas()
      if (!canvas) throw new Error('Canvas not available')

      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas context not available')

      canvas.width = 1200
      canvas.height = 630

      await drawBattleShare(ctx, battle, playerName, referralCode)
      return canvas.toDataURL('image/png', 1.0)
    },
    [getCanvas]
  )

  return { generateCardShare, generateBattleShare }
}

export default ShareCard