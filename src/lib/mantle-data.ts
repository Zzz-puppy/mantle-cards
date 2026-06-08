import { http, createPublicClient } from 'viem'
import { mantleMainnet, mantleSepolia } from './wagmi-config'
import type { Address } from 'viem'

// Cache configuration
const CACHE_TTL = 30000 // 30 seconds
interface CacheEntry<T> {
  data: T
  timestamp: number
}

const cache = new Map<string, CacheEntry<unknown>>()

// RPC endpoints
const RPC_ENDPOINTS = {
  [mantleMainnet.id]: 'https://rpc.mantle.xyz',
  [mantleSepolia.id]: 'https://rpc.sepolia.mantle.xyz',
} as const

// Create public client for chain
function getPublicClient(chainId: number) {
  const chain = chainId === mantleMainnet.id ? mantleMainnet : mantleSepolia
  return createPublicClient({
    chain,
    transport: http(RPC_ENDPOINTS[chainId as keyof typeof RPC_ENDPOINTS]),
  })
}

// Cache helpers
function getCached<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key)
    return null
  }
  return entry.data
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() })
}

// Clear cache for specific address
export function clearAddressCache(address: Address): void {
  const prefix = address.toLowerCase()
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key)
    }
  }
}

// Fetch MNT balance
export async function getMNTBalance(
  address: Address,
  chainId: number = mantleMainnet.id
): Promise<bigint> {
  const cacheKey = `${address.toLowerCase()}-mnt-balance-${chainId}`
  const cached = getCached<bigint>(cacheKey)
  if (cached !== null) return cached

  const client = getPublicClient(chainId)
  const balance = await client.getBalance({ address })
  
  setCache(cacheKey, balance)
  return balance
}

// Fetch native token balance (ETH-style on Mantle)
export async function getNativeTokenBalance(
  address: Address,
  chainId: number = mantleMainnet.id
): Promise<bigint> {
  return getMNTBalance(address, chainId)
}

// ERC20 Token info interface
export interface ERC20Token {
  address: Address
  symbol: string
  decimals: number
  balance: bigint
}

// Common ERC20 tokens on Mantle (placeholder list)
const COMMON_TOKENS: Address[] = [
  '0x78c1b50A98fB0E28C4bF073bE0F35Ce2A37D4F6a' as Address, // wMNT
  '0xDeadDeAddeAddEAddeadDEaDDEaD000000000000' as Address, // Example
]

