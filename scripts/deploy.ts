import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

interface DeploymentAddresses {
  network: string;
  timestamp: string;
  contracts: {
    MantleCards?: string;
    Marketplace?: string;
    AgentIdentity?: string;
  };
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const networkName = ethers.network.name;
  const chainId = (await ethers.provider.getNetwork()).chainId;

  console.log("===========================================");
  console.log("Deploying to Mantle Network");
  console.log("===========================================");
  console.log(`Network: ${networkName}`);
  console.log(`Chain ID: ${chainId}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Balance: ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} MNT`);
  console.log("===========================================\n");

  // Deploy MantleCards
  console.log("1. Deploying MantleCards...");
  const MantleCards = await ethers.getContractFactory("MantleCards");
  const mantleCards = await MantleCards.deploy(deployer.address);
  await mantleCards.waitForDeployment();
  const mantleCardsAddress = await mantleCards.getAddress();
  console.log(`   MantleCards deployed to: ${mantleCardsAddress}`);

  // Deploy Marketplace
  console.log("2. Deploying Marketplace...");
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(deployer.address);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log(`   Marketplace deployed to: ${marketplaceAddress}`);

  // Deploy AgentIdentity
  console.log("3. Deploying AgentIdentity...");
  const AgentIdentity = await ethers.getContractFactory("AgentIdentity");
  const agentIdentity = await AgentIdentity.deploy();
  await agentIdentity.waitForDeployment();
  const agentIdentityAddress = await agentIdentity.getAddress();
  console.log(`   AgentIdentity deployed to: ${agentIdentityAddress}`);

  // Set MantleCards address in AgentIdentity
  console.log("4. Configuring AgentIdentity...");
  const setMantleCardsTx = await agentIdentity.setMantleCardsAddress(mantleCardsAddress);
  await setMantleCardsTx.wait();
  console.log(`   MantleCards address set in AgentIdentity`);

  // Save deployment addresses
  const deploymentAddresses: DeploymentAddresses = {
    network: networkName,
    timestamp: new Date().toISOString(),
    contracts: {
      MantleCards: mantleCardsAddress,
      Marketplace: marketplaceAddress,
      AgentIdentity: agentIdentityAddress
    }
  };

  const deploymentsPath = path.join(__dirname, "..", "deployments.json");
  fs.writeFileSync(deploymentsPath, JSON.stringify(deploymentAddresses, null, 2));
  console.log(`\n   Deployment addresses saved to: ${deploymentsPath}`);

  console.log("\n===========================================");
  console.log("Deployment Summary");
  console.log("===========================================");
  console.log(`MantleCards: ${mantleCardsAddress}`);
  console.log(`Marketplace: ${marketplaceAddress}`);
  console.log(`AgentIdentity: ${agentIdentityAddress}`);
  console.log("===========================================\n");

  console.log("Next steps:");
  console.log("1. Verify contracts on Mantle Explorer");
  console.log("2. Update frontend configuration with these addresses");
  console.log("3. Add the network to users' wallets");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
