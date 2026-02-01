// Streak calculation utilities

/**
 * Calculate the current tip streak from transactions
 * A streak is consecutive days where at least one tip was received
 */
export const calculateStreak = (transactions) => {
  if (!transactions || transactions.length === 0) return 0;

  // Sort transactions by date (newest first)
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
  );

  // Get unique dates (YYYY-MM-DD format)
  const uniqueDates = [
    ...new Set(
      sorted.map((tx) => new Date(tx.timestamp).toISOString().split("T")[0]),
    ),
  ].sort((a, b) => new Date(b) - new Date(a));

  if (uniqueDates.length === 0) return 0;

  // Check if streak is still active (last tip was today or yesterday)
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
    return 0; // Streak broken
  }

  // Count consecutive days
  let streak = 1;
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const current = new Date(uniqueDates[i]);
    const next = new Date(uniqueDates[i + 1]);
    const diffDays = (current - next) / 86400000;

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Get streak message based on count
 */
export const getStreakMessage = (streak) => {
  if (streak === 0) return "Start your streak today!";
  if (streak === 1) return "Day 1 - Great start!";
  if (streak < 7) return `${streak} day streak - Keep going!`;
  if (streak < 30) return `${streak} day streak - On fire!`;
  if (streak < 100) return `${streak} day streak - Legendary!`;
  return `${streak} day streak - UNBELIEVABLE!`;
};

/**
 * Get streak level for badge styling
 */
export const getStreakLevel = (streak) => {
  if (streak === 0) return "none";
  if (streak < 3) return "bronze";
  if (streak < 7) return "silver";
  if (streak < 30) return "gold";
  return "platinum";
};
