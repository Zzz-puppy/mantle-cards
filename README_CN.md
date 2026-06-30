# MantleCards - AI 驱动的交易卡牌游戏

> ⚠️ **开发状态说明**
> 
> 本项目为 The Turing Test Hackathon 2026 参赛作品，目前为**本地开发版本**。
> - 智能合约已编写完成（Solidity）但**未部署**到 Mantle 主网或测试网
> - 前端界面和游戏逻辑在本地完整可用，使用**模拟数据（Mock Data）**进行展示
> - 钱包连接功能已完成 UI 层集成，连接到实际网络需要部署合约并配置 RPC

<p align="center">
  <img src="https://img.shields.io/badge/Hackathon-The%20Turing%20Test%20Hackathon%202026-8B5CF6?style=for-the-badge" alt="黑客松徽章" />
  <img src="https://img.shields.io/badge/Track-Consumer%20Viral%20DApps-10B981?style=for-the-badge" alt="赛道徽章" />
  <img src="https://img.shields.io/badge/Network-Mantle-00AEEF?style=for-the-badge" alt="网络徽章" />
  <img src="https://img.shields.io/badge/Next.js-15.0-000000?style=for-the-badge&logo=next.js" alt="Next.js徽章" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript徽章" />
  <img src="https://img.shields.io/badge/Solidity-0.8.x-363636?style=for-the-badge&logo=solidity" alt="Solidity徽章" />
</p>

> **革命性的 AI 驱动交易卡牌游戏，您的钱包链上活动将生成独特、动态的卡牌**

MantleCards 将您真实的 DeFi 交易行为与沉浸式卡牌战斗体验相结合。您铸造的每张卡牌都是根据您钱包的交易模式、投资组合价值和交易历史动态生成的。

## 🎮 关于游戏

MantleCards 是一个 Web3 原生的交易卡牌游戏，利用 AI 分析您钱包的链上活动，生成反映您交易风格的独特卡牌。与 AI 对手战斗、收集稀有卡牌、攀登排行榜！

### 愿景

我们相信每位 DeFi 交易者都在链上书写着独特的故事。MantleCards 将这些数据转化为可收藏的卡牌，其属性和能力源自您真实的交易行为——让您的投资组合历史成为终极游戏资产。

## ✨ 功能特性

### 🎯 核心功能
- **🎴 AI 生成卡牌** - 根据您钱包的交易模式动态生成卡牌
- **⚔️ 战斗系统** - 多难度等级的策略回合制卡牌战斗
- **🤖 AI 对手** - 6个适应您交易风格的独特 AI 角色
- **💎 稀有度系统** - 四个等级：普通、稀有、史诗、传说（带视觉特效）
- **🏆 排行榜** - 与其他交易者竞争排名
- **🛒 市场** - 与其他玩家买卖和交易卡牌（带详细卡牌预览弹窗）
- **👥 代理系统** - 注册为代理并展示您的投资组合
- **📊 卡牌分析** - AI 驱动的卡牌分析，包含战斗预测和团队构建
- **📤 社交分享** - 分享卡牌和推荐计划集成

### 🔐 Web3 功能
- **钱包集成** - 通过 WalletConnect 和 MetaMask 无缝连接
- **智能合约** - 符合 ERC-8004 标准的代币标准
- **Mantle 网络** - 构建于 Mantle，提供快速、低成本的交易
- **链上数据** - 实时从链上数据进行分析

### 🎨 用户体验
- **响应式设计** - 适用于桌面和移动设备
- **流畅动画** - 由 Framer Motion 驱动的战斗动画
- **现代深色主题** - 优雅、护眼的 UI 和柔和配色
- **实时更新** - 实时排行榜和卡牌更新
- **交互式弹窗** - 带滚动支持的详细卡牌视图
- **自定义 Logo** - 带动画卡牌的品牌标识

## 🛠 技术栈

| 类别 | 技术 |
|----------|------------|
| **前端** | Next.js 15, React 19, TypeScript |
| **样式** | Tailwind CSS 4.0 |
| **Web3** | Wagmi v2, Viem v2 |
| **状态管理** | TanStack React Query v5 |
| **动画** | Framer Motion, canvas-confetti |
| **智能合约** | Solidity, Hardhat |
| **区块链** | Mantle Network |

## 🚀 快速开始

### 前置要求

- Node.js 18+ 
- npm 或 yarn
- MetaMask 或 WalletConnect 兼容钱包
- 在钱包中配置 Mantle 网络

### 安装

```bash
# 克隆仓库
git clone https://github.com/Zzz-puppy/mantle-cards.git
cd mantle-cards

# 安装依赖
npm install

# 复制环境变量文件
cp .env.example .env.local

# 将您的 WalletConnect Project ID 添加到 .env.local
```

### 开发

```bash
# 启动开发服务器
npm run dev

# 打开 http://localhost:3000
```

### 构建

```bash
# 创建生产构建
npm run build

# 启动生产服务器
npm start
```

## 📁 项目结构

