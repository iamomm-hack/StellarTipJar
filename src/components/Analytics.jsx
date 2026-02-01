import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import StatCard from './StatCard';
import {
  calculateTipsByPeriod,
  getTopSupporters,
  calculateAverageTip,
  getTotalTips,
  getTipTrends,
  getTipDistribution,
  getUniqueSupporters,
  getBestPeriod
} from '../utils/analytics';
import { shortenAddress } from '../utils/stellar';
import '../styles/Analytics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

const TotalTipsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2"/>
    <path d="M12 6v12M8 10l4-4 4 4M8 14l4 4 4-4" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AverageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3v18h18" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 14l4-4 4 4 5-5" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SupportersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="7" r="4" stroke="#3b82f6" strokeWidth="2"/>
    <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="17" cy="7" r="3" stroke="#3b82f6" strokeWidth="2"/>
    <path d="M21 21v-2a3 3 0 00-3-3h-1" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const TrophyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9H4a2 2 0 01-2-2V5a2 2 0 012-2h2M18 9h2a2 2 0 002-2V5a2 2 0 00-2-2h-2" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
    <path d="M6 3h12v6a6 6 0 01-12 0V3z" stroke="#f59e0b" strokeWidth="2"/>
    <path d="M12 15v4M8 21h8" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const DashboardIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="7" height="7" rx="1" stroke="#8b5cf6" strokeWidth="2"/>
    <rect x="14" y="3" width="7" height="7" rx="1" stroke="#3b82f6" strokeWidth="2"/>
    <rect x="3" y="14" width="7" height="7" rx="1" stroke="#10b981" strokeWidth="2"/>
    <rect x="14" y="14" width="7" height="7" rx="1" stroke="#f59e0b" strokeWidth="2"/>
  </svg>
);

const TimelineIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3v18h18" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round"/>
    <path d="M7 14l3-4 4 2 6-8" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="7" r="4" stroke="#3b82f6" strokeWidth="2"/>
    <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="17" cy="7" r="3" stroke="#3b82f6" strokeWidth="2"/>
    <path d="M21 21v-2a3 3 0 00-3-3" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const PieChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.21 15.89A10 10 0 118 2.83" stroke="#10b981" strokeWidth="2"/>
    <path d="M22 12A10 10 0 0012 2v10z" stroke="#10b981" strokeWidth="2"/>
  </svg>
);

const EmptyChartIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{opacity: 0.3}}>
    <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M7 14l3-4 4 2 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function Analytics({ transactions, onExportPDF }) {
  const [period, setPeriod] = useState('7d');

  const stats = useMemo(() => {
    const total = getTotalTips(transactions);
    const average = calculateAverageTip(transactions);
    const supporters = getUniqueSupporters(transactions);
    const best = getBestPeriod(transactions);
    const trends = getTipTrends(transactions, period);

    return { total, average, supporters, best, trends };
  }, [transactions, period]);

  const timelineData = useMemo(() => {
    const data = calculateTipsByPeriod(transactions, period);
    
    return {
      labels: data.map(d => d.date),
      datasets: [
        {
          label: 'Tips Received (XLM)',
          data: data.map(d => d.amount),
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.15)',
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointBackgroundColor: '#8b5cf6',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }
      ]
    };
  }, [transactions, period]);

  const topSupportersData = useMemo(() => {
    const supporters = getTopSupporters(transactions, 5);
    
    return {
      labels: supporters.map(s => shortenAddress(s.address)),
      datasets: [
        {
          label: 'Total Tips (XLM)',
          data: supporters.map(s => s.total),
          backgroundColor: [
            'rgba(59, 130, 246, 0.85)',
            'rgba(16, 185, 129, 0.85)',
            'rgba(245, 158, 11, 0.85)',
            'rgba(239, 68, 68, 0.85)',
            'rgba(139, 92, 246, 0.85)'
          ],
          borderColor: [
            '#3b82f6',
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#8b5cf6'
          ],
          borderWidth: 2,
          borderRadius: 8
        }
      ]
    };
  }, [transactions]);

  const distributionData = useMemo(() => {
    const dist = getTipDistribution(transactions);
    
    return {
      labels: ['Small (<5 XLM)', 'Medium (5-20 XLM)', 'Large (>20 XLM)'],
      datasets: [
        {
          data: [dist.small, dist.medium, dist.large],
          backgroundColor: [
            'rgba(59, 130, 246, 0.9)',
            'rgba(16, 185, 129, 0.9)',
            'rgba(139, 92, 246, 0.9)'
          ],
          borderColor: ['#3b82f6', '#10b981', '#8b5cf6'],
          borderWidth: 3,
          hoverOffset: 10
        }
      ]
    };
  }, [transactions]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12, weight: 500 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        padding: 14,
        titleFont: { size: 14, weight: 600 },
        bodyFont: { size: 13 },
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: { font: { size: 11 } }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } }
      }
    }
  };

  const barOptions = {
    ...chartOptions,
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      },
      y: { grid: { display: false } }
    }
  };

  if (!transactions || transactions.length === 0) {
    return (
      <section className="analytics-section">
        <div className="analytics-header">
          <h2 className="analytics-title">
            <DashboardIcon />
            <span>Analytics Dashboard</span>
          </h2>
        </div>
        <div className="analytics-empty">
          <EmptyChartIcon />
          <p className="empty-text">No data yet</p>
          <p className="empty-subtext">Start receiving tips to see analytics</p>
        </div>
      </section>
    );
  }

  return (
    <section className="analytics-section">
      <div className="analytics-header">
        <h2 className="analytics-title">
          <DashboardIcon />
          <span>Analytics Dashboard</span>
        </h2>
        <div className="analytics-actions">
          <div className="period-selector">
            <button className={`period-btn ${period === '7d' ? 'active' : ''}`} onClick={() => setPeriod('7d')}>7 Days</button>
            <button className={`period-btn ${period === '30d' ? 'active' : ''}`} onClick={() => setPeriod('30d')}>30 Days</button>
            <button className={`period-btn ${period === 'all' ? 'active' : ''}`} onClick={() => setPeriod('all')}>All Time</button>
          </div>
          {onExportPDF && (
            <button className="btn-pdf-export" onClick={onExportPDF}>
              📄 Export PDF
            </button>
          )}
        </div>
      </div>

      <div className="stats-grid">
        <StatCard icon={<TotalTipsIcon />} title="Total Tips" value={`${stats.total} XLM`} subtitle={`$${(stats.total * 0.12).toFixed(2)} USD`} trend={parseFloat(stats.trends.percentChange)} trendLabel="vs previous" color="green" />
        <StatCard icon={<AverageIcon />} title="Average Tip" value={`${stats.average} XLM`} subtitle="Per transaction" color="purple" />
        <StatCard icon={<SupportersIcon />} title="Supporters" value={stats.supporters} subtitle="Unique contributors" color="blue" />
        <StatCard icon={<TrophyIcon />} title="Best Day" value={`${stats.best.amount} XLM`} subtitle={stats.best.date} color="amber" />
      </div>

      <div className="charts-grid">
        <div className="chart-container chart-large">
          <h3 className="chart-title">
            <TimelineIcon />
            <span>Tip Timeline</span>
          </h3>
          <div className="chart-wrapper">
            <Line data={timelineData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">
            <UsersIcon />
            <span>Top Supporters</span>
          </h3>
          <div className="chart-wrapper">
            <Bar data={topSupportersData} options={barOptions} />
          </div>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">
            <PieChartIcon />
            <span>Tip Distribution</span>
          </h3>
          <div className="chart-wrapper">
            <Doughnut data={distributionData} options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: '65%',
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: { usePointStyle: true, padding: 16, font: { size: 12, weight: 500 } }
                }
              }
            }} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Analytics;
