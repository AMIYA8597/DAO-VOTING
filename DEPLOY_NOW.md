# 🚀 DEPLOYMENT GUIDE - SEPOLIA TESTNET

**Status**: ✅ All Code Ready - Follow Steps Below

---

## ⚡ QUICK DEPLOYMENT (15 minutes)

### Step 1: Create Environment Files

#### Contract Environment (.env)
```bash
cd contract
# Create .env file with:
DEPLOY_NETWORK=sepolia
DEPLOY_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
PRIVATE_KEY=0x... (your wallet private key - NEVER share!)
```

⚠️ **SECURITY**: Never commit .env to git. Already in .gitignore.

#### Frontend Environment (.env.local)
```bash
cd application
# Create .env.local file with:
NEXT_PUBLIC_APP_NETWORK=sepolia
NEXT_PUBLIC_CONTRACT_KEY=0x... (from deployment - see Step 2)
NEXT_PUBLIC_OWNER_ADDRESS=0x... (your wallet address)

NEXT_PUBLIC_EMAIL_JS_SERVICE_ID=... (from EmailJS)
NEXT_PUBLIC_EMAIL_JS_TEMPLATE_ID=... (from EmailJS)
NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY=... (from EmailJS)
```

---

### Step 2: Get Sepolia ETH (Test Funds)

Go to one of these faucets and get free test ETH:
- **Infura Faucet**: https://www.infura.io/faucet/sepolia
- **Alchemy Faucet**: https://sepoliafaucet.com
- **Thirdweb Faucet**: https://thirdweb.com/sepolia

**You need**: At least 0.05 ETH for deployment

---

### Step 3: Deploy Smart Contract

```bash
cd contract
npm install --legacy-peer-deps
npm run deploy
```

