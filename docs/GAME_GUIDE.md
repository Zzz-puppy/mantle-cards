# MantleCards Game Guide

Welcome to MantleCards! This guide will teach you how to play, understand card mechanics, and develop winning strategies.

## 🎮 Getting Started

### Connect Your Wallet

1. Click the "Connect Wallet" button on the home page
2. Select your preferred wallet (MetaMask, WalletConnect, etc.)
3. Approve the connection request
4. Ensure you're connected to the Mantle network

### Mint Your First Card

After connecting:
1. Navigate to the Collection page
2. Click "Generate Card"
3. The AI will analyze your wallet's on-chain data
4. Preview your generated card
5. Confirm the minting transaction
6. Your card will appear in your collection!

## 🎴 Understanding Cards

### Card Attributes

| Attribute | Description | How It's Calculated |
|-----------|-------------|-------------------|
| **Name** | Unique card name | Based on rarity + random prefix/suffix |
| **Rarity** | Card tier | Based on total portfolio value |
| **Attack** | Damage dealt | Based on MNT token balance |
| **Defense** | Damage reduction | Based on ERC-20 token diversity |
| **Special Ability** | Unique power | Based on trading patterns |
| **Experience** | Skill level | Based on transaction count |

### Rarity Tiers

| Rarity | Color | Portfolio Requirement | Stat Multiplier |
|--------|-------|----------------------|-----------------|
| 🟢 **Common** | Green | Any wallet | 1.0x |
| 🔵 **Rare** | Blue | $100+ USD | 1.25x |
| 🟣 **Epic** | Purple | $1,000+ USD | 1.5x |
| 🟡 **Legendary** | Gold | $10,000+ USD | 1.75x |

### Card Example

```
┌─────────────────────────────────────────┐
│  ⚔️ DIVINE CRUSHER OF POWER              │
│  ─────────────────────────────────────── │
│                                         │
│  [Card Image]                           │
│                                         │
│  ─────────────────────────────────────── │
│  Rarity: ★★★★ Legendary                 │
│  Attack: 85    Defense: 72              │
│  ─────────────────────────────────────── │
│  💪 Wealth Aura: Gain 20% more          │
│     rewards from battles                │
│  ─────────────────────────────────────── │
│  Level: 5  |  Transactions: 1,234      │
└─────────────────────────────────────────┘
```

## ⚔️ Battle System

### How Battles Work

1. **Enter the Battle Arena**
   - Go to the Battle page
   - Select a card from your collection
   - Choose your difficulty level

2. **AI Opponent Selection**
   - The system analyzes your trading pattern
   - Matches you with a suitable AI opponent
   - AI selects a card based on its difficulty

3. **Combat Rounds**
   - Each battle consists of up to 3 rounds
   - Both player and AI attack simultaneously
   - Damage is calculated based on card stats
   - Battle continues until one player's health reaches 0

### Damage Calculation

```
Damage = Attacker's Attack - (Defender's Defense / 2)
Minimum Damage = 1
```

**Example:**
- Your card: 80 Attack, 40 Defense
- Opponent card: 70 Attack, 30 Defense
- Your damage to opponent: `80 - (30 / 2) = 65`
- Opponent damage to you: `70 - (40 / 2) = 50`

### Critical Hits

- Base critical hit chance: 10%
- Bonus chance: `+ (Attack / 1000)`
- Critical hit damage: 1.5x normal damage
- Critical hits are announced with special effects

### Victory Conditions

| Condition | Result |
|-----------|--------|
| Opponent health reaches 0 | 🏆 Victory |
| Your health reaches 0 | 💀 Defeat |
| Both reach 0 simultaneously | 💀 Defeat (opponent wins ties) |
| 3 rounds complete | Highest health wins |

### Battle Rewards

| Outcome | Experience | Ranking Points |
|---------|------------|----------------|
| Victory | +50 XP | +25 points |
| Defeat | +10 XP | +5 points |
| Draw | +20 XP | +10 points |

## 🤖 AI Opponents

### Available AI Profiles

| AI | Difficulty | Trading Style | Strategy |
|----|------------|---------------|----------|
| 🐋 **Whale Hunter** | Hard | Aggressive | High-risk, high-reward attacks |
| 🛡️ **Defensive Strategist** | Medium | Conservative | Focuses on defense, waits for openings |
| ⚖️ **Balanced Trader** | Medium | Balanced | Adapts to opponent's style |
| 🧓 **Crypto Veteran** | Hard | Aggressive | Experienced, consistent performance |
| 🙈 **Paper Hands** | Easy | Conservative | Risk-averse, weaker attacks |
| 🎲 **Degen Trader** | Medium | Aggressive | Unpredictable, extreme moves |

