import React from 'react';
import './FilterBar.css';

function FilterBar({ 
  onFilterChange, 
  onSearch, 
  onExport,
  filters 
}) {
  return (
    <div className="filter-bar">
      {/* Search */}
      <div className="filter-group">
        <input
          type="text"
          className="filter-input search-input"
          placeholder="Search by hash or address..."
          value={filters.search || ''}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* Date Range */}
      <div className="filter-group date-filter">
        <label className="filter-label">Date Range</label>
        <div className="date-inputs">
          <input
            type="date"
            className="filter-input date-input"
            value={filters.startDate || ''}
            onChange={(e) => onFilterChange('startDate', e.target.value)}
          />
          <span className="date-separator">to</span>
          <input
            type="date"
            className="filter-input date-input"
            value={filters.endDate || ''}
            onChange={(e) => onFilterChange('endDate', e.target.value)}
          />
        </div>
      </div>

      {/* Amount Range */}
      <div className="filter-group amount-filter">
        <label className="filter-label">Amount (XLM)</label>
        <div className="amount-inputs">
          <input
            type="number"
            className="filter-input amount-input"
            placeholder="Min"
            value={filters.minAmount || ''}
            onChange={(e) => onFilterChange('minAmount', e.target.value)}
            min="0"
            step="0.01"
          />
          <span className="amount-separator">-</span>
          <input
            type="number"
            className="filter-input amount-input"
            placeholder="Max"
            value={filters.maxAmount || ''}
            onChange={(e) => onFilterChange('maxAmount', e.target.value)}
            min="0"
            step="0.01"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="filter-actions">
        <button 
          className="btn-export"
          onClick={onExport}
          title="Export to CSV"
        >
          📥 Export CSV
        </button>
      </div>
    </div>
  );
}

export default FilterBar;
