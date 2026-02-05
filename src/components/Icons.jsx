import React from 'react';

// Wallet Icon
export const WalletIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="6" width="20" height="14" rx="2" stroke={color} strokeWidth="2"/>
    <path d="M22 10h-4a2 2 0 00-2 2v0a2 2 0 002 2h4" stroke={color} strokeWidth="2"/>
    <path d="M18 12h.01" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M6 6V4a2 2 0 012-2h8a2 2 0 012 2v2" stroke={color} strokeWidth="2"/>
  </svg>
);

// Common UI Icons
export const CheckIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ChevronUpIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 15l-6-6-6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ChevronDownIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9l6 6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ArrowLeftIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ArrowRightIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12h14M12 5l7 7-7 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ArrowUpIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 19V5M5 12l7-7 7 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ArrowDownIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5v14M19 12l-7 7-7-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const TrashIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const RefreshIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23 4v6h-6M1 20v-6h6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const CopyIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="9" y="9" width="13" height="13" rx="2" stroke={color} strokeWidth="2"/>
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke={color} strokeWidth="2"/>
  </svg>
);

export const ExternalLinkIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const RocketIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" stroke={color} strokeWidth="2"/>
    <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" stroke={color} strokeWidth="2"/>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" stroke={color} strokeWidth="2"/>
  </svg>
);

export const LoaderIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="spinner">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" strokeOpacity="0.25"/>
    <path d="M12 2a10 10 0 019.17 6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const HeartIcon = ({ size = 16, color = 'currentColor', filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} xmlns="http://www.w3.org/2000/svg">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const InboxIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 12h-6l-2 3h-4l-2-3H2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" stroke={color} strokeWidth="2"/>
  </svg>
);

export const SuccessIcon = ({ size = 20, color = '#10b981' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill={color} fillOpacity="0.15"/>
    <path d="M8 12l3 3 5-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ErrorIcon = ({ size = 20, color = '#ef4444' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill={color} fillOpacity="0.15"/>
    <path d="M15 9l-6 6M9 9l6 6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const InfoIcon = ({ size = 20, color = '#3b82f6' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill={color} fillOpacity="0.15"/>
    <path d="M12 16v-4M12 8h.01" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const WarningIcon = ({ size = 20, color = '#f59e0b' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 9v4M12 17h.01" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="2"/>
  </svg>
);

// Celebration/Thank You Icons
export const SparkleIcon = ({ size = 16, color = '#f4d03f' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/>
  </svg>
);

export const StarIcon = ({ size = 16, color = '#f4d03f', filled = true }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

export const TrophyIcon = ({ size = 16, color = '#f59e0b' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9H4a2 2 0 01-2-2V5a2 2 0 012-2h2M18 9h2a2 2 0 002-2V5a2 2 0 00-2-2h-2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M6 3h12v6a6 6 0 01-12 0V3z" stroke={color} strokeWidth="2"/>
    <path d="M12 15v4M8 21h8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const GiftIcon = ({ size = 16, color = '#8b5cf6' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="8" width="18" height="4" rx="1" stroke={color} strokeWidth="2"/>
    <rect x="5" y="12" width="14" height="9" rx="1" stroke={color} strokeWidth="2"/>
    <path d="M12 8v13" stroke={color} strokeWidth="2"/>
    <path d="M7.5 8a2.5 2.5 0 110-5C9.5 3 12 5.5 12 8M16.5 8a2.5 2.5 0 100-5C14.5 3 12 5.5 12 8" stroke={color} strokeWidth="2"/>
  </svg>
);

export const PartyIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="5" cy="5" r="2" fill="#f59e0b"/>
    <circle cx="19" cy="5" r="2" fill="#8b5cf6"/>
    <circle cx="12" cy="3" r="2" fill="#10b981"/>
    <circle cx="3" cy="12" r="2" fill="#3b82f6"/>
    <circle cx="21" cy="12" r="2" fill="#ef4444"/>
    <path d="M12 21V8M8 18l4-4 4 4" stroke="#f4d03f" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const CoffeeIcon = ({ size = 16, color = '#8b5cf6' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" stroke={color} strokeWidth="2"/>
    <path d="M6 1v3M10 1v3M14 1v3" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const WaveIcon = ({ size = 16, color = '#3b82f6' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 12c2-3 4-4 6-1s4 2 6-1 4-2 6 1" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M2 16c2-3 4-4 6-1s4 2 6-1 4-2 6 1" stroke={color} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5"/>
  </svg>
);

export const SunIcon = ({ size = 16, color = '#f59e0b' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2"/>
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const DiamondIcon = ({ size = 16, color = '#8b5cf6' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 3h12l4 6-10 12L2 9l4-6z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    <path d="M2 9h20M12 21L8 9l4-6 4 6-4 12z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);

export const FireIcon = ({ size = 16, color = '#ef4444' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22c4.97 0 8-3.58 8-8 0-3.5-2-6.5-4-8.5 0 2-1.5 4-4 4-2.5 0-4-2-4-4C6 8 4 11 4 14c0 4.42 3.03 8 8 8z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2"/>
    <path d="M12 22c2 0 4-1.5 4-4 0-2-1-3.5-2-4.5-.5 1-1.5 2-2 2s-1.5-1-2-2c-1 1-2 2.5-2 4.5 0 2.5 2 4 4 4z" fill={color}/>
  </svg>
);

export const QrCodeIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2"/>
    <rect x="14" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2"/>
    <rect x="3" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="2"/>
    <path d="M14 14h3v3h-3v-3z" fill={color}/>
    <path d="M17 17h3v3h-3v-3z" fill={color}/>
    <path d="M14 17h3v3h-3v-3z" fill={color} fillOpacity="0.2"/>
    <path d="M17 14h3v3h-3v-3z" fill={color} fillOpacity="0.2"/>
  </svg>
);

export const DownloadIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 10l5 5 5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 15V3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const PrayIcon = ({ size = 16, color = '#8b5cf6' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2v4M8 7l2 8 2-4 2 4 2-8M6 22h12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="14" r="3" stroke={color} strokeWidth="2"/>
    <circle cx="12" cy="14" r="3" stroke={color} strokeWidth="2"/>
  </svg>
);

export const LogOutIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
