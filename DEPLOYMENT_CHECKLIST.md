# Mantle Testnet 部署检查清单

## 部署前准备

- [ ] Node.js >= 18.0.0 已安装
- [ ] MetaMask 或其他 Web3 钱包已安装
- [ ] Git 已安装
- [ ] 项目代码已克隆到本地

## 环境配置

- [ ] 已安装 Hardhat 和相关依赖
  ```bash
  npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox dotenv
  ```
- [ ] 已安装 OpenZeppelin 合约
  ```bash
  npm install @openzeppelin/contracts
  ```
- [ ] 已复制环境变量文件
  ```bash
  cp contracts/.env.example contracts/.env
  ```
- [ ] 已配置 `PRIVATE_KEY`（部署钱包私钥）
- [ ] 已配置 `MANTLE_SEPOLIA_RPC_URL`
- [ ] 已配置 `MANTLE_EXPLORER_API_KEY`（可选，用于自动验证）
- [ ] `.env` 文件已添加到 `.gitignore`

## 获取测试代币

- [ ] 已连接 MetaMask 到 Mantle Sepolia 测试网
- [ ] 已从水龙头获取测试 MNT 代币
- [ ] 钱包余额足以支付 gas 费用（建议 > 0.5 MNT）

### Mantle Sepolia 测试网信息
- **网络名称**: Mantle Sepolia Testnet
- **RPC URL**: https://rpc.sepolia.mantle.xyz
- **链 ID**: 5003
- **符号**: MNT
- **浏览器链接**: https://explorer.testnet.mantle.xyz

### 水龙头链接
- https://faucet.mantle.xyz/
- https://testnet.mantle.xyz/faucet

## 编译合约

- [ ] 运行编译命令
  ```bash
  npx hardhat compile
  ```
- [ ] 编译成功，无错误
- [ ] 生成的 artifacts 目录包含编译后的合约

## 部署合约

- [ ] 运行部署脚本
  ```bash
  npx hardhat run scripts/deploy.ts --network mantleSepolia
  ```
- [ ] 部署成功，所有三个合约已部署
- [ ] 已记录部署地址：
  - MantleCards: `0x...`
  - Marketplace: `0x...`
  - AgentIdentity: `0x...`
- [ ] `deployments.json` 文件已生成

## 验证合约

- [ ] 在 Mantle Explorer 上验证 MantleCards
  - 地址: `0x...`
  - 链接: https://explorer.testnet.mantle.xyz/address/0x.../contracts
- [ ] 在 Mantle Explorer 上验证 Marketplace
  - 地址: `0x...`
- [ ] 在 Mantle Explorer 上验证 AgentIdentity
  - 地址: `0x...`

### 手动验证命令
```bash
npx hardhat verify --network mantleSepolia <MANTLE_CARDS_ADDRESS>
npx hardhat verify --network mantleSepolia <MARKETPLACE_ADDRESS> <OWNER_ADDRESS>
npx hardhat verify --network mantleSepolia <AGENT_IDENTITY_ADDRESS>
```

## 更新前端配置

- [ ] 已创建/更新合约配置文件
- [ ] 已添加 MantleCards 地址到配置
- [ ] 已添加 Marketplace 地址到配置
- [ ] 已添加 AgentIdentity 地址到配置
- [ ] 已配置正确的 chainId (5003 for testnet)
- [ ] 已更新 `wagmi-config.ts` 添加 Mantle 网络

### 前端配置示例 (src/contracts/config.ts)
```typescript
export const CONTRACTS = {
  mantleSepolia: {
    mantleCards: '0x...',
    marketplace: '0x...',
    agentIdentity: '0x...'
  }
}
```

## 测试部署

- [ ] 前端应用成功构建
  ```bash
  npm run build
  ```
- [ ] 钱包可以成功连接到 Mantle Sepolia
- [ ] 可以读取合约数据
- [ ] 可以铸造测试卡牌（如适用）

## 部署到主网（可选）

- [ ] 测试网部署已验证并正常工作
- [ ] 已切换到 Mantle Mainnet 配置
- [ ] 主网钱包有足够的 MNT 用于部署
- [ ] 已再次确认所有合约地址正确
- [ ] 已通知团队部署完成

## 部署后任务

- [ ] 已记录所有合约地址
- [ ] 已记录部署时间戳
- [ ] 已更新项目文档
- [ ] 团队成员已收到合约地址通知
- [ ] 前端已部署到生产环境

## 合约交互记录

### MantleCards
- 地址: ________________
- 部署时间: ________________
- Etherscan: https://explorer.testnet.mantle.xyz/address/________________

### Marketplace
- 地址: ________________
- 部署时间: ________________
- Etherscan: https://explorer.testnet.mantle.xyz/address/________________

### AgentIdentity
- 地址: ________________
- 部署时间: ________________
- Etherscan: https://explorer.testnet.mantle.xyz/address/________________

## 备注

____________________________________________________________

____________________________________________________________

____________________________________________________________
