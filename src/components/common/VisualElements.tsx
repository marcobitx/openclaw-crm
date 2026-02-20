import React from 'react';
import { clsx } from 'clsx';

export const WarmGlow = ({ className }: { className?: string }) => (
    <div className={`absolute pointer-events-none ${className}`}>
        <div className="absolute inset-0 bg-brand-500/20 blur-[120px] rounded-full overflow-hidden" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-accent-500/10 blur-[80px] rounded-full" />
    </div>
);

export const HappyLobster = ({ className }: { className?: string }) => (
    <div className={className}>
        {/* Playful Glow */}
        <div className="absolute inset-4 bg-brand-500/15 blur-2xl rounded-full" />

        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10 drop-shadow-xl animate-[mighty-float_4s_ease-in-out_infinite] overflow-visible">
            <defs>
                <linearGradient id="happy-lobster-grad" x1="50" y1="20" x2="150" y2="180" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FB7185" />
                    <stop offset="0.6" stopColor="#E11D48" />
                    <stop offset="1" stopColor="#F59E0B" />
                </linearGradient>
            </defs>

            {/* Tail Fan */}
            <path d="M100 170 L85 195 Q100 188 115 195 L100 170" fill="#991B1B" opacity="0.8" />

            {/* Segmented Body */}
            <path d="M100 60 C75 60 70 150 100 175 C130 150 125 60 100 60" fill="url(#happy-lobster-grad)" />
            <path d="M82 95 Q100 100 118 95" stroke="white" strokeWidth="0.5" opacity="0.2" />
            <path d="M85 120 Q100 125 115 120" stroke="white" strokeWidth="0.5" opacity="0.2" />
            <path d="M90 145 Q100 150 110 145" stroke="white" strokeWidth="0.5" opacity="0.2" />

            {/* Waving Left Claw */}
            <g className="animate-[mighty-flex-left_2s_ease-in-out_infinite] origin-[85px_80px]">
                <path d="M85 80 Q50 75 40 55" stroke="url(#happy-lobster-grad)" strokeWidth="10" strokeLinecap="round" />
                <path d="M40 25 C25 25 15 45 30 60 Q45 70 55 60 L50 40 Q45 25 40 25" fill="url(#happy-lobster-grad)" />
            </g>

            {/* Waving Right Claw */}
            <g className="animate-[mighty-flex-right_2.5s_ease-in-out_infinite] origin-[115px_80px]">
                <path d="M115 80 Q150 75 160 55" stroke="url(#happy-lobster-grad)" strokeWidth="10" strokeLinecap="round" />
                <path d="M160 25 C175 25 185 45 170 60 Q155 70 145 60 L150 40 Q155 25 160 25" fill="url(#happy-lobster-grad)" />
            </g>

            {/* Friendly Face */}
            <g>
                <circle cx="90" cy="80" r="4" fill="black" />
                <circle cx="110" cy="80" r="4" fill="black" />
                <circle cx="91.5" cy="78" r="1.2" fill="white" />
                <circle cx="111.5" cy="78" r="1.2" fill="white" />
                <path d="M90 95 Q100 105 110 95" stroke="white" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* Antennas */}
            <path d="M95 60 Q80 20 30 5" stroke="white" strokeWidth="0.8" opacity="0.3" fill="none" />
            <path d="M105 60 Q120 20 170 5" stroke="white" strokeWidth="0.8" opacity="0.3" fill="none" />
        </svg>
    </div>
);

export const CRMIllustration = ({ className }: { className?: string }) => (
    <div className={className}>
        <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Cards inside */}
            <rect x="40" y="60" width="100" height="60" rx="8" fill="#292524" />
            <rect x="150" y="60" width="100" height="60" rx="8" fill="#292524" />
            <rect x="260" y="60" width="100" height="60" rx="8" fill="#292524" />

            {/* Main content area */}
            <rect x="150" y="130" width="210" height="110" rx="8" fill="#292524" />
            <rect x="40" y="130" width="100" height="110" rx="8" fill="#292524" />

            {/* Accents */}
            <circle cx="65" cy="85" r="12" fill="#F43F5E" fillOpacity="0.2" />
            <circle cx="65" cy="85" r="5" fill="#F43F5E" />

            <rect x="175" y="85" width="50" height="8" rx="4" fill="#F59E0B" fillOpacity="0.4" />
            <rect x="175" y="85" width="25" height="8" rx="4" fill="#F59E0B" />

            {/* Floating elements */}
            <circle cx="360" cy="50" r="30" fill="#F43F5E" fillOpacity="0.05" />
            <circle cx="40" cy="250" r="40" fill="#F59E0B" fillOpacity="0.03" />
        </svg>
    </div>
);

