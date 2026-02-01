export const calculateTipsByPeriod = (transactions, period = "7d") => {
  if (!transactions || transactions.length === 0) return [];

  const now = new Date();
  const periodDays = period === "7d" ? 7 : period === "30d" ? 30 : 365;
  const startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);

  const filtered = transactions.filter(
    (tx) => new Date(tx.timestamp) >= startDate,
  );

  const grouped = {};
  filtered.forEach((tx) => {
    const date = new Date(tx.timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    grouped[date] = (grouped[date] || 0) + parseFloat(tx.amount);
  });

  return Object.entries(grouped).map(([date, amount]) => ({
    date,
    amount: parseFloat(amount.toFixed(2)),
  }));
};

export const getTopSupporters = (transactions, limit = 5) => {
  if (!transactions || transactions.length === 0) return [];

  const supporters = {};
  transactions.forEach((tx) => {
    if (tx.from) {
      supporters[tx.from] = (supporters[tx.from] || 0) + parseFloat(tx.amount);
    }
  });

  return Object.entries(supporters)
    .map(([address, total]) => ({
      address,
      total: parseFloat(total.toFixed(2)),
      count: transactions.filter((tx) => tx.from === address).length,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
};

export const calculateAverageTip = (transactions) => {
  if (!transactions || transactions.length === 0) return 0;

  const total = transactions.reduce(
    (sum, tx) => sum + parseFloat(tx.amount),
    0,
  );
  return parseFloat((total / transactions.length).toFixed(2));
};

export const getTotalTips = (transactions) => {
  if (!transactions || transactions.length === 0) return 0;

  const total = transactions.reduce(
    (sum, tx) => sum + parseFloat(tx.amount),
    0,
  );
  return parseFloat(total.toFixed(2));
};

export const getTipTrends = (transactions, period = "7d") => {
  if (!transactions || transactions.length === 0) {
    return { current: 0, previous: 0, change: 0, percentChange: 0 };
  }

  const now = new Date();
  const periodDays = period === "7d" ? 7 : period === "30d" ? 30 : 365;
  const currentStart = new Date(
    now.getTime() - periodDays * 24 * 60 * 60 * 1000,
  );
  const previousStart = new Date(
    currentStart.getTime() - periodDays * 24 * 60 * 60 * 1000,
  );

  const currentPeriod = transactions.filter((tx) => {
    const date = new Date(tx.timestamp);
    return date >= currentStart && date <= now;
  });

  const previousPeriod = transactions.filter((tx) => {
    const date = new Date(tx.timestamp);
    return date >= previousStart && date < currentStart;
  });

  const current = getTotalTips(currentPeriod);
  const previous = getTotalTips(previousPeriod);
  const change = current - previous;
  const percentChange =
    previous > 0 ? ((change / previous) * 100).toFixed(1) : 0;

  return { current, previous, change, percentChange };
};

export const getTipDistribution = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return { small: 0, medium: 0, large: 0 };
  }

  const distribution = {
    small: 0, // < 5 XLM
    medium: 0, // 5-20 XLM
    large: 0, // > 20 XLM
  };

  transactions.forEach((tx) => {
    const amount = parseFloat(tx.amount);
    if (amount < 5) distribution.small++;
    else if (amount <= 20) distribution.medium++;
    else distribution.large++;
  });

  return distribution;
};

export const getUniqueSupporters = (transactions) => {
  if (!transactions || transactions.length === 0) return 0;

  const uniqueAddresses = new Set(
    transactions.filter((tx) => tx.from).map((tx) => tx.from),
  );
  return uniqueAddresses.size;
};

export const getBestPeriod = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return { date: "N/A", amount: 0 };
  }

  const dailyTotals = {};
  transactions.forEach((tx) => {
    const date = new Date(tx.timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    dailyTotals[date] = (dailyTotals[date] || 0) + parseFloat(tx.amount);
  });

  const best = Object.entries(dailyTotals).sort((a, b) => b[1] - a[1])[0];

  return best
    ? {
        date: best[0],
        amount: parseFloat(best[1].toFixed(2)),
      }
    : { date: "N/A", amount: 0 };
};