### Difficulty Levels

| Level | AI Selection | Win Rate Expectation |
|-------|--------------|----------------------|
| **Easy** | Paper Hands | ~70% expected win rate |
| **Medium** | Mixed (Trader, Strategist, Degen) | ~50% expected win rate |
| **Hard** | Whale Hunter, Crypto Veteran | ~30% expected win rate |

### How AI Selects Cards

The AI analyzes your wallet and selects an appropriate opponent:

1. **Portfolio Value** → Determines opponent rarity tier
2. **Trading Frequency** → Determines opponent aggression
3. **Risk Tolerance** → Determines ability usage frequency

## 💡 Tips and Strategies

### Building Your Collection

1. **Diversify Your Portfolio**
   - Hold multiple ERC-20 tokens to boost defense
   - Higher MNT balance increases attack

2. **Increase Transaction Activity**
   - More transactions = higher experience level
   - Better abilities unlock at higher levels

3. **Target Higher Rarities**
   - Build portfolio value to unlock Epic and Legendary cards
   - Higher rarity = better base stats

### Battle Strategies

#### Against Aggressive AI (Whale Hunter, Crypto Veteran)

**Strategy:** Defensive Counter
- Select high-defense cards
- Let them attack first, then counter
- Focus on surviving the first rounds
- Save special abilities for critical moments

#### Against Conservative AI (Defensive Strategist, Paper Hands)

**Strategy:** Aggressive Rush
- Use high-attack cards
- Apply pressure early
- Don't give them time to build defense
- Prioritize finishing in 2 rounds

#### Against Balanced AI

**Strategy:** Adaptation
- Match their card selection
- React to their moves
- Use abilities strategically
- Balance attack and defense

### Card Synergies

Some abilities work better together:

| Ability Type | Best Paired With | Effect |
|--------------|------------------|--------|
| High Attack + Critical Chance | - | Devastating burst damage |
| High Defense + Heal on Defeat | Defensive cards | Sustain longer |
| Multi-Chain + Token Harmony | Diverse portfolios | Maximize all stats |

## 🛒 Marketplace Guide

### Buying Cards

1. Go to the Marketplace
2. Browse available cards
3. Click on a card to see details
4. Click "Buy Now" or "Make Offer"
5. Confirm the transaction

### Selling Cards

1. Go to your Collection
2. Select a card
3. Click "Sell"
4. Set your price
5. Confirm the listing

### Making Offers

1. Find a card you want
2. Click "Make Offer"
3. Enter your offer amount
4. Wait for the seller to accept

## 🏆 Leaderboard

### Ranking Points

Points are earned through:
- **Battle victories:** +25 points
- **Battle defeats:** +5 points
- **Card sales:** +10% of sale price

### climbing the Ranks

| Rank | Title | Points Required |
|------|-------|-----------------|
| 🥇 | Diamond Champion | 10,000+ |
| 🥈 | Platinum Master | 5,000+ |
| 🥉 | Gold Expert | 2,500+ |
| ⚔️ | Silver Veteran | 1,000+ |
| 🏅 | Bronze Novice | 100+ |
| 📖 | Iron Learner | 0+ |

## 👥 Agent System

### What Are Agents?

Agents are top players who have registered their wallet as a public portfolio showcase. Other players can view agent profiles, analyze their trading strategies, and learn from their card collections.

### Becoming an Agent

1. Reach Gold rank or higher
2. Go to the Profile page
3. Click "Register as Agent"
4. Confirm the registration transaction
5. Your profile becomes public

## ❓ FAQ

### Q: How is card rarity determined?
**A:** Rarity is calculated based on your total portfolio value in USD across all tokens on Mantle.

### Q: Can I transfer cards to another wallet?
**A:** Yes, you can transfer cards using the "Send" option in your collection.

### Q: What happens if I disconnect during a battle?
**A:** The battle will be recorded as a defeat.

### Q: How often can I mint new cards?
**A:** There's no limit, but each mint requires a gas transaction.

### Q: Are battles on-chain?
**A:** Battle results are recorded off-chain for performance. Only card mints and transfers are on-chain.

### Q: Can I battle specific friends?
**A:** Currently, battles are against AI opponents only.

---

<p align="center">
  <strong>Good luck, and may the best trader win! 🎴</strong>
</p>
