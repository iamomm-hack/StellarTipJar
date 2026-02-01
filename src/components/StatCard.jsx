import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, ArrowRightIcon } from './Icons';
import '../styles/StatCard.css';

function StatCard({ icon, title, value, subtitle, trend, trendLabel, color = 'default' }) {
  const getTrendColor = () => {
    if (!trend) return '';
    return trend > 0 ? 'trend-up' : trend < 0 ? 'trend-down' : 'trend-neutral';
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend > 0) return <ArrowUpIcon size={12} />;
    if (trend < 0) return <ArrowDownIcon size={12} />;
    return <ArrowRightIcon size={12} />;
  };

  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-card-header">
        <div className={`stat-icon-wrapper stat-icon-${color}`}>
          {icon}
        </div>
        <h3 className="stat-title">{title}</h3>
      </div>
      
      <div className="stat-value">{value}</div>
      
      {subtitle && <p className="stat-subtitle">{subtitle}</p>}
      
      {trend !== undefined && (
        <div className={`stat-trend ${getTrendColor()}`}>
          <span className="trend-icon">{getTrendIcon()}</span>
          <span className="trend-value">{Math.abs(trend)}%</span>
          {trendLabel && <span className="trend-label">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
}

export default StatCard;