export const AnimatedLogo = ({ className }: { className?: string }) => (
    <div className={clsx("relative", className)}>
        {/* Powerful Ambient Glow */}
        <div className="absolute inset-0 bg-brand-500/10 blur-xl rounded-full" />

        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] animate-[mighty-float_4s_ease-in-out_infinite]">
            <defs>
                <linearGradient id="grand-lobster-grad" x1="50" y1="20" x2="50" y2="90" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FB7185" />
                    <stop offset="0.6" stopColor="#E11D48" />
                    <stop offset="1" stopColor="#9F1239" />
                </linearGradient>
            </defs>

            {/* Iconic Big Left Claw */}
            <g className="animate-[mighty-flex-left_3s_ease-in-out_infinite] origin-[45px_45px]">
                {/* Arm */}
                <path d="M42 45 C30 40 25 35 25 25" stroke="url(#grand-lobster-grad)" strokeWidth="8" strokeLinecap="round" />
                {/* Huge Pincer Body */}
                <path d="M25 10 C10 10 5 30 20 45 C35 60 40 45 40 45 L35 25 Q30 10 25 10" fill="url(#grand-lobster-grad)" />
                {/* Highlight Blade */}
                <path d="M12 25 C10 30 10 40 18 45" stroke="white" strokeWidth="2" strokeOpacity="0.2" strokeLinecap="round" />
            </g>

            {/* Iconic Big Right Claw */}
            <g className="animate-[mighty-flex-right_3s_ease-in-out_infinite] origin-[55px_45px]">
                {/* Arm */}
                <path d="M58 45 C70 40 75 35 75 25" stroke="url(#grand-lobster-grad)" strokeWidth="8" strokeLinecap="round" />
                {/* Huge Pincer Body */}
                <path d="M75 10 C90 10 95 30 80 45 C65 60 60 45 60 45 L65 25 Q70 10 75 10" fill="url(#grand-lobster-grad)" />
                {/* Highlight Blade */}
                <path d="M88 25 C90 30 90 40 82 45" stroke="white" strokeWidth="2" strokeOpacity="0.2" strokeLinecap="round" />
            </g>

            {/* Segmented Strong Body */}
            <path d="M50 30 L62 45 V75 L50 90 L38 75 V45 L50 30" fill="url(#grand-lobster-grad)" />
            <path d="M42 45 H58" stroke="white" strokeWidth="0.5" opacity="0.2" />
            <path d="M42 55 H58" stroke="white" strokeWidth="0.5" opacity="0.2" />
            <path d="M42 65 H58" stroke="white" strokeWidth="0.5" opacity="0.2" />

            {/* Tail Fan */}
            <path d="M38 90 L50 100 L62 90 Z" fill="#881337" opacity="0.8" />

            {/* Head Detail & Glowing Eyes */}
            <circle cx="45" cy="40" r="2.5" fill="black" />
            <circle cx="55" cy="40" r="2.5" fill="black" />
            <circle cx="46" cy="39" r="0.8" fill="white" className="animate-pulse" />
            <circle cx="56" cy="39" r="0.8" fill="white" className="animate-pulse" />

            {/* Long Antennas */}
            <path d="M48 30 C40 10 20 5 10 15" stroke="white" strokeWidth="0.3" opacity="0.3" fill="none" />
            <path d="M52 30 C60 10 80 5 90 15" stroke="white" strokeWidth="0.3" opacity="0.3" fill="none" />
        </svg>
    </div>
);
