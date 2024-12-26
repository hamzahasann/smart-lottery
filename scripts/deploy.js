const { ethers } = require("hardhat");

async function main() {
  const Lottery = await ethers.getContractFactory("Lottery");
  
  // Deploy
  const lottery = await Lottery.deploy();

  // Wait for the contract to be fully deployed
  await lottery.waitForDeployment();

  // In Ethers v6, the contract address is at `lottery.target`
  console.log("Lottery deployed to:", await lottery.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
