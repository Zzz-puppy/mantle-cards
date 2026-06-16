# MantleCards - AI-Powered Trading Card Game

<p align="center">
  <img src="https://img.shields.io/badge/Hackathon-The%20Turing%20Test%20Hackathon%202026-8B5CF6?style=for-the-badge" alt="Hackathon Badge" />
  <img src="https://img.shields.io/badge/Track-Consumer%20Viral%20DApps-10B981?style=for-the-badge" alt="Track Badge" />
  <img src="https://img.shields.io/badge/Network-Mantle-00AEEF?style=for-the-badge" alt="Network Badge" />
  <img src="https://img.shields.io/badge/Next.js-15.0-000000?style=for-the-badge&logo=next.js" alt="Next.js Badge" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript Badge" />
  <img src="https://img.shields.io/badge/Solidity-0.8.x-363636?style=for-the-badge&logo=solidity" alt="Solidity Badge" />
</p>

> **Revolutionary AI-powered trading card game where your wallet's on-chain activity creates unique, dynamic cards**

MantleCards bridges the gap between your real DeFi trading behavior and an immersive card battle experience. Every card you mint is uniquely generated based on your wallet's trading patterns, portfolio value, and transaction history.

## 🎮 About

MantleCards is a Web3-native trading card game that leverages AI to analyze your wallet's on-chain activity and generates unique cards that reflect your trading style. Battle against AI opponents, collect rare cards, and climb the leaderboard!

### Vision

We believe that every DeFi trader has a unique story written on-chain. MantleCards transforms this data into collectible cards with stats and abilities derived from your actual trading behavior - making your portfolio history the ultimate game asset.

## ✨ Features

### 🎯 Core Features
- **🎴 AI-Generated Cards** - Cards are dynamically generated based on your wallet's trading patterns
- **⚔️ Battle System** - Strategic turn-based card battles with multiple difficulty levels
- **🤖 AI Opponents** - Six unique AI profiles that adapt to your trading style
- **💎 Rarity System** - Four tiers: Common, Rare, Epic, Legendary with visual effects
- **🏆 Leaderboard** - Compete with other traders for top rankings
- **🛒 Marketplace** - Buy, sell, and trade cards with other players (with detailed card preview modal)
- **👥 Agent System** - Register as an agent and showcase your portfolio
- **📊 Card Analysis** - AI-powered card analysis with battle predictions and team building
- **📤 Social Sharing** - Share cards and referral program integration

### 🔐 Web3 Features
- **Wallet Integration** - Seamless connection via WalletConnect and MetaMask
- **Smart Contracts** - ERC-8004 compliant token standards
- **Mantle Network** - Built on Mantle for fast, low-cost transactions
- **On-Chain Data** - Real-time portfolio analysis from chain data

### 🎨 User Experience
- **Responsive Design** - Works on desktop and mobile
- **Smooth Animations** - Battle animations powered by Framer Motion
- **Modern Dark Theme** - Elegant, eye-friendly UI with soft color palette
- **Real-Time Updates** - Live leaderboard and card updates
- **Interactive Modals** - Detailed card views with scrollable content
- **Custom Logo** - Brand identity with animated card logo

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS 4.0 |
| **Web3** | Wagmi v2, Viem v2 |
| **State** | TanStack React Query v5 |
| **Animations** | Framer Motion, canvas-confetti |
| **Smart Contracts** | Solidity, Hardhat |
| **Blockchain** | Mantle Network |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask or WalletConnect compatible wallet
- Mantle network configured in wallet

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/mantle-cards.git
cd mantle-cards

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your WalletConnect Project ID to .env.local
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Build

```bash
# Create production build
npm run build

# Start production server
npm start
```

## ⚙️ Configuration

Create a `.env.local` file in the root directory:

```env
# WalletConnect Project ID (required for wallet connection)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Optional: Custom Mantle RPC URLs
NEXT_PUBLIC_MANTLE_RPC_URL=https://rpc.mantle.xyz
NEXT_PUBLIC_MANTLE_SEPOLIA_RPC_URL=https://rpc.sepolia.mantle.xyz
```

### Getting WalletConnect Project ID

1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project
3. Copy the Project ID
4. Paste it in your `.env.local`

## 📁 Project Structure

