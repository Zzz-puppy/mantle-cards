# MantleCards - AI Trading Card Game

> 一个基于 Mantle Network 的 AI 驱动的 NFT 卡牌游戏

## 📋 项目概述

**MantleCards** 是一个集成了 AI 技术的 Web3 卡牌游戏项目，玩家可以铸造、交易和战斗 NFT 卡牌。项目最初是为参加 **The Turing Test Hackathon 2026**（Consumer Viral DApps 赛道）而开发，现作为个人学习/作品集项目继续维护。

---

## 🎯 项目起源

### 比赛信息
- **比赛名称**: The Turing Test Hackathon 2026
- **主办方**: Mantle Network
- **平台**: DoraHacks
- **奖金池**: $100,000 USD
- **赛道**: Consumer Viral DApps（游戏化交易界面和可分享的消费者应用）

### 比赛要求回顾

#### 通用要求
| 项目 | 要求 |
|------|------|
| 部署环境 | 必须部署在 Mantle Network（主网或测试网）|
| 提交材料 | 开源仓库 + 可运行 Demo + 项目介绍 |
| 前端界面 | 必须有可运行的前端界面 |
| AI 元素 | 需要包含 AI 能力 |

#### 评分标准
| 维度 | 权重 |
|------|------|
| 技术深度 | 30% |
| 创新性 | 25% |
| Mantle 生态贡献 | 25% |
| 产品完整性 | 20% |

#### 额外奖项
- Community Voting（社区投票奖）
- Best UI/UX Award（最佳用户体验奖）
- 20 Project Deployment Award（部署奖）

### 最终决定
**决定不参赛**，将项目作为个人作品集项目继续维护。

---

## 🏗️ 项目架构

### 技术栈
| 层级 | 技术 |
|------|------|
| **前端框架** | Next.js 15 + React + TypeScript |
| **样式方案** | TailwindCSS |
| **状态管理** | React Context + Custom Hooks |
| **动画效果** | Framer Motion |
| **Web3 集成** | Wagmi + Viem + Web3Modal |
| **智能合约** | Solidity + Hardhat + OpenZeppelin |
| **区块链** | Mantle Network |

### 目录结构
```
mantle-cards/
├── src/
│   ├── app/                    # Next.js 页面
│   │   ├── page.tsx           # 首页
│   │   ├── collection/        # 卡牌收藏
│   │   ├── battle/            # AI 对战
│   │   ├── market/            # 卡牌市场
│   │   ├── profile/           # 个人页面
│   │   └── leaderboard/       # 排行榜
│   ├── components/            # 组件库
│   │   ├── ClientLayout.tsx   # 全局布局
│   │   ├── WalletButton.tsx   # 钱包按钮
│   │   ├── MintCard.tsx       # 卡牌铸造
│   │   ├── battle/            # 对战组件
│   │   ├── marketplace/       # 市场组件
│   │   └── leaderboard/       # 排行榜组件
│   ├── contexts/              # 全局状态
│   │   └── WalletContext.tsx  # 钱包状态管理
│   ├── hooks/                 # 自定义 Hooks
│   │   ├── useMockWallet.ts   # 模拟钱包
│   │   ├── useBattle.ts       # 对战逻辑
│   │   ├── useMarketData.ts   # 市场数据
│   │   └── useMintCard.ts     # 铸造逻辑
│   ├── lib/                   # 工具库
│   │   ├── mock-data.ts       # 模拟数据
│   │   ├── card-generator.ts  # 卡牌生成
│   │   ├── battle-recorder.ts # 对战记录
│   │   └── social-share.ts    # 社交分享
│   └── types/                 # TypeScript 类型
├── contracts/                 # 智能合约
│   ├── MantleCards.sol        # NFT 合约
│   ├── Marketplace.sol        # 市场合约
│   └── AgentIdentity.sol      # ERC-8004 代理身份
├── scripts/                   # 部署脚本
├── docs/                      # 文档
└── .trae/specs/               # 开发规范
```

---

## ✅ 已完成功能

