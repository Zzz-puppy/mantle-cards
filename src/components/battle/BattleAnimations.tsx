'use client'

import { useEffect, useState, type ReactNode } from 'react'

interface BattleAnimationProps {
  children: ReactNode
  type: 'select' | 'attack' | 'damage' | 'victory' | 'defeat' | 'idle'
  duration?: number
  onComplete?: () => void
}

export function BattleAnimation({
  children,
  type,
  duration = 500,
  onComplete,
}: BattleAnimationProps) {
  const [animationClass, setAnimationClass] = useState('')

  useEffect(() => {
    if (type === 'idle') return

    const animations: Record<string, string> = {
      select: 'animate-card-select',
      attack: 'animate-attack-pulse',
      damage: 'animate-damage-shake',
      victory: 'animate-victory-bounce',
      defeat: 'animate-defeat-tremble',
    }

    setAnimationClass(animations[type] || '')

    const timer = setTimeout(() => {
      setAnimationClass('')
      onComplete?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [type, duration, onComplete])

  return (
    <div className={animationClass}>
      {children}
    </div>
  )
}

export function CardSelectionPulse({ children, isActive }: { children: ReactNode; isActive: boolean }) {
  return (
    <div className={isActive ? 'animate-pulse-glow' : ''}>
      {children}
    </div>
  )
}

export function AttackAnimation({ 
  children, 
  direction,
  isAttacking 
}: { 
  children: ReactNode
  direction: 'forward' | 'backward'
  isAttacking: boolean 
}) {
  return (
    <div className={`
      transition-transform duration-300
      ${isAttacking ? (direction === 'forward' ? 'translate-y-[-20px] scale-110' : 'translate-y-[20px] scale-110') : ''}
    `}>
      {children}
    </div>
  )
}

export function DamageShake({ children, isDamaged }: { children: ReactNode; isDamaged: boolean }) {
  return (
    <div className={isDamaged ? 'animate-shake' : ''}>
      {children}
    </div>
  )
}

export function HealthBarDecrease({ 
  children, 
  currentHealth, 
  maxHealth 
}: { 
  children: ReactNode
  currentHealth: number
  maxHealth: number 
}) {
  const percentage = (currentHealth / maxHealth) * 100

  return (
    <div className="relative w-full">
      {children}
      <div
        className="absolute top-0 left-0 h-full bg-red-600/50 transition-all duration-700 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

export function VictoryDance({ children, isVictory }: { children: ReactNode; isVictory: boolean }) {
  return (
    <div className={isVictory ? 'animate-victory-dance' : ''}>
      {children}
    </div>
  )
}

export function DefeatFade({ children, isDefeat }: { children: ReactNode; isDefeat: boolean }) {
  return (
    <div className={`transition-opacity duration-1000 ${isDefeat ? 'opacity-50' : 'opacity-100'}`}>
      {children}
    </div>
  )
}

// CSS keyframes as a style tag (to be included in globals.css or via styled-jsx)
export const BattleAnimationStyles = `
  @keyframes card-select {
    0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7); }
    50% { transform: scale(1.05); box-shadow: 0 0 20px 10px rgba(255, 215, 0, 0.3); }
  }
  
  @keyframes attack-pulse {
    0% { transform: scale(1) translateY(0); }
    50% { transform: scale(1.1) translateY(-10px); }
    100% { transform: scale(1) translateY(0); }
  }
  
  @keyframes damage-shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
  
  @keyframes victory-bounce {
    0%, 100% { transform: translateY(0) scale(1); }
    25% { transform: translateY(-20px) scale(1.1); }
    50% { transform: translateY(0) scale(1); }
    75% { transform: translateY(-10px) scale(1.05); }
  }
  
  @keyframes defeat-tremble {
    0%, 100% { opacity: 1; transform: translateX(0); }
    25% { opacity: 0.8; transform: translateX(-2px); }
    75% { opacity: 0.6; transform: translateX(2px); }
  }
  
  @keyframes float-up {
    0% { opacity: 1; transform: translateY(0) scale(1); }
    100% { opacity: 0; transform: translateY(-50px) scale(1.5); }
  }
  
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 5px 2px rgba(255, 215, 0, 0.5); }
    50% { box-shadow: 0 0 20px 5px rgba(255, 215, 0, 0.8); }
  }
  
  @keyframes slash-effect {
    0% { opacity: 0; transform: scale(0.5) rotate(-45deg); }
    50% { opacity: 1; transform: scale(1.2) rotate(0deg); }
    100% { opacity: 0; transform: scale(1.5) rotate(45deg); }
  }
  
  @keyframes heal-glow {
    0% { opacity: 0; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.1); }
    100% { opacity: 0; transform: scale(1.3); }
  }
  
  @keyframes ability-burst {
    0% { opacity: 0; transform: scale(0); }
    50% { opacity: 1; transform: scale(1.3); }
    100% { opacity: 0; transform: scale(2); }
  }
  
  @keyframes victory-celebration {
    0% { opacity: 0; transform: scale(0) rotate(-180deg); }
    100% { opacity: 1; transform: scale(1) rotate(0deg); }
  }
  
  @keyframes defeat-fade {
    0% { opacity: 1; filter: grayscale(0); }
    100% { opacity: 0.3; filter: grayscale(1); }
  }

  .animate-card-select { animation: card-select 0.6s ease-in-out; }
  .animate-attack-pulse { animation: attack-pulse 0.5s ease-in-out; }
  .animate-damage-shake { animation: damage-shake 0.5s ease-in-out; }
  .animate-victory-bounce { animation: victory-bounce 1s ease-in-out; }
  .animate-defeat-tremble { animation: defeat-tremble 0.8s ease-in-out; }
  .animate-float-up { animation: float-up 1.5s ease-out forwards; }
  .animate-pulse-glow { animation: pulse-glow 1.5s ease-in-out infinite; }
  .animate-slash-effect { animation: slash-effect 0.4s ease-out forwards; }
  .animate-heal-glow { animation: heal-glow 0.8s ease-out forwards; }
  .animate-ability-burst { animation: ability-burst 0.6s ease-out forwards; }
  .animate-victory-celebration { animation: victory-celebration 1s ease-out forwards; }
  .animate-defeat-fade { animation: defeat-fade 1.5s ease-out forwards; }
  .animate-attack-forward { transform: translateY(-20px) scale(1.1); }
  .animate-victory-dance { animation: victory-bounce 0.5s ease-in-out infinite; }
`
