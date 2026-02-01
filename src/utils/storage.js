// LocalStorage utility for transaction history
const STORAGE_KEY = "stellar_tip_jar_transactions";

/**
 * Save a new transaction to localStorage
 * @param {Object} txData - Transaction data
 * @param {string} txData.hash - Transaction hash
 * @param {number} txData.amount - Amount in XLM
 * @param {string} txData.recipient - Recipient address
 * @param {string} txData.sender - Sender address
 * @param {string} txData.status - Transaction status (success/pending/failed)
 */
export const saveTransaction = (txData) => {
  try {
    const transactions = getTransactions();
    const newTransaction = {
      ...txData,
      timestamp: new Date().toISOString(),
      id: Date.now() + Math.random(), // Unique ID
    };

    transactions.unshift(newTransaction); // Add to beginning (newest first)

    // Keep only last 50 transactions to avoid localStorage limits
    const limitedTransactions = transactions.slice(0, 50);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedTransactions));
    return newTransaction;
  } catch (error) {
    console.error("Error saving transaction:", error);
    return null;
  }
};

/**
 * Get all stored transactions
 * @returns {Array} Array of transaction objects
 */
export const getTransactions = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading transactions:", error);
    return [];
  }
};

/**
 * Clear all transaction history
 */
export const clearTransactions = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing transactions:", error);
    return false;
  }
};

/**
 * Get a single transaction by ID
 * @param {string|number} id - Transaction ID
 * @returns {Object|null} Transaction object or null
 */
export const getTransactionById = (id) => {
  const transactions = getTransactions();
  return transactions.find((tx) => tx.id === id) || null;
};