```
mantle-cards/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── battle/            # 战斗竞技场页面
│   │   ├── collection/        # 用户卡牌收藏
│   │   ├── leaderboard/       # 全球排名
│   │   ├── market/            # 卡牌市场
│   │   ├── profile/           # 用户资料和代理
│   │   ├── globals.css        # 全局样式和主题颜色
│   │   ├── layout.tsx         # 根布局
│   │   └── page.tsx           # 主页
│   ├── components/            # React 组件
│   │   ├── agent/             # 代理相关组件
│   │   │   ├── AgentIdentity.tsx
│   │   │   ├── AgentRegistration.tsx
│   │   │   └── AgentShowcase.tsx
│   │   ├── analyzer/          # AI 卡牌分析器
│   │   │   ├── BattlePredictor.tsx
│   │   │   ├── CardAnalyzer.tsx
│   │   │   └── TeamBuilder.tsx
│   │   ├── animations/        # 动画组件
│   │   │   └── CardReveal.tsx
│   │   ├── battle/            # 战斗系统组件
│   │   │   ├── BattleAnimations.tsx
│   │   │   ├── BattleArena.tsx
│   │   │   ├── BattleEffect.tsx
│   │   │   ├── BattleResult.tsx
│   │   │   ├── BattleSelection.tsx
│   │   │   └── CardSlot.tsx
│   │   ├── leaderboard/       # 排行榜组件
│   │   │   ├── Leaderboard.tsx
│   │   │   └── LeaderboardRow.tsx
│   │   ├── marketplace/       # 市场组件
│   │   │   ├── ListingCard.tsx
│   │   │   ├── ListingDetail.tsx
│   │   │   ├── MarketplaceGrid.tsx
│   │   │   ├── PurchaseFlow.tsx
│   │   │   ├── SellCard.tsx
│   │   │   └── UserListings.tsx
│   │   ├── providers/        # Web3 提供商
│   │   │   └── Web3Provider.tsx
│   │   ├── share/            # 社交分享
│   │   │   ├── ReferralProgram.tsx
│   │   │   ├── ShareButtons.tsx
│   │   │   ├── ShareCard.tsx
│   │   │   └── ShareModal.tsx
│   │   ├── Button.tsx         # 共享按钮组件
│   │   ├── Card.tsx           # 卡牌显示组件
│   │   ├── CardComparison.tsx # 卡牌对比弹窗
│   │   ├── CardDetail.tsx     # 卡牌详情弹窗
│   │   ├── CardSkeleton.tsx   # 加载骨架屏
│   │   ├── ClientLayout.tsx   # 带导航的客户端布局
│   │   ├── CollectionHeader.tsx # 收藏统计头部
│   │   ├── Layout.tsx         # 主布局包装器
│   │   ├── MintCard.tsx       # 卡牌铸造组件
│   │   ├── WalletButton.tsx   # 钱包连接按钮
│   │   └── WalletModal.tsx    # 钱包选择弹窗
│   ├── contexts/              # React 上下文
│   │   └── WalletContext.tsx  # 钱包状态管理
│   ├── contracts/             # Solidity 智能合约
│   │   ├── AgentIdentity.sol  # 代理注册合约
│   │   ├── ERC8004.sol        # ERC-8004 合规
│   │   ├── MantleCards.sol    # 主卡牌 NFT 合约
│   │   └── Marketplace.sol    # 卡牌交易市场合约
│   │   └── index.ts           # 合约导出
│   ├── hooks/                 # 自定义 React Hooks
│   │   ├── useBalance.ts      # 余额管理
│   │   ├── useBattle.ts       # 战斗逻辑
│   │   ├── useCards.ts        # 卡牌管理
│   │   ├── useGame.ts         # 游戏状态
│   │   ├── useMarketData.ts   # 市场数据
│   │   ├── useMintCard.ts     # 卡牌铸造
│   │   ├── useMockWallet.ts   # 测试用模拟钱包
│   │   ├── useNetwork.ts      # 网络状态
│   │   └── useWallet.ts       # 钱包连接
│   ├── lib/                   # 工具库
│   │   ├── agent-data.ts      # 代理数据工具
│   │   ├── ai-analyzer.ts     # 交易模式分析
│   │   ├── ai-profiles.ts     # AI 对手定义
│   │   ├── battle-data.ts     # 战斗卡组数据服务
│   │   ├── battle-engine.ts   # 战斗模拟引擎
│   │   ├── battle-recorder.ts # 战斗历史记录
│   │   ├── card-generator.ts  # 卡牌生成逻辑
│   │   ├── contracts.ts       # 合约 ABI 和地址
│   │   ├── leaderboard.ts     # 排行榜数据
│   │   ├── mantle-data.ts     # Mantle 网络数据
│   │   ├── market-data.ts     # 市场模拟数据
│   │   ├── mock-data.ts       # 开发模拟数据
│   │   ├── social-share.ts    # 社交分享工具
│   │   ├── utils.ts           # 通用工具
│   │   └── wagmi-config.ts    # Web3 配置
│   └── types/                 # TypeScript 类型定义
│       ├── battle.ts          # 战斗相关类型
│       ├── card.ts            # 卡牌 NFT 类型
│       ├── index.ts           # 类型导出
│       └── leaderboard.ts     # 排行榜类型
├── docs/                      # 文档
│   ├── ARCHITECTURE.md        # 系统架构
│   └── GAME_GUIDE.md         # 游戏指南
├── .env.example               # 环境变量模板
├── .gitignore                # Git 忽略规则
├── package.json              # 依赖
├── tsconfig.json             # TypeScript 配置
├── next.config.ts            # Next.js 配置
└── README.md                 # 本文件
```

