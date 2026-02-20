import React from 'react';

/** 
 * Unique, Premium Custom SVG Icons for OpenClaw CRM
 * Designed for a minimal, integrated look. 
 */

interface IconProps {
    className?: string;
}

export const CustomDashboard = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M3 3H10V10H3V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 3H21V7H14V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 11H21V21H14V11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 14H10V21H3V14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="6.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
);

export const CustomConversations = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M8 9H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 13H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M21 12C21 16.9706 16.9706 21 12 21C10.4379 21 8.97445 20.6033 7.69833 19.9056L3 21L4.09436 16.3017C3.39674 15.0255 3 13.5621 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 12H17.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export const CustomCron = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 3V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 19V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M3 12H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M19 12H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

export const CustomFiles = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M20 7H12L10 5H4C2.89543 5 2 5.89543 2 7V17C2 18.1046 2.89543 19 4 19H20C21.1046 19 22 18.1046 22 17V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 11H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="15" y="13" width="3" height="3" rx="0.5" fill="currentColor" fillOpacity="0.3" />
    </svg>
);

export const CustomSkills = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M9.5 21V19C9.5 17.8954 10.3954 17 11.5 17H12.5C13.6046 17 14.5 17.8954 14.5 19V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M21 11.0833C21 15.1424 18.1408 18.4284 14.5 19.0142C14.5 19.0142 14.5 19 14.5 18.5C14.5 16.567 12.933 15 11 15C9.067 15 7.5 16.567 7.5 18.5C7.5 19 7.5 19.0142 7.5 19.0142C3.8592 18.4284 1 15.1424 1 11.0833C1 6.61897 4.58172 3 9 3C11.3855 3 13.5255 4.03254 15 5.67087C16.4745 4.03254 18.6145 3 21 3C25.4183 3 29 6.61897 29 11.0833" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 11.5V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

export const CustomConfig = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M4 8H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 8H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="14" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 16H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 16H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="10" cy="16" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
);

export const CustomCalendar = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 9H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="7.5" cy="13.5" r="1" fill="currentColor" />
        <circle cx="12" cy="13.5" r="1" fill="currentColor" />
        <circle cx="16.5" cy="13.5" r="1" fill="currentColor" />
    </svg>
);

export const CustomAnalytics = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M3 20L21 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M6 16L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 16L12 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M18 16L18 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M3 20C3 20 7 12 12 12C17 12 21 4 21 4" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
    </svg>
);

export const CustomHelp = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9.09 9C9.3251 8.27279 9.94162 7.69677 10.7025 7.42512C11.4633 7.15348 12.304 7.21175 12.8711 7.575C13.4382 7.93825 13.6811 8.57019 13.4984 9.135C13.3157 9.69981 12.7214 10.1667 11.5 10.6667V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="15" r="1" fill="currentColor" />
    </svg>
);

export const CustomSave = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16L21 8V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 21V13H7V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 3V8H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const CustomEye = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 23 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const CustomEdit = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M11 4H4C2.89543 4 2 4.89543 2 6V20C2 21.1046 2.89543 22 4 22H18C19.1046 22 20 21.1046 20 20V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18.5 2.5C19.3284 1.67157 20.6716 1.67157 21.5 2.5C22.3284 3.32843 22.3284 4.67157 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const CustomSearch = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const CustomSparkles = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 3V4M12 20V21M4 12H3M21 12H20M5.63604 5.63604L6.34315 6.34315M17.6569 17.6569L18.364 18.364M5.63604 18.364L6.34315 17.6569M17.6569 6.34315L18.364 5.63604" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 8L13 11L16 12L13 13L12 16L11 13L8 12L11 11L12 8Z" fill="currentColor" />
    </svg>
);

export const CustomWifi = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M5 12.5C5 12.5 8 9.5 12 9.5C16 9.5 19 12.5 19 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1.3 8C1.3 8 6 3.3 12 3.3C18 3.3 22.7 8 22.7 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.5 17C8.5 17 10 15.5 12 15.5C14 15.5 15.5 17 15.5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="20" r="1" fill="currentColor" />
    </svg>
);

export const CustomChevronRight = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const CustomChevronLeft = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const CustomChevronDown = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const CustomClock = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const CustomHardDrive = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M22 12H2M22 12C22 12 21 18 12 18C3 18 2 12 2 12M22 12C22 12 21 6 12 6C3 6 2 12 2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="7" cy="12" r="0.5" fill="currentColor" />
        <circle cx="12" cy="12" r="0.5" fill="currentColor" />
        <circle cx="17" cy="12" r="0.5" fill="currentColor" />
    </svg>
);

export const CustomX = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const CustomPlay = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M5 3L19 12L5 21V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const CustomPower = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 2V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18.4 6.6C21.1 9.3 21.1 13.7 18.4 16.4C15.7 19.1 11.3 19.1 8.6 16.4C5.9 13.7 5.9 9.3 8.6 6.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const CustomPowerOff = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 2V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18.4 6.6C21.1 9.3 21.1 13.7 18.4 16.4C15.7 19.1 11.3 19.1 8.6 16.4C5.9 13.7 5.9 9.3 8.6 6.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2.5 2.5L21.5 21.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const CustomRefresh = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M23 4V10H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1 20V14H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.5 9.00001C4.4 7.10001 5.8 5.40001 7.7 4.30001C9.6 3.20001 11.8 2.80001 13.9 3.20001C16 3.60001 17.9 4.70001 19.3 6.30001L22.2 9.20001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20.5 15C19.6 16.9 18.2 18.6 16.3 19.7C14.4 20.8 12.2 21.2 10.1 20.8C8 20.4 6.1 19.3 4.7 17.7L1.8 14.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const CustomCopy = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const CustomCheck = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const CustomLock = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const CustomAlert = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 8V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="16" r="1" fill="currentColor" />
    </svg>
);

export const CustomTrendingUp = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 6H23V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const CustomCoins = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export const CustomHash = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M4 9H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 15H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 3L8 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 3L14 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const CustomGlobe = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 12H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 2C12 2 15 5 15 12C15 19 12 22 12 22C12 22 9 19 9 12C9 5 12 2 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const CustomTerminal = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M4 17L10 11L4 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="12" y1="19" x2="20" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export const CustomBot = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 16H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 16H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export const CustomZap = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" />
    </svg>
);
