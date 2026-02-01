// Stellar Price API Utility
// Fetches XLM price from CoinGecko API with caching

const COINGECKO_API =
  "https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=usd";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

let priceCache = {
  price: null,
  timestamp: null,
};

export async function getXLMPrice() {
  // Check cache first
  if (priceCache.price && priceCache.timestamp) {
    const now = Date.now();
    if (now - priceCache.timestamp < CACHE_DURATION) {
      return priceCache.price;
    }
  }

  try {
    const response = await fetch(COINGECKO_API);
    if (!response.ok) {
      throw new Error("Failed to fetch XLM price");
    }

    const data = await response.json();
    const price = data.stellar?.usd;

    if (!price) {
      throw new Error("Invalid price data");
    }

    // Update cache
    priceCache = {
      price: price,
      timestamp: Date.now(),
    };

    return price;
  } catch (error) {
    console.error("Error fetching XLM price:", error);

    // Return cached price if available, otherwise fallback
    if (priceCache.price) {
      return priceCache.price;
    }

    // Fallback price (approximate)
    return 0.12;
  }
}

export function convertUSDtoXLM(usdAmount, xlmPrice) {
  if (!usdAmount || !xlmPrice) return 0;
  return usdAmount / xlmPrice;
}

export function convertXLMtoUSD(xlmAmount, xlmPrice) {
  if (!xlmAmount || !xlmPrice) return 0;
  return xlmAmount * xlmPrice;
}

export function validateXLMAmount(amount) {
  const MIN_XLM = 0.01;
  const MAX_XLM = 10000;

  if (!amount || isNaN(amount)) {
    return { valid: false, error: "Please enter a valid amount" };
  }

  const numAmount = parseFloat(amount);

  if (numAmount < MIN_XLM) {
    return { valid: false, error: `Minimum amount is ${MIN_XLM} XLM` };
  }

  if (numAmount > MAX_XLM) {
    return { valid: false, error: `Maximum amount is ${MAX_XLM} XLM` };
  }

  return { valid: true, error: null };
}

export function clearPriceCache() {
  priceCache = {
    price: null,
    timestamp: null,
  };
}
