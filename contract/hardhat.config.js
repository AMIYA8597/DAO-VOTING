/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
const fs = require("fs");
const path = require("path");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    let value = trimmedLine.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.join(__dirname, ".env"));
loadEnvFile(path.join(__dirname, ".env.local"));

const deployNetwork = process.env.DEPLOY_NETWORK || "sepolia";
const deployRpcUrl = process.env.DEPLOY_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";
const deployPrivateKey = process.env.PRIVATE_KEY || "";
const normalizedPrivateKey =
  deployPrivateKey && deployPrivateKey.startsWith("0x")
    ? deployPrivateKey
    : deployPrivateKey
      ? `0x${deployPrivateKey}`
      : "";

module.exports = {
  defaultNetwork: "hardhat",
  solidity: {
    version: '0.8.9',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
    [deployNetwork]: {
      url: deployRpcUrl,
      accounts: normalizedPrivateKey ? [normalizedPrivateKey] : []
    }
  },
};
