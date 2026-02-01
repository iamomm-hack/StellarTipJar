// PDF Report Generation Utility

/**
 * Generate a printable HTML report and trigger print/save as PDF
 */
export const generatePDFReport = (transactions, stats) => {
  const reportDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalAmount = transactions.reduce(
    (sum, tx) => sum + parseFloat(tx.amount),
    0,
  );
  const avgTip =
    transactions.length > 0 ? totalAmount / transactions.length : 0;

  // Create report HTML
  const reportHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Stellar Tip Jar Report - ${reportDate}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 40px;
          color: #333;
          line-height: 1.6;
        }
        .header { 
          text-align: center; 
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #d4a76a;
        }
        .header h1 { 
          color: #d4a76a; 
          font-size: 28px;
          margin-bottom: 5px;
        }
        .header p { color: #666; }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }
        .stat-box {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
        }
        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #d4a76a;
        }
        .stat-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .section-title {
          font-size: 18px;
          margin-bottom: 15px;
          color: #333;
          border-left: 4px solid #d4a76a;
          padding-left: 12px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        th {
          background: #f5f5f5;
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          color: #666;
        }
        .amount { color: #10b981; font-weight: 600; }
        .hash { font-family: monospace; font-size: 12px; color: #666; }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-size: 12px;
          color: #999;
        }
        @media print {
          body { padding: 20px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>⭐ Stellar Tip Jar Report</h1>
        <p>Generated on ${reportDate}</p>
      </div>

      <div class="stats-grid">
        <div class="stat-box">
          <div class="stat-value">${totalAmount.toFixed(2)} XLM</div>
          <div class="stat-label">Total Tips</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">${transactions.length}</div>
          <div class="stat-label">Transactions</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">${avgTip.toFixed(2)} XLM</div>
          <div class="stat-label">Average Tip</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">${stats?.supporters || 0}</div>
          <div class="stat-label">Supporters</div>
        </div>
      </div>

      <h2 class="section-title">Transaction History</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>From</th>
            <th>Transaction Hash</th>
          </tr>
        </thead>
        <tbody>
          ${transactions
            .slice(0, 50)
            .map(
              (tx) => `
            <tr>
              <td>${new Date(tx.timestamp).toLocaleDateString()}</td>
              <td class="amount">${parseFloat(tx.amount).toFixed(2)} XLM</td>
              <td>${tx.from ? tx.from.slice(0, 8) + "..." : "Anonymous"}</td>
              <td class="hash">${tx.hash ? tx.hash.slice(0, 12) + "..." : "N/A"}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

      <div class="footer">
        <p>Stellar Tip Jar • Built on Stellar Network</p>
        <p>Report contains up to 50 most recent transactions</p>
      </div>
    </body>
    </html>
  `;

  // Open in new window and trigger print
  const printWindow = window.open("", "_blank");
  printWindow.document.write(reportHTML);
  printWindow.document.close();

  // Wait for content to load then print
  printWindow.onload = () => {
    printWindow.print();
  };
};

export default generatePDFReport;
