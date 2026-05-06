## Getting Started

Create a project using this example:

```bash
npx thirdweb create --contract --template hardhat-javascript-starter
```

You can start editing the page by modifying `contracts/Contract.sol`.

To add functionality to your contracts, you can use the `@thirdweb-dev/contracts` package which provides base contracts and extensions to inherit. The package is already installed with this project. Head to our [Contracts Extensions Docs](https://portal.thirdweb.com/contractkit) to learn more.

## Building the project

After any changes to the contract, run:

```bash
npm run build
# or
yarn build
```

to compile your contracts. This will also detect the [Contracts Extensions Docs](https://portal.thirdweb.com/contractkit) detected on your contract.

## Deploying Contracts

When you're ready to deploy your contracts, just run one of the following command to deploy you're contracts:

```bash
npm run deploy
# or
yarn deploy
```

This project now uses a Hardhat deploy script that reads `PRIVATE_KEY` from `contract/.env` and deploys to the network named by `DEPLOY_NETWORK`.

## Network Setup

The deployment network is controlled from [hardhat.config.js](hardhat.config.js).

- `DEPLOY_NETWORK` selects the Hardhat network name and defaults to `sepolia`.
- `DEPLOY_RPC_URL` is the RPC endpoint for that network.
- `PRIVATE_KEY` is the account used for deployment and can be written with or without the `0x` prefix.

To switch testnets later, update the values in `contract/.env` and keep `hardhat.config.js` unchanged.

## Releasing Contracts

If you want to release a version of your contracts publicly, you can use one of the followings command:

```bash
npm run release
# or
yarn release
```

## Join our Discord!

For any questions, suggestions, join our discord at [https://discord.gg/thirdweb](https://discord.gg/thirdweb).
