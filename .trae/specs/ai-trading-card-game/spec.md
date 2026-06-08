# AI-Powered Trading Card Game - 项目规范

## Why
传统的DeFi界面缺乏趣味性和用户粘性，而游戏化的NFT交易卡牌结合AI能力，不仅能降低Web3入门门槛，还能创造病毒式传播的用户体验。本项目将Mantle生态的代币NFT化为可收集、交易、对战的卡牌，AI系统根据链上数据动态调整卡牌属性，实现"玩DeFi，学DeFi"的核心理念。

## What Changes
- 创建一个完整的AI驱动的交易卡牌NFT游戏
- 卡牌属性基于Mantle链上真实数据动态变化
- 支持卡牌交易、对战和收藏系统
- 集成AI分析功能提供智能推荐

## Impact
- **Affected specs**: Consumer Viral DApps赛道产品
- **Affected code**: 全栈应用（前端 + 智能合约 + AI集成）

## 比赛要求对齐

### 赛道要求：Consumer Viral DApps
- ✅ 部署到 Mantle Network
- ✅ 开源仓库 + 可运行演示 + 项目介绍
- ✅ 可运行前端界面
- ✅ 包含 AI 能力
- ✅ 游戏化交易界面
- ✅ 可分享消费者应用

### 评分标准权重
- 技术深度（30%）：AI × 链上集成、架构完整性、代码质量
- 创新性（25%）：新的 AI × Web3 游戏化范式
- Mantle生态贡献（25%）：使用Mantle网络，贡献生态系统
- 产品完整性（20%）：可运行演示、用户体验、可扩展性

### 比赛三大特征融合
- On-chain benchmarking：AI决策和结果记录在Mantle链上
- ERC-8004 agent identity：AI Agent可拥有独特身份NFT
- Radical transparency：支持实时展示AI对战过程

## ADDED Requirements

### Requirement: 卡牌NFT铸造系统
系统 SHALL 提供基于Mantle链上数据铸造NFT卡牌的功能，卡牌属性根据以下链上指标动态计算

#### Scenario: 铸造新卡牌
- **WHEN** 用户连接钱包并发起铸造请求
- **THEN** 系统从Mantle链获取该钱包的持仓数据（代币类型、数量、交易历史）
- **AND** 根据持仓情况生成对应属性（如：持有MNT→攻击值+，持有mETH→防御值+）
- **AND** 铸造NFT并展示卡牌动画

### Requirement: AI对战系统
系统 SHALL 提供AI驱动的卡牌对战功能，AI根据链上数据分析自动出牌

#### Scenario: AI对战模式
- **WHEN** 用户选择AI对战模式
- **THEN** AI分析用户的链上持仓和历史交易
- **AND** 生成符合用户风险偏好的对战策略
- **AND** 实时展示对战过程和结果
- **AND** 将对战结果记录到链上

### Requirement: 卡牌交易市场
系统 SHALL 提供卡牌交易和分享功能，支持用户间卡牌交易和社交分享

#### Scenario: 卡牌交易
- **WHEN** 用户上架卡牌进行交易
- **THEN** 系统创建链上交易挂单
- **AND** 支持其他用户通过Mantle网络购买
- **AND** 交易完成后自动转移NFT所有权

### Requirement: 社交分享系统
系统 SHALL 提供一键分享卡牌到社交媒体的功能

#### Scenario: 分享卡牌
- **WHEN** 用户点击分享按钮
- **THEN** 系统生成分享图片（包含卡牌信息和项目Logo）
- **AND** 生成可分享的链接
- **AND** 支持一键分享到X/Twitter

### Requirement: AI卡牌分析师
系统 SHALL 提供AI驱动的卡牌分析功能

#### Scenario: 卡牌分析
- **WHEN** 用户提交卡牌进行分析
- **THEN** AI分析卡牌属性和链上数据
- **AND** 提供卡牌潜力评分
- **AND** 给出升级建议和最佳组合推荐

## 技术栈要求

### 前端要求
- React/Next.js 框架
- TailwindCSS 样式
- Web3Modal/Wagmi 连接钱包
- Canvas/WebGL 渲染卡牌动画

### 合约要求
- Solidity 智能合约
- 部署到 Mantle Network（主网或测试网）
- 支持 ERC-721 NFT 标准
- 可选的 ERC-8004 Agent Identity

### AI集成要求
- 集成 AI API（如 OpenAI、Claude等）
- 提供卡牌对战AI策略
- 提供卡牌分析推荐

### 数据源要求
- Mantle RPC API 获取链上数据
- 支持钱包地址查询
- 支持交易历史分析

## MODIFIED Requirements
无

## REMOVED Requirements
无