// Fetch ERC20 token balance
export async function getERC20Balance(
  address: Address,
  tokenAddress: Address,
  chainId: number = mantleMainnet.id
): Promise<bigint> {
  const cacheKey = `${address.toLowerCase()}-erc20-${tokenAddress.toLowerCase()}-${chainId}`
  const cached = getCached<bigint>(cacheKey)
  if (cached !== null) return cached

  try {
    const client = getPublicClient(chainId)
    // ERC20 balanceOf selector: 0x70a08231
    const balanceData = await client.readContract({
      address: tokenAddress,
      abi: [
        {
          inputs: [{ name: 'account', type: 'address' }],
          name: 'balanceOf',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      functionName: 'balanceOf',
      args: [address],
    })
    
    setCache(cacheKey, balanceData)
    return balanceData
  } catch {
    return BigInt(0)
  }
}

// Fetch multiple ERC20 balances
export async function getERC20Balances(
  address: Address,
  tokenAddresses: Address[],
  chainId: number = mantleMainnet.id
): Promise<ERC20Token[]> {
  const results: ERC20Token[] = []
  
  await Promise.all(
    tokenAddresses.map(async (tokenAddress) => {
      try {
        const client = getPublicClient(chainId)
        const [balance, symbol, decimals] = await Promise.all([
          client.readContract({
            address: tokenAddress,
            abi: [
              {
                inputs: [{ name: 'account', type: 'address' }],
                name: 'balanceOf',
                outputs: [{ name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
              },
            ],
            functionName: 'balanceOf',
            args: [address],
          }),
          client.readContract({
            address: tokenAddress,
            abi: [
              {
                inputs: [],
                name: 'symbol',
                outputs: [{ name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
              },
            ],
            functionName: 'symbol',
          }),
          client.readContract({
            address: tokenAddress,
            abi: [
              {
                inputs: [],
                name: 'decimals',
                outputs: [{ name: '', type: 'uint8' }],
                stateMutability: 'view',
                type: 'function',
              },
            ],
            functionName: 'decimals',
          }),
        ])

        results.push({
          address: tokenAddress,
          symbol,
          decimals,
          balance,
        })
      } catch {
        // Skip failed tokens
      }
    })
  )

  return results
}

// Transaction history interface
export interface TransactionInfo {
  hash: string
  from: Address
  to: Address | null
  value: bigint
  gasUsed: bigint
  gasPrice: bigint
  timestamp: number
  blockNumber: bigint
}

// Fetch transaction count (nonce)
export async function getTransactionCount(
  address: Address,
  chainId: number = mantleMainnet.id
): Promise<number> {
  const cacheKey = `${address.toLowerCase()}-tx-count-${chainId}`
  const cached = getCached<number>(cacheKey)
  if (cached !== null) return cached

  const client = getPublicClient(chainId)
  const count = await client.getTransactionCount({ address })
  
  setCache(cacheKey, Number(count))
  return Number(count)
}

// Fetch gas spent history
export async function getGasSpentHistory(
  address: Address,
  chainId: number = mantleMainnet.id,
  blockRange: number = 1000
): Promise<{ totalGas: bigint; txCount: number }> {
  const cacheKey = `${address.toLowerCase()}-gas-${chainId}-${blockRange}`
  const cached = getCached<{ totalGas: bigint; txCount: number }>(cacheKey)
  if (cached !== null) return cached

  const client = getPublicClient(chainId)
  const blockNumber = await client.getBlockNumber()
  const startBlock = blockNumber - BigInt(blockRange)

  try {
    // Get logs for address as topic0 (events) or as address
    const logs = await client.getLogs({
      address,
      fromBlock: startBlock,
      toBlock: blockNumber,
    })

    let totalGas = BigInt(0)
    let txCount = 0

    // Process each log to get gas info
    for (const log of logs) {
      if (log.transactionHash) {
        try {
          const tx = await client.getTransaction({ hash: log.transactionHash })
          const gasPrice = tx.gasPrice ?? BigInt(0)
          totalGas += tx.gas * gasPrice
          txCount++
        } catch {
          // Skip failed transactions
        }
      }
    }

    const result = { totalGas, txCount }
    setCache(cacheKey, result)
    return result
  } catch {
    return { totalGas: BigInt(0), txCount: 0 }
  }
}

// Fetch wallet portfolio summary
export interface WalletPortfolio {
  address: Address
  mntBalance: bigint
  erc20Tokens: ERC20Token[]
  transactionCount: number
  totalGasSpent: bigint
  totalValueUsd: number
}

export async function getWalletPortfolio(
  address: Address,
  chainId: number = mantleMainnet.id
): Promise<WalletPortfolio> {
  const [mntBalance, erc20Balances, txCount, gasSpent] = await Promise.all([
    getMNTBalance(address, chainId),
    getERC20Balances(address, COMMON_TOKENS, chainId),
    getTransactionCount(address, chainId),
    getGasSpentHistory(address, chainId),
  ])

  // Estimate total value (simplified - would need price feeds in production)
  const mntValueUsd = Number(mntBalance) / 1e18 * 0.5 // Approximate MNT price
  const erc20ValueUsd = erc20Balances.reduce((sum, token) => {
    return sum + (Number(token.balance) / Math.pow(10, token.decimals)) * 0.01
  }, 0)

  return {
    address,
    mntBalance,
    erc20Tokens: erc20Balances,
    transactionCount: txCount,
    totalGasSpent: gasSpent.totalGas,
    totalValueUsd: mntValueUsd + erc20ValueUsd,
  }
}

// Fetch DeFi interactions (simplified - would need subgraph in production)
export interface DeFiInteraction {
  protocol: string
  type: 'swap' | 'lend' | 'borrow' | 'stake'
  amount: bigint
  token: string
  timestamp: number
}

export async function getDeFiInteractions(
  address: Address,
  chainId: number = mantleMainnet.id
): Promise<DeFiInteraction[]> {
  // Placeholder - in production would query The Graph or other indexing service
  const cacheKey = `${address.toLowerCase()}-defi-${chainId}`
  const cached = getCached<DeFiInteraction[]>(cacheKey)
  if (cached !== null) return cached

  // Return empty array for now - would integrate with DeFi protocols
  const interactions: DeFiInteraction[] = []
  setCache(cacheKey, interactions)
  return interactions
}

// Block info
export async function getLatestBlockNumber(chainId: number = mantleMainnet.id): Promise<bigint> {
  const client = getPublicClient(chainId)
  return client.getBlockNumber()
}

// Chain stats
export interface ChainStats {
  latestBlock: bigint
  gasPrice: bigint
  avgBlockTime: number
}

export async function getChainStats(chainId: number = mantleMainnet.id): Promise<ChainStats> {
  const client = getPublicClient(chainId)
  const [latestBlock, gasPrice] = await Promise.all([
    client.getBlockNumber(),
    client.getGasPrice(),
  ])

  return {
    latestBlock,
    gasPrice,
    avgBlockTime: 2, // Mantle target is 2 second blocks
  }
}
