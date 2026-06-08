# Mantle Testnet 部署指南

## 概述

本文档提供将 AI 交易卡牌游戏部署到 Mantle Sepolia 测试网的完整指南。

## 前置要求

### 必需工具

- **Node.js** >= 18.0.0
- **npm** 或 **yarn**
- **MetaMask** 或其他 Web3 钱包
- **Git**

### 获取 Mantle Sepolia 测试网 ETH

1. 访问 [Mantle 水龙头](https://www.mantle.xyz/ faucet)
2. 连接你的 MetaMask 钱包
3. 选择 Mantle Sepolia Testnet 网络
4. 请求测试代币（每个地址每小时限制）

或者使用其他水龙头：
- https://faucet.mantle.xyz/
- https://testnet.mantle.xyz/faucet

### 钱包配置

1. 在 MetaMask 中添加 Mantle Sepolia 测试网：
   - **网络名称**: Mantle Sepolia Testnet
   - **RPC URL**: https://rpc.sepolia.mantle.xyz
   - **链 ID**: 5003
   - **符号**: MNT
   - **浏览器链接**: https://www.mantle.xyz/explorer

2. 确保钱包中有足够的测试代币用于部署 gas 费用

## 部署步骤

### 1. 安装依赖

```bash
# 安装 Hardhat 和相关依赖
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox dotenv

# 安装 OpenZeppelin 合约
npm install @openzeppelin/contracts
```

### 2. 配置环境变量

```bash
# 复制环境变量示例文件
cp contracts/.env.example contracts/.env

# 编辑 .env 文件，填入你的配置
MANTLE_SEPOLIA_RPC_URL=https://rpc.sepolia.mantle.xyz
PRIVATE_KEY=your_deployer_wallet_private_key
MANTLE_EXPLORER_API_KEY=your_explorer_api_key
```

⚠️ **重要**: 永远不要将包含私钥的 .env 文件提交到版本控制！

### 3. 配置 Hardhat

项目已包含 `hardhat.config.ts` 配置文件，配置了：
- Mantle Mainnet (chainId: 5000)
- Mantle Sepolia Testnet (chainId: 5003)

### 4. 编译合约

```bash
npx hardhat compile
```

### 5. 部署合约

**部署到 Mantle Sepolia 测试网：**

```bash
npx hardhat run scripts/deploy.ts --network mantleSepolia
```

**部署到 Mantle 主网：**

```bash
npx hardhat run scripts/deploy.ts --network mantle
```

部署脚本会自动：
1. 部署 MantleCards 合约
2. 部署 Marketplace 合约
3. 部署 AgentIdentity 合约
4. 将部署地址保存到 `deployments.json`

### 6. 验证合约

部署完成后，使用以下命令验证合约：

```bash
# 验证 MantleCards
npx hardhat verify --network mantleSepolia <MANTLE_CARDS_ADDRESS>

# 验证 Marketplace
npx hardhat verify --network mantleSepolia <MARKETPLACE_ADDRESS> <OWNER_ADDRESS>

# 验证 AgentIdentity
npx hardhat verify --network mantleSepolia <AGENT_IDENTITY_ADDRESS>
```

或者手动在 [Mantle Explorer](https://explorer.testnet.mantle.xyz/) 上验证。

## 合约说明

### MantleCards (chainId: 5000/5003)

NFT 卡牌合约，提供：
- ERC721 标准实现
- 卡牌属性管理（稀有度、攻击力、防御力）
- 特殊能力
- 用户卡牌追踪

### Marketplace (chainId: 5000/5003)

市场合约，提供：
- 挂牌功能（0.001 MNT 费用）
- 购买功能（2.5% 市场费 + 5% 创建者版税）
- 取消挂牌
- 价格更新

### AgentIdentity (chainId: 5000/5003)

AI 代理身份合约，提供：
- 代理注册
- 战斗统计追踪
- 声望系统
- 成就系统
- 匹配分数计算

## 验证合约

### 在 Mantle Explorer 上验证

1. 访问 [Mantle Explorer](https://explorer.testnet.mantle.xyz/)
2. 搜索你的合约地址
3. 点击 "Contract" -> "Verify & Publish"
4. 选择合约类型（Solidity - Single File）
5. 粘贴合约源代码
6. 填写编译器版本和构造参数
7. 点击验证

### 与已验证合约交互

验证后，你可以：
- 在 Explorer 上读取合约状态
- 使用 Web3 库调用合约方法
- 使用 Remix IDE 连接合约

## 更新前端配置

部署合约后，需要更新前端配置：

### 1. 更新合约地址

编辑 `src/lib/contracts.ts` 或创建 `src/contracts/config.ts`：

```typescript
export const CONTRACTS = {
  mantleSepolia: {
    mantleCards: '0x...',
    marketplace: '0x...',
    agentIdentity: '0x...'
  },
  mantleMainnet: {
    mantleCards: '0x...',
    marketplace: '0x...',
    agentIdentity: '0x...'
  }
}
```

### 2. 更新网络配置

编辑 `src/lib/wagmi-config.ts` 添加 Mantle 网络配置：

```typescript
import { mantleSepolia } from 'wagmi/chains'

export const config = {
  chains: [mantleSepolia],
  // ... 其他配置
}
```

### 3. 添加钱包连接

使用 WalletConnect 或 MetaMask 连接钱包到 Mantle Sepolia。

## 常见问题

### Q: 部署失败，显示 "insufficient funds"

确保你的钱包有足够的 MNT 代币用于支付 gas 费用。测试网水龙头通常每次提供 0.5-1 MNT。

### Q: 验证失败，显示 "Already Verified"

合约已经在 Explorer 上验证过了。直接使用现有验证即可。

### Q: 交易卡住了

在 MetaMask 中取消待处理交易，然后重新提交。

### Q: 如何获取 Mantle Explorer API Key？

访问 [Mantle Explorer API](https://explorer.mantle.xyz/api) 注册获取。

## 安全建议

1. **永远不要**在代码中硬编码私钥
2. **永远不要**将 .env 文件提交到 Git
3. 使用硬件钱包进行主网部署
4. 在测试网充分测试后再部署到主网
5. 验证合约源代码以建立信任

## 相关链接

- [Mantle 文档](https://docs.mantle.xyz/)
- [Mantle Explorer](https://explorer.mantle.xyz/)
- [Mantle 水龙头](https://www.mantle.xyz/faucet)
- [Hardhat 文档](https://hardhat.org/docs)
- [OpenZeppelin 文档](https://docs.openzeppelin.com/)
