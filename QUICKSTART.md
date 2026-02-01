# Quick Start Guide - Stellar Tip Jar

## Get Up and Running in 5 Minutes

### Step 1: Install Dependencies
```bash
cd stellar-tip-jar
npm install
```

### Step 2: Update Your Creator Address
Open `src/App.jsx` and find these lines (around line 15):

```javascript
const CREATOR_ADDRESS = 'GABC3DEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTU';
const CREATOR_NAME = 'Alex Chen';
```

Replace with your actual Stellar testnet address and name:

```javascript
const CREATOR_ADDRESS = 'YOUR_TESTNET_PUBLIC_KEY_HERE';
const CREATOR_NAME = 'Your Name';
```

### Step 3: Start Development Server
```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Step 4: Set Up Freighter Wallet
1. Install Freighter from https://www.freighter.app/
2. Switch to **Testnet** mode in Freighter settings
3. If you don't have a testnet account, create one in Freighter

### Step 5: Fund Your Testnet Account
Visit https://laboratory.stellar.org/#account-creator?network=test

1. Select "Testnet"
2. Paste your public key
3. Click "Get test network lumens"
4. Wait a few seconds for confirmation

### Step 6: Test the App
1. Click "Connect Freighter Wallet"
2. Approve the connection
3. You should see your XLM balance
4. Try sending a 1 XLM tip to yourself!

---

## Common Issues

**"Account needs to be funded"**
→ Go to Step 5 and get testnet XLM

**"Freighter not installed"**
→ Install from freighter.app and refresh

**"Wrong network"**
→ Open Freighter → Settings → Switch to Testnet

---

## Ready to Deploy?

**Vercel (Recommended)**
```bash
npm i -g vercel
vercel
```

**Netlify**
```bash
npm run build
# Drag dist/ folder to app.netlify.com/drop
```

That's it! You now have a working Stellar donation page. 🎉