### 1. 核心功能
- [x] **首页展示**: 项目介绍和导航
- [x] **钱包连接**: Mock 钱包模拟（含 localStorage 持久化）
- [x] **卡牌铸造**: 基于钱包投资组合生成 AI 卡牌
- [x] **卡牌收藏**: 浏览、筛选、排序卡牌
- [x] **AI 对战**: 回合制战斗系统
- [x] **卡牌市场**: 买卖交易功能
- [x] **个人页面**: 玩家信息和统计数据
- [x] **排行榜**: 多维度排名系统

### 2. 智能合约
- [x] **MantleCards.sol**: ERC-721 NFT 合约
- [x] **Marketplace.sol**: 卡牌交易市场
- [x] **AgentIdentity.sol**: ERC-8004 AI 代理身份

### 3. 工具和文档
- [x] 完整的 README.md
- [x] 部署指南 (DEPLOYMENT.md)
- [x] 演示视频指南 (DEMO_VIDEO_GUIDE.md)
- [x] 项目总结 (PROJECT_SUMMARY.md)
- [x] 架构文档 (docs/ARCHITECTURE.md)
- [x] 游戏指南 (docs/GAME_GUIDE.md)

---

## 📊 当前状态

### 运行状态
| 项目 | 状态 |
|------|------|
| **本地开发** | ✅ 可在 http://localhost:3002 运行 |
| **代码完整性** | ✅ 所有功能开发完成 |
| **GitHub 仓库** | ✅ https://github.com/Zzz-puppy/mantle-cards |
| **生产部署** | ❌ 未部署到 Vercel |
| **合约部署** | ❌ 未部署到 Mantle 网络 |

### 测试情况
- ✅ 所有页面正常加载
- ✅ 钱包连接持久化（页面切换不丢失）
- ✅ 卡牌铸造流程完整
- ✅ AI 对战系统正常
- ✅ 市场交易功能可用
- ✅ 导航栏切换流畅

---

## 🐛 开发过程中解决的问题

### 1. 跨域错误
**问题**: Coinbase Wallet SDK 尝试连接外部服务导致 ERR_ABORTED
**解决**: 移除 WalletConnect 和 Coinbase Wallet 连接器，只保留 MetaMask（Mock 模式）

### 2. RSC 请求中止
**问题**: 服务端组件尝试渲染需要客户端 hooks 的组件
**解决**: 创建 ClientLayout 组件分离客户端逻辑

### 3. metadata 导出冲突
**问题**: layout.tsx 同时使用 'use client' 和导出 metadata
**解决**: 将客户端逻辑移到 ClientLayout，保持 layout.tsx 为服务器组件

### 4. 钱包状态丢失
**问题**: 页面导航时钱包连接断开
**解决**: 使用 React Context + localStorage 实现全局状态管理

### 5. 钱包连接超时
**问题**: 连接后一直显示 "Connecting..."
**解决**: 移除可能导致问题的状态判断，简化连接流程

### 6. Profile 页面按钮无响应
**问题**: Connect Wallet 按钮没有绑定点击事件
**解决**: 集成 useWallet hook，添加 onClick 事件处理

---

## 🎯 下一步建议

### 短期目标（1-2周）

#### 1. 部署到 Vercel
**目的**: 让项目可以通过公网访问

**步骤**:
1. 访问 https://vercel.com
2. 使用 GitHub 账号登录
3. 导入 `Zzz-puppy/mantle-cards` 仓库
4. 配置环境变量：
   - `NEXT_PUBLIC_WAGMI_CHAIN_ID=5003`
   - `NEXT_PUBLIC_RPC_URL=https://rpc.testnet.mantle.xyz`
5. 点击 Deploy

**预计时间**: 10-15 分钟

#### 2. 部署智能合约
**目的**: 让 NFT 功能真正在链上运行

**步骤**:
1. 获取 Mantle 测试网 MNT 代币（https://faucet.mantle.xyz）
2. 配置 `.env` 文件中的私钥
3. 运行 `npx hardhat compile`
4. 运行 `npx hardhat run scripts/deploy.ts --network mantleTestnet`

**预计时间**: 30-60 分钟

#### 3. 集成真实钱包
**目的**: 替换 Mock 钱包，支持真实 Web3 交互

**步骤**:
1. 安装 `@metamask/detect-provider`
2. 修改 WalletContext 支持真实 MetaMask
3. 添加网络切换逻辑
4. 测试连接、签名、交易流程

**预计时间**: 2-4 小时

### 中期目标（1-2个月）

