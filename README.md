# Stellar Tip Jar 💫

A feature-rich, interactive Stellar tipping application designed for content creators. Built with React and Stellar SDK, seamlessly bridging the gap between creators and their supporters.

## ✨ Key Features

### 💸 Core Tipping

- **Seamless Wallet Connection**: Supports Freighter wallet integration.
- **Instant Tips**: Quick tip amounts (1, 5, 10 XLM) or custom values.
- **Real-time Price**: Updates USD/XLM conversion rates automatically.

### 🎮 Gamification & Engagement

- **🔥 Tip Streaks**: Track daily support streaks with tiered badges (Bronze, Silver, Gold, Platinum).
- **🏆 Milestones**: Unlock achievements for total tips sent (10, 25, 50, 100, 500+).
- **📊 Leaderboard**: Visualize top supporters and contribution rankings.
- **✨ Interactive Feedback**: Confetti explosions and custom sound effects on successful tips.

### 📈 Analytics & Reporting

- **In-Depth Dashboard**: Filter transaction history by 7 days, 30 days, or All Time.
- **Export Options**: Download transaction history as **CSV** or styled **PDF reports**.
- **Visual Charts**: Track tip volume trends over time using Chart.js.

### 🛠 Tools for Creators

- **📱 QR Code Generator**: Real, scannable QR codes (Powered by `qrcode.react`) with instant download and copy options.
- **🔗 Embed Widget**: Generate an iframe widget to accept tips on personal websites/blogs.
- **🧾 Shareable Receipts**: Generate receipt links or share directly to Twitter/X.

### 🎨 UI/UX

- **Dark Mode**: Fully supported dark/light themes with persistence.
- **Responsive Design**: Mobile-friendly layout optimized for all devices.
- **Standardized Icons**: Clean SVG icons for a polished, consistent look.

---

## 📸 UI Showcase

| Feature                                               | Preview                                            |
| :---------------------------------------------------- | :------------------------------------------------- |
| **Home Dashboard**<br>Instant tipping & Wallet status | ![Home UI](<img width="1919" height="878" alt="image" src="https://github.com/user-attachments/assets/11a05b31-1141-4fd3-92f4-d2b7d4c3e51b" />
)            |
| **Analytics Pivot**<br>Charts & Leaderboards          | ![Analytics](<img width="1919" height="911" alt="image" src="https://github.com/user-attachments/assets/cb63d2e7-4f47-462f-9de0-ca08a6252eeb" />
      |
      | ![Chart]<img width="1919" height="910" alt="image" src="https://github.com/user-attachments/assets/9a6b7eef-5db7-4d76-bd73-9c24db8803d6" />


      |
| **Interactive Elements**<br>QR Code & Confetti        | ![Interactive](<img width="556" height="768" alt="image" src="https://github.com/user-attachments/assets/8fc0388f-dedf-4cc9-a9f4-d908007d93af" />

) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Stellar Freighter Wallet (Optional for Demo Mode)

### Installation

1. **Clone the repository** (or download source)

   ```bash
   cd stellar-tip-jar
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Run Development Server**

   ```bash
   npm run dev
   ```

4. **Open Browser**
   Visit `http://localhost:5173`

---

## 🔧 Configuration Modes

The app supports two modes via `src/utils/wallet.js`:

### 2.Testnet Mode

For transactions on the Stellar Testnet.

- **Wallet**: Connects to your real Freighter Wallet extension.
- **Transactions**: Submits real XDR to Stellar Testnet Horizon.
- **Network Badge**: Displays "🟢 TESTNET" in the header.
- **Setup**:.
  1. Ensure your Freighter wallet is installed and set to **Testnet**.
  2. Ensure your Creator Address in `App.jsx` is active/funded on Testnet.

---

## � Project Architecture

```
stellar-tip-jar/
├── public/              # Static assets (Favicons, Screenshots)
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Analytics.jsx    # Charts & Data visualization
│   │   ├── QRCode.jsx       # Real QR generation
│   │   ├── StreakBadge.jsx  # Gamification logic
│   │   ├── Icons.jsx        # SVG Icon system
│   │   └── ...
│   ├── utils/          # Helper functions
│   │   ├── wallet.js    # Freighter integration & Mode logic
│   │   ├── stellar.js   # Stellar SDK interactions
│   │   └── storage.js   # LocalStorage persistence
│   ├── App.jsx         # Main application controller
│   ├── App.css         # Global design system & variables
│   └── main.jsx        # Entry point
└── README.md           # Documentation
```

## �📦 Tech Stack

- **Frontend**: React, Vite
- **Blockchain**: Stellar SDK
- **Styling**: Vanilla CSS (Handcrafted variables & themes)
- **Utilities**:
  - `chart.js` (Analytics)
  - `jspdf` (PDF Reporting)
  - `qrcode.react` (QR Generation)
  - `canvas-confetti` (Visual Effects)

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. Built with ❤️ for the Stellar ecosystem.
