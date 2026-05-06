const hre = require("hardhat");

async function main() {
  const { ethers } = hre;
  const [deployer] = await ethers.getSigners();

  console.log(`Deploying with account: ${deployer.address}`);

  const balance = await deployer.getBalance();
  console.log(`Account balance: ${ethers.utils.formatEther(balance)} ETH`);

  const ElectionContract = await ethers.getContractFactory("ElectionContract");
  const electionContract = await ElectionContract.deploy();

  await electionContract.deployed();

  console.log(`ElectionContract deployed to: ${electionContract.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });