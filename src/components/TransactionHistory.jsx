import { useState, useMemo } from 'react';
import { shortenAddress } from '../utils/stellar';
import FilterBar from './FilterBar';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  TrashIcon,
  InboxIcon,
  CheckIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from './Icons';
import {
  exportToCSV,
  filterTransactionsByDate,
  filterTransactionsByAmount,
  searchTransactions,
  paginateTransactions
} from '../utils/csv-export';
import '../styles/TransactionHistory.css';

/**
 * TransactionHistory component - displays list of past transactions with filters
 */
function TransactionHistory({ transactions, onViewReceipt, onClearHistory }) {
  const [filters, setFilters] = useState({
    search: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const ITEMS_PER_PAGE = 10;

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
    setCurrentPage(1);
  };

  const handleExport = () => {
    try {
      exportToCSV(filteredTransactions, `stellar-tips-${new Date().toISOString().split('T')[0]}.csv`);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all transaction history?')) {
      onClearHistory();
    }
  };

  // Apply all filters
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    
    // Apply search
    if (filters.search) {
      result = searchTransactions(result, filters.search);
    }
    
    // Apply date filter
    if (filters.startDate || filters.endDate) {
      result = filterTransactionsByDate(result, filters.startDate, filters.endDate);
    }
    
    // Apply amount filter
    if (filters.minAmount || filters.maxAmount) {
      result = filterTransactionsByAmount(result, filters.minAmount, filters.maxAmount);
    }
    
    return result;
  }, [transactions, filters]);

  // Paginate filtered results
  const paginatedData = useMemo(() => {
    return paginateTransactions(filteredTransactions, currentPage, ITEMS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  if (transactions.length === 0) {
    return (
      <section className="section transaction-history">
        <h2 className="section-title">Transaction History</h2>
        <div className="empty-state">
          <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="empty-text">No transactions yet</p>
          <p className="empty-subtext">Your tip history will appear here</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section transaction-history">
      <div className="history-header">
        <div>
          <h2 className="section-title">Transaction History</h2>
          <p className="history-count">
            Showing {paginatedData.data.length} of {filteredTransactions.length} 
            {filteredTransactions.length !== transactions.length && ` (${transactions.length} total)`}
          </p>
        </div>
        <div className="history-header-actions">
          <button 
            className="btn-toggle-transactions"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Show Transactions" : "Hide Transactions"}
          >
            {isCollapsed ? <><ChevronDownIcon size={14} /> Show</> : <><ChevronUpIcon size={14} /> Hide</>}
          </button>
          <button className="btn-clear" onClick={handleClear}>
            <TrashIcon size={14} /> Clear History
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* Filter Bar */}
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            onExport={handleExport}
          />

          {/* No Results State */}
          {filteredTransactions.length === 0 ? (
            <div className="no-results">
              <p><InboxIcon size={18} /> No transactions match your filters</p>
              <button className="btn-reset-filters" onClick={() => setFilters({
                search: '',
                startDate: '',
                endDate: '',
                minAmount: '',
                maxAmount: ''
              })}>
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              {/* Transactions List */}
              <div className="transactions-list">
                {paginatedData.data.map((tx) => (
                  <div key={tx.id} className="transaction-item" onClick={() => onViewReceipt(tx)}>
                    <div className="transaction-info">
                      <div className="transaction-main">
                        <span className="transaction-amount">{parseFloat(tx.amount).toFixed(2)} XLM</span>
                        <span className="transaction-status-badge status-completed">
                          <CheckIcon size={12} /> success
                        </span>
                      </div>
                      <div className="transaction-details">
                        <span className="transaction-hash">
                          Hash: {shortenAddress(tx.hash)}
                        </span>
                        {tx.from && (
                          <span className="transaction-from">
                            From: {shortenAddress(tx.from)}
                          </span>
                        )}
                        <span className="transaction-date">{formatDate(tx.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {paginatedData.totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="btn-page"
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    disabled={!paginatedData.hasPrev}
                  >
                    <ArrowLeftIcon size={14} /> Previous
                  </button>
                  <span className="page-info">
                    Page {paginatedData.currentPage} of {paginatedData.totalPages}
                  </span>
                  <button
                    className="btn-page"
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={!paginatedData.hasNext}
                  >
                    Next <ArrowRightIcon size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}

export default TransactionHistory;