#### 1. 完善 AI 功能
- 集成真实的 AI 模型（如 OpenAI、Anthropic）
- 实现更智能的卡牌生成算法
- 优化 AI 对战策略

#### 2. 用户系统
- 添加用户注册/登录
- 实现游戏存档
- 添加成就系统

#### 3. 数据库集成
- 选择数据库（PostgreSQL、MongoDB）
- 设计数据模型
- 实现 API 接口

#### 4. 移动端适配
- PWA 支持
- 响应式优化
- 移动端钱包集成（WalletConnect）

### 长期目标（3-6个月）

#### 1. 功能扩展
- 公会系统
- 锦标赛模式
- 跨链支持
- NFT 租赁市场

#### 2. 商业化探索
- 代币经济模型
- 治理机制
- 社区运营

#### 3. 性能优化
- 智能合约 Gas 优化
- 前端性能优化
- 缓存策略

---

## 📚 学习价值

这个项目涵盖了以下技术领域：

### Web3 开发
- Solidity 智能合约开发
- ERC-721 NFT 标准
- 去中心化交易逻辑
- 钱包集成（MetaMask、Wagmi）

### AI 集成
- AI 驱动的卡牌生成
- 智能对手匹配
- 数据驱动的游戏机制

### 前端技术
- Next.js 15 App Router
- TypeScript 类型系统
- TailwindCSS 样式方案
- Framer Motion 动画
- React Context 状态管理

### 后端/工具
- Hardhat 开发框架
- OpenZeppelin 合约库
- Web3Modal 钱包连接

---

## 🔧 常用命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行代码检查
npm run lint

# 类型检查
npm run typecheck

# 编译智能合约
npx hardhat compile

# 运行合约测试
npx hardhat test

# 部署合约
npx hardhat run scripts/deploy.ts --network mantleTestnet
```

---

## 📁 重要文档索引

| 文档 | 路径 | 说明 |
|------|------|------|
| README | `/README.md` | 项目主文档 |
| 部署指南 | `/DEPLOYMENT.md` | 详细部署步骤 |
| 演示视频指南 | `/DEMO_VIDEO_GUIDE.md` | 视频录制指南 |
| 项目总结 | `/PROJECT_SUMMARY.md` | 项目概览 |
| 架构文档 | `/docs/ARCHITECTURE.md` | 技术架构 |
| 游戏指南 | `/docs/GAME_GUIDE.md` | 使用说明 |
| 部署检查清单 | `/DEPLOYMENT_CHECKLIST.md` | 部署检查 |
| 功能规范 | `/.trae/specs/ai-trading-card-game/spec.md` | 开发规范 |
| 任务清单 | `/.trae/specs/ai-trading-card-game/tasks.md` | 任务列表 |
| 检查清单 | `/.trae/specs/ai-trading-card-game/checklist.md` | 完成检查 |

---

## 🌐 相关链接

| 链接 | 地址 |
|------|------|
| GitHub 仓库 | https://github.com/Zzz-puppy/mantle-cards |
| Mantle Network | https://mantle.xyz |
| Mantle 测试网水龙头 | https://faucet.mantle.xyz |
| Mantle 浏览器 | https://explorer.mantle.xyz |
| 比赛页面 | https://dorahacks.io/hackathon/mantleturingtesthackathon2026 |

---

## 💡 项目亮点

1. **完整性**: 包含智能合约、前端、后端的完整全栈应用
2. **创新性**: 将 AI 技术与 Web3 游戏结合
3. **技术深度**: 使用最新的 Next.js 15 和现代 Web3 工具
4. **可扩展性**: 模块化设计，易于添加新功能
5. **文档完善**: 详细的文档和开发规范

---

## 📝 总结

**MantleCards** 是一个功能完整、技术先进的 Web3 卡牌游戏项目。虽然决定不参加比赛，但项目本身已经是一个高质量的个人作品，展示了：

- 全栈开发能力
- Web3 技术理解
- AI 应用能力
- 系统设计思维
- 文档编写能力

**下一步**: 建议先部署到 Vercel 让项目上线，然后根据个人兴趣选择深入方向（Web3、AI、游戏玩法等）。

---

**项目状态**: 开发完成，待部署
**最后更新**: 2026-06-14
**GitHub**: https://github.com/Zzz-puppy/mantle-cards