**What happens**:
1. Hardhat deploy script runs using your wallet key
2. Connects to Sepolia through the RPC URL
3. Contract deploys to Sepolia
4. **Copy the contract address** (you'll need it!)

**Example output**:
```
✅ Deployed to: 0x1234567890abcdef1234567890abcdef12345678
```

---

### Step 4: Setup Frontend

```bash
cd application
npm install

# Edit .env.local
# Add the contract address from Step 3
NEXT_PUBLIC_CONTRACT_KEY=0x... (from deployment above)
NEXT_PUBLIC_OWNER_ADDRESS=0x... (your wallet)
NEXT_PUBLIC_EMAIL_JS_* = ... (get from EmailJS)
```

---

### Step 5: Run Application

```bash
cd application
npm run dev
```

**Visit**: http://localhost:3000

---

## 📧 Setup EmailJS (For Voter Emails)

### Create Account
1. Go to https://www.emailjs.com
2. Sign up (free tier OK)
3. Verify email

### Create Email Service
1. Go to "Email Services"
2. Click "Add Service"
3. Choose "Gmail"
4. Connect your Gmail account
5. Copy **Service ID**

### Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Add template with these variables:
   ```
   To Email: {{to_email}}
   To Name: {{to_name}}
   From Name: {{from_name}}
   Message: {{message}}
   ```
4. Copy **Template ID**

### Get Public Key
1. Go to Account Settings
2. Find **Public Key** (API Keys section)
3. Copy it

### Update .env.local
```
NEXT_PUBLIC_EMAIL_JS_SERVICE_ID=service_xxxx
NEXT_PUBLIC_EMAIL_JS_TEMPLATE_ID=template_xxxx
NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY=xxxxxxxxxxxx
```

---

## 🧪 Test the System

### 1. Connect Wallet
- Open http://localhost:3000
- Click "Connect Wallet"
- Select MetaMask
- Make sure you're on **Sepolia** testnet
- Should show your connected address

### 2. Create Election
- Go to "New Election"
- Fill in:
  - Election Name: "Test Election"
  - Start Time: (tomorrow)
  - End Time: (in 7 days)
- Click "Submit"
- Should show success

### 3. Register Candidates
- Go to "Candidate Registration"
- Add candidates with names and symbols
- Upload symbol images
- Should see success messages

### 4. Register Voters
- Go to "Register Voters"
- Add voter details
- Should receive email with voter hash
- Check your email inbox

### 5. Cast Vote
- Go to "Votes"
- Select election and candidate
- Use voter hash from email
- Click "Vote"
- Should show confirmation

### 6. View Results
- After election ends
- Go to "Dashboard"
- See final vote counts

---

## 🔍 Verification Checklist

Before going live:

- [ ] Smart contract deployed to Sepolia
- [ ] Contract address added to .env.local
- [ ] Owner address matches your wallet
- [ ] EmailJS credentials configured
- [ ] Frontend builds without errors (`npm run build`)
- [ ] Development server runs (`npm run dev`)
- [ ] Wallet connects successfully
- [ ] Can create election
- [ ] Can register candidates
- [ ] Can register voters (emails sent)
- [ ] Can cast vote
- [ ] Results display correctly

---

## 🛠️ Troubleshooting

### Contract Deployment Fails
```
Error: Insufficient funds
→ Go to faucet and get more Sepolia ETH

Error: Network error
→ Check RPC URL in .env
→ Check internet connection

Error: Wallet not connected
→ Open MetaMask
→ Switch to Sepolia testnet
→ Click "Connect" again
```

### Frontend Won't Start
```
Error: Missing env variables
→ Create .env.local (don't skip this!)
→ Add all required variables
→ Restart dev server

Error: Cannot find module
→ Run: npm install
→ Delete node_modules and reinstall
```

### Emails Not Sending
```
Emails not received
→ Check EmailJS credentials in .env.local
→ Verify email template variables match
→ Check spam folder
→ Test EmailJS directly

Error: Invalid service ID
→ Copy Service ID from EmailJS again
→ Make sure it starts with "service_"
```

### Votes Not Showing
```
Votes = 0 for all candidates
→ Make sure election has started (check times)
→ Verify voter hash from email
→ Check you're voting before end time

Can't vote twice?
→ That's correct! (Feature: prevents double voting)
```

---

## 📊 Network Details

```
Network Name: Sepolia Testnet
Chain ID: 11155111
Currency: SepoliaETH
RPC URL: https://rpc.ankr.com/eth_sepolia
Block Explorer: https://sepolia.etherscan.io
Status: Test Network (Not Real Money)
```

---

## 🔐 Security Reminders

✅ **DO**:
- Use a test wallet for Sepolia
- Keep .env files local (never commit)
- Back up your private key securely
- Test thoroughly before mainnet
- Use strong wallet passwords

❌ **DON'T**:
- Share your private key
- Commit .env files to git
- Use mainnet private key for testing
- Send real ETH to test contracts
- Reuse simple passwords

---

## 📈 What Happens After Deployment

### Real-time Features
- ✅ Elections display in real-time
- ✅ Candidates appear immediately
- ✅ Votes counted live
- ✅ Results update instantly

### After Election Ends
- ✅ Voting closes automatically
- ✅ Final results locked
- ✅ Results become immutable (blockchain)
- ✅ Permanent voting record

---

## 🎯 Success Indicators

You'll know it's working when:

✅ Contract deploys without errors  
✅ Frontend builds successfully  
✅ MetaMask connects to Sepolia  
✅ Can create election in UI  
✅ Candidates register with images  
✅ Voters receive email hashes  
✅ Can vote with hash verification  
✅ Vote counts display correctly  
✅ Results show after election ends  

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| Start dev server | `cd application && npm run dev` |
| Build for prod | `cd application && npm run build` |
| Deploy contract | `cd contract && npm run deploy` |
| Compile contract | `cd contract && npx hardhat compile` |
| Check errors | `npm run build` (in application/) |

---

## 🎉 You're Ready!

All code is fixed, tested, and ready to deploy. Follow these steps and you'll be voting on the blockchain in 15 minutes!

**Next Action**: Create .env files and deploy contract ↗️

---

**Questions?** See COMPLETE_FIX_REPORT.md or CONFIG_CHECKLIST.md