```
mantle-cards/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── battle/            # Battle arena page
│   │   ├── collection/        # User's card collection
│   │   ├── leaderboard/       # Global rankings
│   │   ├── market/            # Card marketplace
│   │   ├── profile/           # User profile & agents
│   │   ├── globals.css        # Global styles & theme colors
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── agent/             # Agent-related components
│   │   │   ├── AgentIdentity.tsx
│   │   │   ├── AgentRegistration.tsx
│   │   │   └── AgentShowcase.tsx
│   │   ├── analyzer/          # AI card analyzer
│   │   │   ├── BattlePredictor.tsx
│   │   │   ├── CardAnalyzer.tsx
│   │   │   └── TeamBuilder.tsx
│   │   ├── animations/        # Animation components
│   │   │   └── CardReveal.tsx
│   │   ├── battle/            # Battle system components
│   │   │   ├── BattleAnimations.tsx
│   │   │   ├── BattleArena.tsx
│   │   │   ├── BattleEffect.tsx
│   │   │   ├── BattleResult.tsx
│   │   │   ├── BattleSelection.tsx
│   │   │   └── CardSlot.tsx
│   │   ├── leaderboard/       # Leaderboard components
│   │   │   ├── Leaderboard.tsx
│   │   │   └── LeaderboardRow.tsx
│   │   ├── marketplace/       # Marketplace components
│   │   │   ├── ListingCard.tsx
│   │   │   ├── ListingDetail.tsx
│   │   │   ├── MarketplaceGrid.tsx
│   │   │   ├── PurchaseFlow.tsx
│   │   │   ├── SellCard.tsx
│   │   │   └── UserListings.tsx
│   │   ├── providers/         # Web3 providers
│   │   │   └── Web3Provider.tsx
│   │   ├── share/             # Social sharing
│   │   │   ├── ReferralProgram.tsx
│   │   │   ├── ShareButtons.tsx
│   │   │   ├── ShareCard.tsx
│   │   │   └── ShareModal.tsx
│   │   ├── Button.tsx         # Shared button component
│   │   ├── Card.tsx           # Card display component
│   │   ├── CardComparison.tsx # Card comparison modal
│   │   ├── CardDetail.tsx     # Card detail modal
│   │   ├── CardSkeleton.tsx   # Loading skeleton
│   │   ├── ClientLayout.tsx   # Client-side layout with navigation
│   │   ├── CollectionHeader.tsx # Collection stats header
│   │   ├── Layout.tsx         # Main layout wrapper
│   │   ├── MintCard.tsx       # Card minting component
│   │   ├── WalletButton.tsx   # Wallet connection button
│   │   └── WalletModal.tsx    # Wallet selection modal
│   ├── contexts/              # React contexts
│   │   └── WalletContext.tsx  # Wallet state management
│   ├── contracts/             # Solidity smart contracts
│   │   ├── AgentIdentity.sol  # Agent registry contract
│   │   ├── ERC8004.sol        # ERC-8004 compliance
│   │   ├── MantleCards.sol    # Main card NFT contract
│   │   └ Marketplace.sol      # Card trading marketplace
│   │   └── index.ts           # Contract exports
│   ├── hooks/                 # Custom React hooks
│   │   ├── useBalance.ts      # Balance management
│   │   ├── useBattle.ts       # Battle logic hook
│   │   ├── useCards.ts        # Card management hook
│   │   ├── useGame.ts         # Game state hook
│   │   ├── useMarketData.ts   # Marketplace data hook
│   │   ├── useMintCard.ts     # Card minting hook
│   │   ├── useMockWallet.ts   # Mock wallet for testing
│   │   ├── useNetwork.ts      # Network status hook
│   │   └── useWallet.ts       # Wallet connection hook
│   ├── lib/                   # Utility libraries
│   │   ├── agent-data.ts      # Agent data utilities
│   │   ├── ai-analyzer.ts     # Trading pattern analyzer
│   │   ├── ai-profiles.ts     # AI opponent definitions
│   │   ├── battle-engine.ts   # Battle simulation engine
│   │   ├── battle-recorder.ts # Battle history recorder
│   │   ├── card-generator.ts  # Card generation logic
│   │   ├── contracts.ts       # Contract ABIs & addresses
│   │   ├── leaderboard.ts     # Leaderboard data
│   │   ├── mantle-data.ts     # Mantle network data
│   │   ├── market-data.ts     # Marketplace mock data
│   │   ├── mock-data.ts       # Development mock data
│   │   ├── social-share.ts    # Social sharing utilities
│   │   ├── utils.ts           # General utilities
│   │   └── wagmi-config.ts    # Web3 configuration
│   └── types/                 # TypeScript type definitions
│       ├── battle.ts          # Battle-related types
│       ├── card.ts            # Card NFT types
│       ├── index.ts           # Type exports
│       └── leaderboard.ts     # Leaderboard types
├── docs/                      # Documentation
│   ├── ARCHITECTURE.md        # System architecture
│   └── GAME_GUIDE.md          # How to play
├── .env.example               # Environment template
├── .gitignore                 # Git ignore patterns
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── next.config.ts             # Next.js config
└── README.md                  # This file
```