## 📜 智能合约

### MantleCards.sol
- **用途**：卡牌 NFT 铸造和所有权的主合约
- **标准**：ERC-721 配合 ERC-8004 扩展
- **特性**：
  - 动态卡牌属性
  - 基于稀有度的铸造
  - 链上元数据

### Marketplace.sol
- **用途**：P2P 卡牌交易市场
- **特性**：
  - 挂牌出售卡牌
  - 出价
  - 即时购买

### AgentIdentity.sol
- **用途**：代理注册和资料管理
- **特性**：
  - 代理注册
  - 投资组合追踪
  - 代理展示

### ERC8004.sol
- **用途**：ERC-8004 合规扩展
- **特性**：
  - 扩展代币接口
  - 交易历史追踪

## ⚔️ 游戏机制

### 卡牌生成
卡牌根据您钱包的链上数据生成：

| 属性 | 来源 | 效果 |
|-----------|--------|--------|
| **稀有度** | 投资组合价值 | 普通 < \\$100, 稀有 < \\$1,000, 史诗 < \\$10,000, 传说 \\$10,000+ |
| **攻击力** | MNT 余额 | 余额越高 = 攻击力越高 |
| **防御力** | ERC-20 多样性 | 代币类型越多 = 防御力越高 |
| **特殊能力** | 交易模式 | 基于交易行为 |
| **经验值** | 交易次数 | 交易越多 = 等级越高 |

### 稀有度等级

| 稀有度 | 颜色 | 倍率 | 要求 |
|--------|-------|------------|--------------|
| 🟢 普通 | 石板灰 | 1.0x | 任何钱包 |
| 🔵 稀有 | 靛蓝蓝 | 1.25x | \\$100+ 投资组合 |
| 🟣 史诗 | 紫罗兰 | 1.5x | \\$1,000+ 投资组合 |
| 🟡 传说 | 琥珀金 | 1.75x | \\$10,000+ 投资组合 |

### 战斗系统

**回合结构：**
1. 从手牌中选择一张卡牌
2. AI 对手选择一张卡牌
3. 双方同时攻击
4. 伤害计算：`攻击力 - (防御力 / 2)`
5. 可能出现暴击（10% 基础概率）
6. 最多重复 3 回合

**胜利条件：**
- 将对手生命值降至 0
- 回合结束时拥有更多生命值
- 造成更高的累计伤害

### AI 对手

| AI 角色 | 难度 | 风格 | 风险容忍度 |
|-------------|------------|-------|----------------|
| 🐋 鲸鱼猎人 | 困难 | 激进型 | 0.9 |
| 🛡️ 防御策略师 | 中等 | 保守型 | 0.2 |
| ⚖️ 均衡交易者 | 中等 | 均衡型 | 0.5 |
| 🧓 加密老手 | 困难 | 激进型 | 0.7 |
| 🙈 纸手玩家 | 简单 | 保守型 | 0.1 |
| 🎲 赌徒交易者 | 中等 | 激进型 | 0.95 |

## 🤖 AI 集成

### 交易模式分析
AI 分析器检查您钱包的：
- 交易频率
- 平均交易规模
- 代币多样性
- Gas 消费模式
- 交易风格（激进/保守/均衡）

### 卡牌匹配
根据分析，系统会：
1. 生成具有匹配属性的卡牌
2. 选择合适的 AI 对手
3. 调整战斗难度
4. 提供战略建议

### 智能战斗匹配
- AI 角色根据您的交易模式选择
- 战斗难度根据您的胜负比进行调整
- 卡牌权重与您的风格匹配

## 🎨 UI/UX 特性

### 配色方案
- **主金色**：`#C9A227` - 强调和高亮
- **次要紫色**：`#7C6BAF` - 次要操作
- **强调蓝色**：`#5B8FD9` - 信息元素
- **背景色**：`#12111a` - 护眼深色底色
- **卡牌背景**：`#1a1625` - 微妙的对比

### 交互元素
- **卡牌悬停效果**：缩放和发光动画
- **传说光效**：动画金色粒子
- **弹窗滚动**：内容完全可见，支持滚动
- **响应式网格**：适应所有屏幕尺寸的自适应卡牌布局

## 📄 许可证

本项目采用 MIT 许可证。

## 📞 联系方式

- **邮箱**: 2482559491@qq.com
- **项目**: The Turing Test Hackathon 2026
- **网络**: Mantle
- **赛道**: Consumer Viral DApps

---

<p align="center">
  在 Mantle Network 上构建
  <br />
  AI 驱动 • 区块链保障 • 为玩家设计
</p>
