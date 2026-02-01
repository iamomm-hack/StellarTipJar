# Stellar Tip Jar ☕

A handcrafted, minimal Stellar testnet donation page that allows users to connect their Freighter wallet and send XLM tips.

## Features

- 🔐 **Freighter Wallet Integration** - Connect and disconnect seamlessly
- 💰 **Real-time Balance** - View your XLM balance from Horizon testnet
- ⚡ **Quick Tips** - Predefined 1 XLM and 5 XLM tip buttons
- ✏️ **Custom Amounts** - Send any amount you choose
- 📝 **Transaction Tracking** - View transaction hash and explorer link
- 🎨 **Handcrafted Design** - Minimal, typography-driven layout (no dashboard templates!)

## Prerequisites

Before you begin, make sure you have:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **Freighter Wallet** - [Install browser extension](https://www.freighter.app/)
3. **Testnet XLM** - Fund your account at [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test)

## Installation

1. **Navigate to the project directory:**
   ```bash
   cd stellar-tip-jar
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Update Creator Address** (Important!)
   
   Open `src/App.jsx` and replace the placeholder address:
   ```javascript
   const CREATOR_ADDRESS = 'YOUR_TESTNET_ADDRESS_HERE';
   const CREATOR_NAME = 'Your Name';
   ```

## Running Locally

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   Navigate to `http://localhost:5173`

3. **Connect Freighter:**
   - Make sure Freighter is set to **Testnet** mode
   - Click "Connect Freighter Wallet"
   - Approve the connection

4. **Fund Your Testnet Account:**
   If you see "0 XLM", visit the [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test) to get free testnet XLM.

## Building for Production

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Preview the production build:**
   ```bash
   npm run preview
   ```

The build output will be in the `dist/` directory.

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

### Deploy to Netlify

1. Install Netlify CLI:
   ```bash
   npm i -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```

Or simply drag and drop the `dist/` folder to [Netlify Drop](https://app.netlify.com/drop).

### Deploy to GitHub Pages

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. Update `vite.config.js`:
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/stellar-tip-jar/', // Your repo name
   })
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

## Project Structure

```
stellar-tip-jar/
├── public/
│   └── stellar-icon.svg       # Favicon
├── src/
│   ├── utils/
│   │   ├── wallet.js          # Freighter wallet integration
│   │   └── stellar.js         # Stellar SDK & transactions
│   ├── App.jsx                # Main component
│   ├── App.css                # Handcrafted minimal styles
│   └── main.jsx               # React entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## How It Works

### Wallet Connection
- Uses Freighter browser extension API
- Requests public key from user's wallet
- Fetches account balance from Horizon testnet

### Sending Tips
1. User selects predefined amount or enters custom amount
2. App builds a Stellar payment transaction
3. Transaction is signed by Freighter wallet
4. Signed transaction is submitted to Horizon testnet
5. Transaction hash is displayed with explorer link

### Stellar Network
- **Network:** Testnet
- **Horizon URL:** `https://horizon-testnet.stellar.org`
- **Explorer:** `https://stellar.expert/explorer/testnet`

## Troubleshooting

### "Freighter wallet is not installed"
- Install the Freighter browser extension
- Refresh the page after installation

### "Your account needs to be funded"
- Visit [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test)
- Enter your public key and click "Get test network lumens"

### "Failed to connect wallet"
- Make sure Freighter is set to **Testnet** mode
- Check that you approved the connection request

### Transaction Failed
- Ensure you have enough XLM balance (account minimum is 1 XLM)
- Verify the creator address is correct
- Check that both accounts are funded on testnet

## Stellar White Belt Requirements

This project satisfies the **Stellar White Belt Level 1** requirements:

- ✅ Connect Freighter wallet
- ✅ Display wallet public key
- ✅ Fetch and display XLM balance
- ✅ Build payment transactions
- ✅ Sign transactions with Freighter
- ✅ Submit transactions to Horizon
- ✅ Display transaction results
- ✅ Handle errors gracefully

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool
- **Stellar SDK** - Blockchain interactions
- **Freighter API** - Wallet connection
- **Vanilla CSS** - Handcrafted styles (no frameworks!)

## Design Philosophy

This project intentionally avoids:
- ❌ Dashboard templates
- ❌ Card/tile layouts
- ❌ Grid systems
- ❌ Dark gradients
- ❌ Neon effects
- ❌ Generic AI aesthetics

Instead, it embraces:
- ✅ Single-column layout
- ✅ Typography-first design
- ✅ Natural spacing
- ✅ Minimal color palette
- ✅ Handcrafted feel

## License

MIT

## Support

Having issues? Check:
- [Stellar Documentation](https://developers.stellar.org/)
- [Freighter Documentation](https://docs.freighter.app/)
- [Stellar Stack Exchange](https://stellar.stackexchange.com/)

---

Built with ❤️ for the Stellar ecosystem
