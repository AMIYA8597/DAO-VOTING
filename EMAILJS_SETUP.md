# EmailJS Setup Guide

This is required for sending voter verification hashes via email.

## Step 1: Create EmailJS Account
1. Go to: https://www.emailjs.com
2. Sign up (free account available)
3. Verify your email

## Step 2: Get EmailJS Credentials

### Get Service ID
1. Login to EmailJS dashboard
2. Go to **Email Services** (left sidebar)
3. Click **Add New Service**
4. Select **Gmail** (or your email provider)
5. Connect your email account
6. Click **Save**
7. Copy the **Service ID** (looks like: `service_xxxxxxxxxxxxxx`)

### Get Template ID
1. Go to **Email Templates** (left sidebar)
2. Click **Create New Template**
3. Give it a name: `Voter_Verification`
4. Set **To Email**: `{{to_email}}`
5. Set **From Name**: `{{from_name}}`
6. Set **To Name**: `{{to_name}}`
7. Set **Subject**: `Your Voting Hash`
8. Set **Body**:
```
Dear {{to_name}},

Your voting verification hash is:

{{message}}

Please keep this hash safe. You will need it to cast your vote.

Best regards,
Decentralized Voting System
```
9. Click **Save**
10. Copy the **Template ID** (looks like: `template_xxxxxxxxxxxxxx`)

### Get Public Key
1. Go to **Account** (top right)
2. Click **API Keys**
3. Copy the **Public Key** (looks like: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

## Step 3: Add Credentials to Frontend

Edit `application/.env.local`:

```bash
NEXT_PUBLIC_APP_NETWORK=sepolia
NEXT_PUBLIC_CONTRACT_KEY=0x0D5DD9A45057301F7B4F23a43Ac592aeE6a808f2
NEXT_PUBLIC_OWNER_ADDRESS=0x48e170c35e494484C74376a7fEAa5842bf735F58

# EmailJS Credentials (from steps above)
NEXT_PUBLIC_EMAIL_JS_SERVICE_ID=service_xxxxxxxxxxxxxx
NEXT_PUBLIC_EMAIL_JS_TEMPLATE_ID=template_xxxxxxxxxxxxxx
NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Testing Email Sending

1. Register a voter in the application
2. Check if email is received with the hash
3. Use the hash to vote

That's it! ✅
