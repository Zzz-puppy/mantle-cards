'use client'

import { useState, useMemo } from 'react'
import type { Card as CardData, CardRarity } from '@/types/card'
import { Card } from '@/components/Card'
import { CardDetail } from '@/components/CardDetail'
import { CardComparison } from '@/components/CardComparison'
import { CollectionHeader } from '@/components/CollectionHeader'
import { CardGridSkeleton } from '@/components/CardSkeleton'

const mockCards: CardData[] = [
  {
    id: BigInt(1),
    name: 'Dragon Knight',
    rarity: 'legendary',
    attack: 95,
    defense: 70,
    specialAbility: 'Ignites the battlefield, dealing 50% bonus fire damage to all enemies.',
    image: '',
    owner: '0x1234',
    mintedAt: Date.now(),
    baseToken: 'DRG',
    tokenBalance: BigInt(1000000),
    transactionCount: 150,
  },
]

export default function Collection() {
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const handleCardClick = (card: CardData) => {
    setSelectedCard(card)
    setIsDetailOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#12111a] via-[#1a1530]/30 to-[#12111a]">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <CollectionHeader totalCards={mockCards.length} cards={mockCards} />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 justify-items-center">
          {mockCards.map((card) => (
            <Card key={card.id} card={card} onClick={() => handleCardClick(card)} />
          ))}
        </div>
        <CardDetail card={selectedCard!} isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} />
        <CardComparison cards={mockCards} isOpen={false} onClose={() => {}} />
      </div>
    </div>
  )
}
