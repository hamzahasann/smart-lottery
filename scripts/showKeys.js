// scripts/showKeys.js
const { ethers } = require("ethers");
const config = require("../hardhat.config.js");

async function main() {
  // The mnemonic you set in hardhat.config.js
  const mnemonic = config.networks.hardhat.accounts.mnemonic;
  
  // Hardhat defaults to 20 accounts if you haven't changed 'count'
  // Adjust this if you have a custom `count` in your config
  const count = config.networks.hardhat.accounts.count || 20;

  console.log(`Using mnemonic: ${mnemonic}\n`);

  for (let i = 0; i < count; i++) {
    // Ethers v6: use fromPhrase(...) instead of fromMnemonic(...)
    const wallet = ethers.Wallet.fromPhrase(
      mnemonic,
      `m/44'/60'/0'/0/${i}`  // derivation path
    );

    console.log(`Account #${i}`);
    console.log(`  Address:     ${wallet.address}`);
    console.log(`  Private Key: ${wallet.privateKey}\n`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
