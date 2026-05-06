# Setup Guide for Decentralized Voting System (Sepolia)

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MetaMask or any Ethereum wallet with Sepolia testnet enabled
- Sepolia ETH (get from [faucet](https://www.infura.io/faucet/sepolia))

## Step 1: Smart Contract Setup

### 1.1 Install Dependencies
```bash
cd contract
npm install --legacy-peer-deps
```

### 1.2 Create .env file
```bash
# contract/.env
DEPLOY_NETWORK=sepolia
DEPLOY_RPC_URL=https://rpc.ankr.com/eth_sepolia
PRIVATE_KEY=your_wallet_private_key_here
```

**⚠️ IMPORTANT:** Never commit `.env` to git. It's already in .gitignore.

### 1.3 Compile Smart Contract
```bash
npx hardhat compile
```

### 1.4 Deploy to Sepolia
```bash
npm run deploy
```

This will use thirdweb CLI to deploy. Follow the prompts and copy the deployed contract address.

## Step 2: Frontend Setup

### 2.1 Install Dependencies
```bash
cd application
npm install
# or
yarn install
```

### 2.2 Create .env.local file
```bash
# application/.env.local
NEXT_PUBLIC_APP_NETWORK=sepolia
NEXT_PUBLIC_CONTRACT_KEY=YOUR_CONTRACT_ADDRESS_HERE
NEXT_PUBLIC_OWNER_ADDRESS=YOUR_WALLET_ADDRESS_HERE

NEXT_PUBLIC_EMAIL_JS_SERVICE_ID=YOUR_SERVICE_ID_HERE
NEXT_PUBLIC_EMAIL_JS_TEMPLATE_ID=YOUR_TEMPLATE_ID_HERE
NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY=YOUR_PUBLIC_KEY_HERE
```

#### Get EmailJS Credentials:
1. Go to [emailjs.com](https://www.emailjs.com/)
2. Sign up or log in
3. Create a new service (Gmail recommended)
4. Create an email template with variables: `to_email`, `to_name`, `from_name`, `message`
5. Copy Service ID, Template ID, and Public Key to `.env.local`

### 2.3 Run Frontend Development Server
```bash
npm run dev
# or
yarn dev
```

Visit http://localhost:3000 in your browser.

### 2.4 Build for Production
```bash
npm run build
npm run start
```

## Step 3: Using the Application

### Admin (Owner) Functions:
1. **New Election** - Initialize a new election with name, start time, and end time
2. **Register Candidates** - Add candidates with symbol image
3. **Register Voters** - Add voters and send them hash via email

### Voter Functions:
1. **Login** - Connect wallet with MetaMask
2. **Cast Vote** - Use the voter hash from email to verify and cast vote
3. **View Results** - See live results during voting (detailed results after election ends)

## Troubleshooting

### Error: Contract address not found
- Make sure you deployed the contract to Sepolia
- Copy the correct contract address to `NEXT_PUBLIC_CONTRACT_KEY`

### Error: Unauthorized access
- Make sure your wallet address in MetaMask is the owner (matches `NEXT_PUBLIC_OWNER_ADDRESS`)
- Owner functions can only be called by the contract owner

### Error: Email not sending
- Verify EmailJS credentials in `.env.local`
- Make sure your email template has the correct variable names
- Check EmailJS service is activated

### Frontend build fails
- Run `rm -rf .next` to clear Next.js cache
- Run `npm install` again
- Check Node.js version compatibility

### Contract compilation fails
- Run `npm install --legacy-peer-deps` in contract folder
- Make sure Node.js version is v14+

## Environment Variables Reference

### application/.env.local
| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_APP_NETWORK` | Network to use | `sepolia` |
| `NEXT_PUBLIC_CONTRACT_KEY` | Deployed contract address | `0x123...` |
| `NEXT_PUBLIC_OWNER_ADDRESS` | Admin wallet address | `0xABC...` |
| `NEXT_PUBLIC_EMAIL_JS_SERVICE_ID` | EmailJS service | `service_123...` |
| `NEXT_PUBLIC_EMAIL_JS_TEMPLATE_ID` | EmailJS template | `template_123...` |
| `NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY` | EmailJS public key | `abc123...` |

### contract/.env
| Variable | Purpose | Example |
|----------|---------|---------|
| `DEPLOY_NETWORK` | Network to deploy to | `sepolia` |
| `DEPLOY_RPC_URL` | RPC endpoint | `https://rpc.ankr.com/eth_sepolia` |
| `PRIVATE_KEY` | Wallet private key (⚠️ keep secret) | `abc123...` |

## Security Notes
- **NEVER** share your private key
- **NEVER** commit `.env` files to git
- Use separate wallet for development/testing
- Request fresh Sepolia ETH from faucet if needed
- Test thoroughly before deploying to mainnet

## Development Workflow

1. Make changes to frontend or contract
2. Frontend: Changes reload automatically with `npm run dev`
3. Smart Contract: Recompile with `npx hardhat compile` and redeploy
4. Check browser console for errors
5. Use MetaMask network switcher to test on Sepolia testnet

## Additional Resources
- [Sepolia Testnet Faucets](https://www.infura.io/faucet/sepolia)
- [MetaMask Setup](https://support.metamask.io/)
- [Thirdweb Documentation](https://docs.thirdweb.com/)
- [Hardhat Documentation](https://hardhat.org/)
- [Next.js Documentation](https://nextjs.org/)

## Deployment Checklist
- [ ] Contract deployed to Sepolia
- [ ] Contract address copied to `.env.local`
- [ ] Owner address set in `.env.local`
- [ ] EmailJS configured and credentials added
- [ ] Frontend builds without errors
- [ ] Test wallet connection on Sepolia
- [ ] Test voter registration and email sending
- [ ] Test candidate registration
- [ ] Test voting process
