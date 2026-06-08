import { AgentIdentityData } from '@/components/agent/AgentIdentity'

export const MOCK_AGENTS: AgentIdentityData[] = [
  {
    id: 'agent-whale-hunter',
    name: 'Whale Hunter',
    avatar: '/avatars/whale-hunter.png',
    personality: 'Aggressive Risk Taker',
    reputation: 7500,
    totalBattles: 156,
    wins: 112,
    losses: 38,
    draws: 6,
    winRate: 72,
    currentStreak: 5,
    highestStreak: 12,
    capabilities: [
      { id: 'high-risk', name: 'High Risk Trading', proficiency: 95, description: 'Expert in high-leverage strategies' },
      { id: 'momentum', name: 'Momentum Trading', proficiency: 88, description: 'Catches trending assets' },
    ],
    achievements: [
      { id: 'first_blood', name: 'First Blood', description: 'Won first battle', badgeURI: '', earnedAt: new Date('2024-01-15') },
      { id: 'unstoppable', name: 'Unstoppable', description: '5 win streak', badgeURI: '', earnedAt: new Date('2024-02-20') },
      { id: 'whale_hunter', name: 'Whale Hunter', description: 'Defeated 10 legendary opponents', badgeURI: '', earnedAt: new Date('2024-03-10') },
    ],
    registeredAt: new Date('2024-01-01'),
    lastActive: new Date(),
  },
  {
    id: 'agent-defensive',
    name: 'Defensive Strategist',
    avatar: '/avatars/defensive-strategist.png',
    personality: 'Patient Defender',
    reputation: 5200,
    totalBattles: 89,
    wins: 52,
    losses: 31,
    draws: 6,
    winRate: 58,
    currentStreak: 2,
    highestStreak: 7,
    capabilities: [
      { id: 'risk-mgmt', name: 'Risk Management', proficiency: 92, description: 'Expert at minimizing losses' },
      { id: 'portfolio', name: 'Portfolio Defense', proficiency: 85, description: 'Protects capital effectively' },
    ],
    achievements: [
      { id: 'first_blood', name: 'First Blood', description: 'Won first battle', badgeURI: '', earnedAt: new Date('2024-01-20') },
    ],
    registeredAt: new Date('2024-01-05'),
    lastActive: new Date(),
  },
  {
    id: 'agent-balanced',
    name: 'Balanced Trader',
    avatar: '/avatars/balanced-trader.png',
    personality: 'Adaptive Strategist',
    reputation: 4800,
    totalBattles: 134,
    wins: 78,
    losses: 48,
    draws: 8,
    winRate: 58,
    currentStreak: 0,
    highestStreak: 8,
    capabilities: [
      { id: 'technical', name: 'Technical Analysis', proficiency: 80, description: 'Chart pattern expert' },
      { id: 'fundamental', name: 'Fundamental Analysis', proficiency: 75, description: 'Market research skills' },
    ],
    achievements: [
      { id: 'first_blood', name: 'First Blood', description: 'Won first battle', badgeURI: '', earnedAt: new Date('2024-01-10') },
      { id: 'battle_master', name: 'Battle Master', description: 'Won 50 battles', badgeURI: '', earnedAt: new Date('2024-04-01') },
    ],
    registeredAt: new Date('2024-01-03'),
    lastActive: new Date(),
  },
  {
    id: 'agent-crypto-veteran',
    name: 'Crypto Veteran',
    avatar: '/avatars/crypto-veteran.png',
    personality: 'Experienced Veteran',
    reputation: 8200,
    totalBattles: 245,
    wins: 178,
    losses: 55,
    draws: 12,
    winRate: 73,
    currentStreak: 8,
    highestStreak: 15,
    capabilities: [
      { id: 'market-prediction', name: 'Market Prediction', proficiency: 94, description: 'Can predict market movements' },
      { id: 'arbitrage', name: 'Arbitrage', proficiency: 89, description: 'Finds price differences' },
      { id: 'defi-ops', name: 'DeFi Operations', proficiency: 86, description: 'DeFi protocol expert' },
    ],
    achievements: [
      { id: 'first_blood', name: 'First Blood', description: 'Won first battle', badgeURI: '', earnedAt: new Date('2023-12-20') },
      { id: 'unstoppable', name: 'Unstoppable', description: '5 win streak', badgeURI: '', earnedAt: new Date('2024-01-15') },
      { id: 'legendary', name: 'Legendary', description: 'Reached 8000+ reputation', badgeURI: '', earnedAt: new Date('2024-05-01') },
    ],
    registeredAt: new Date('2023-12-15'),
    lastActive: new Date(),
  },
  {
    id: 'agent-paper-hands',
    name: 'Paper Hands',
    avatar: '/avatars/paper-hands.png',
    personality: 'Fearful Newcomer',
    reputation: 1200,
    totalBattles: 28,
    wins: 8,
    losses: 18,
    draws: 2,
    winRate: 29,
    currentStreak: 0,
    highestStreak: 3,
    capabilities: [
      { id: 'learning', name: 'Learning', proficiency: 45, description: 'Still learning the basics' },
    ],
    achievements: [],
    registeredAt: new Date('2024-04-01'),
    lastActive: new Date(),
  },
  {
    id: 'agent-degen',
    name: 'Degen Trader',
    avatar: '/avatars/degen-trader.png',
    personality: 'Degenerate Gambler',
    reputation: 6500,
    totalBattles: 189,
    wins: 124,
    losses: 61,
    draws: 4,
    winRate: 66,
    currentStreak: 3,
    highestStreak: 10,
    capabilities: [
      { id: 'yolo', name: 'YOLO Trading', proficiency: 97, description: 'All-in strategies' },
      { id: 'momentum', name: 'Momentum Trading', proficiency: 90, description: 'Catches trending assets' },
    ],
    achievements: [
      { id: 'first_blood', name: 'First Blood', description: 'Won first battle', badgeURI: '', earnedAt: new Date('2024-02-01') },
      { id: 'unstoppable', name: 'Unstoppable', description: '5 win streak', badgeURI: '', earnedAt: new Date('2024-03-15') },
    ],
    registeredAt: new Date('2024-01-25'),
    lastActive: new Date(),
  },
]

export function getAgentById(id: string): AgentIdentityData | undefined {
  return MOCK_AGENTS.find(a => a.id === id)
}

export function getAgentsByReputation(): AgentIdentityData[] {
  return [...MOCK_AGENTS].sort((a, b) => b.reputation - a.reputation)
}

export function getAgentsByWinRate(): AgentIdentityData[] {
  return [...MOCK_AGENTS].sort((a, b) => b.winRate - a.winRate)
}

export function getTopAgents(count: number = 10): AgentIdentityData[] {
  return getAgentsByReputation().slice(0, count)
}
