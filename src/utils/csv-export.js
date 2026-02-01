// CSV Export Utility for Transaction History

export function exportToCSV(transactions, filename = "stellar-tips.csv") {
  if (!transactions || transactions.length === 0) {
    throw new Error("No transactions to export");
  }

  // Define CSV headers
  const headers = [
    "Date",
    "Amount (XLM)",
    "From Address",
    "Transaction Hash",
    "Status",
    "Message",
  ];

  // Convert transactions to CSV rows
  const rows = transactions.map((tx) => [
    new Date(tx.timestamp).toLocaleString(),
    tx.amount,
    tx.from,
    tx.hash,
    tx.status || "completed",
    tx.message || "",
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export function filterTransactionsByDate(transactions, startDate, endDate) {
  if (!startDate && !endDate) return transactions;

  return transactions.filter((tx) => {
    const txDate = new Date(tx.timestamp);

    if (startDate && endDate) {
      return txDate >= new Date(startDate) && txDate <= new Date(endDate);
    } else if (startDate) {
      return txDate >= new Date(startDate);
    } else if (endDate) {
      return txDate <= new Date(endDate);
    }

    return true;
  });
}

export function filterTransactionsByAmount(transactions, minAmount, maxAmount) {
  if (!minAmount && !maxAmount) return transactions;

  return transactions.filter((tx) => {
    const amount = parseFloat(tx.amount);

    if (minAmount && maxAmount) {
      return amount >= parseFloat(minAmount) && amount <= parseFloat(maxAmount);
    } else if (minAmount) {
      return amount >= parseFloat(minAmount);
    } else if (maxAmount) {
      return amount <= parseFloat(maxAmount);
    }

    return true;
  });
}

export function searchTransactions(transactions, query) {
  if (!query || query.trim() === "") return transactions;

  const lowerQuery = query.toLowerCase();

  return transactions.filter((tx) => {
    return (
      tx.hash.toLowerCase().includes(lowerQuery) ||
      tx.from.toLowerCase().includes(lowerQuery) ||
      (tx.message && tx.message.toLowerCase().includes(lowerQuery))
    );
  });
}

export function paginateTransactions(transactions, page = 1, perPage = 10) {
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  return {
    data: transactions.slice(startIndex, endIndex),
    totalPages: Math.ceil(transactions.length / perPage),
    currentPage: page,
    totalItems: transactions.length,
    hasNext: endIndex < transactions.length,
    hasPrev: page > 1,
  };
}
