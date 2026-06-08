import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const MANTLE_SEPOLIA_RPC_URL = process.env.MANTLE_SEPOLIA_RPC_URL || "https://rpc.sepolia.mantle.xyz";
const MANTLE_MAINNET_RPC_URL = process.env.MANTLE_MAINNET_RPC_URL || "https://rpc.mantle.xyz";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";
const MANTLE_EXPLORER_API_KEY = process.env.MANTLE_EXPLORER_API_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    mantleSepolia: {
      url: MANTLE_SEPOLIA_RPC_URL,
      chainId: 5003,
      accounts: [PRIVATE_KEY],
      gasPrice: "auto"
    },
    mantle: {
      url: MANTLE_MAINNET_RPC_URL,
      chainId: 5000,
      accounts: [PRIVATE_KEY],
      gasPrice: "auto"
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    }
  },
  etherscan: {
    apiKey: {
      mantleSepolia: MANTLE_EXPLORER_API_KEY,
      mantle: MANTLE_EXPLORER_API_KEY
    },
    customChains: [
      {
        network: "mantleSepolia",
        chainId: 5003,
        urls: {
          apiURL: "https://explorer.testnet.mantle.xyz/api",
          browserURL: "https://explorer.testnet.mantle.xyz"
        }
      },
      {
        network: "mantle",
        chainId: 5000,
        urls: {
          apiURL: "https://explorer.mantle.xyz/api",
          browserURL: "https://explorer.mantle.xyz"
        }
      }
    ]
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY
  },
  paths: {
    sources: "./src/contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  typechain: {
    outDir: "./typechain",
    target: "ethers-v6"
  }
};

export default config;
