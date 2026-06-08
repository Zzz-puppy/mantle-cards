'use client'

import { useEffect, useState } from 'react'

interface BattleEffectProps {
  type: 'attack' | 'damage' | 'heal' | 'ability' | 'victory' | 'defeat'
  target?: 'player' | 'opponent'
  value?: number
  message?: string
  duration?: number
  onComplete?: () => void
}

export function BattleEffect({
  type,
  target = 'opponent',
  value,
  message,
  duration = 1000,
  onComplete,
}: BattleEffectProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onComplete])

  if (!isVisible) return null

  const getEffectStyle = () => {
    switch (type) {
      case 'attack':
        return 'animate-slash-effect'
      case 'damage':
        return 'animate-damage-shake'
      case 'heal':
        return 'animate-heal-glow'
      case 'ability':
        return 'animate-ability-burst'
      case 'victory':
        return 'animate-victory-celebration'
      case 'defeat':
        return 'animate-defeat-fade'
      default:
        return ''
    }
  }

  const getEffectColor = () => {
    switch (type) {
      case 'attack':
        return 'text-red-500'
      case 'damage':
        return 'text-red-600'
      case 'heal':
        return 'text-green-500'
      case 'ability':
        return 'text-purple-500'
      case 'victory':
        return 'text-yellow-400'
      case 'defeat':
        return 'text-gray-400'
      default:
        return 'text-white'
    }
  }

  const getEffectIcon = () => {
    switch (type) {
      case 'attack':
        return '⚔️'
      case 'damage':
        return '💥'
      case 'heal':
        return '💚'
      case 'ability':
        return '✨'
      case 'victory':
        return '🏆'
      case 'defeat':
        return '💀'
      default:
        return '•'
    }
  }

  return (
    <div
      className={`
        fixed inset-0 flex items-center justify-center z-50
        pointer-events-none ${getEffectStyle()}
      `}
    >
      <div className={`flex flex-col items-center ${getEffectColor()}`}>
        <span className="text-6xl md:text-8xl animate-bounce">
          {getEffectIcon()}
        </span>
        {value !== undefined && (
          <div className="text-4xl md:text-6xl font-black mt-2 animate-pulse">
            {type === 'damage' && '-'}
            {type === 'heal' && '+'}
            {value}
          </div>
        )}
        {message && (
          <div className="text-xl md:text-2xl font-bold mt-2 text-center px-4">
            {message}
          </div>
        )}
      </div>
    </div>
  )
}

interface FloatingDamageProps {
  damage: number
  position: { x: number; y: number }
  onComplete?: () => void
}

export function FloatingDamage({ damage, position, onComplete }: FloatingDamageProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, 1500)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!isVisible) return null

  return (
    <div
      className="absolute animate-float-up pointer-events-none z-50"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="text-4xl font-black text-red-500 drop-shadow-lg animate-pulse">
        -{damage}
      </div>
    </div>
  )
}

interface HealthBarChangeProps {
  oldValue: number
  newValue: number
  maxValue: number
  target: 'player' | 'opponent'
}

export function HealthBarChange({ oldValue, newValue, maxValue, target }: HealthBarChangeProps) {
  const percentage = (newValue / maxValue) * 100
  const oldPercentage = (oldValue / maxValue) * 100

  return (
    <div className={`w-full ${target === 'player' ? 'bg-blue-900' : 'bg-red-900'} rounded-full h-4 overflow-hidden`}>
      <div
        className={`
          h-full transition-all duration-500 ease-out
          ${target === 'player' ? 'bg-blue-500' : 'bg-red-500'}
        `}
        style={{ width: `${percentage}%` }}
      />
      {oldPercentage !== percentage && (
        <div
          className="absolute top-0 h-full bg-red-700/50 transition-all duration-1000"
          style={{ width: `${oldPercentage}%` }}
        />
      )}
    </div>
  )
}
