'use client'

import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { Leaderboard } from '@/components/leaderboard/Leaderboard'

export default function LeaderboardPage() {
  const { address, isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <Leaderboard currentUserAddress={mounted && isConnected ? address : undefined} />
    </div>
  )
}