## 📜 Smart Contracts

### MantleCards.sol
- **Purpose**: Main NFT contract for card minting and ownership
- **Standard**: ERC-721 with ERC-8004 extension
- **Features**: 
  - Dynamic card attributes
  - Rarity-based minting
  - On-chain metadata

### Marketplace.sol
- **Purpose**: P2P card trading marketplace
- **Features**:
  - List cards for sale
  - Make offers
  - Instant purchases

### AgentIdentity.sol
- **Purpose**: Agent registry and profile management
- **Features**:
  - Agent registration
  - Portfolio tracking
  - Agent showcase

### ERC8004.sol
- **Purpose**: ERC-8004 compliant extension
- **Features**:
  - Extended token interface
  - Trading history tracking

## ⚔️ Game Mechanics

### Card Generation
Cards are generated based on your wallet's on-chain data:

| Attribute | Source | Effect |
|-----------|--------|--------|
| **Rarity** | Portfolio Value | Common < $100, Rare < $1,000, Epic < $10,000, Legendary $10,000+ |
| **Attack** | MNT Balance | Higher balance = higher attack |
| **Defense** | ERC-20 Diversity | More token types = higher defense |
| **Special Ability** | Transaction Patterns | Based on trading behavior |
| **Experience** | Transaction Count | More txs = higher level |

### Rarity Tiers

| Rarity | Color | Multiplier | Requirements |
|--------|-------|------------|--------------|
| 🟢 Common | Slate Gray | 1.0x | Any wallet |
| 🔵 Rare | Indigo Blue | 1.25x | $100+ portfolio |
| 🟣 Epic | Violet Purple | 1.5x | $1,000+ portfolio |
| 🟡 Legendary | Amber Gold | 1.75x | $10,000+ portfolio |

### Battle System

**Turn Structure:**
1. Select a card from your hand
2. AI opponent selects a card
3. Both cards attack simultaneously
4. Damage calculated: `Attack - (Defense / 2)`
5. Critical hits possible (10% base chance)
6. Repeat for up to 3 rounds

**Victory Conditions:**
- Reduce opponent's health to 0
- Have more health when rounds end
- Higher cumulative damage dealt

### AI Opponents

| AI Profile | Difficulty | Style | Risk Tolerance |
|-------------|------------|-------|----------------|
| 🐋 Whale Hunter | Hard | Aggressive | 0.9 |
| 🛡️ Defensive Strategist | Medium | Conservative | 0.2 |
| ⚖️ Balanced Trader | Medium | Balanced | 0.5 |
| 🧓 Crypto Veteran | Hard | Aggressive | 0.7 |
| 🙈 Paper Hands | Easy | Conservative | 0.1 |
| 🎲 Degen Trader | Medium | Aggressive | 0.95 |

## 🤖 AI Integration

### Trading Pattern Analysis
The AI analyzer examines your wallet's:
- Transaction frequency
- Average transaction size
- Token diversity
- Gas spending patterns
- Trading style (aggressive/conservative/balanced)

### Card Matching
Based on analysis, the system:
1. Generates cards with matching attributes
2. Selects appropriate AI opponents
3. Adjusts battle difficulty
4. Provides strategic suggestions

### Smart Battle Matching
- AI profiles are selected based on your trading pattern
- Battle difficulty adapts to your win/loss ratio
- Cards are weighted to match your style

## 🎨 UI/UX Features

### Color Palette
The application uses a soft, elegant color scheme:
- **Primary Gold**: `#C9A227` - Accent and highlights
- **Secondary Purple**: `#7C6BAF` - Secondary actions
- **Accent Blue**: `#5B8FD9` - Information elements
- **Background**: `#12111a` - Dark, eye-friendly base
- **Card Background**: `#1a1625` - Subtle contrast

### Interactive Elements
- **Card Hover Effects**: Scale and glow animations
- **Legendary Glow**: Animated golden particles
- **Modal Scroll**: Full content visibility with scroll support
- **Responsive Grid**: Adaptive card layouts for all screen sizes

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 📞 Contact

- **Email**: 2482559491@qq.com
- **Phone**: 18977870517
- **Project**: The Turing Test Hackathon 2026
- **Network**: Mantle
- **Track**: Consumer Viral DApps

---

<p align="center">
  <strong>Built with ❤️ on Mantle Network</strong>
  <br />
  <sub>Powered by AI • Secured by Blockchain • Designed for Players</sub>
</p>