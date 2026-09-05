import React from 'react';

interface QuickerLogoProps {
  className?: string;
  variant?: 'full' | 'mark' | 'white';
  showSubtitle?: boolean;
}

export const QuickerLogo: React.FC<QuickerLogoProps> = ({
  className = 'h-9 w-auto',
  variant = 'full',
  showSubtitle = true,
}) => {
  const brandColor = variant === 'white' ? '#FFFFFF' : '#22399A';
  const subtitleColor = variant === 'white' ? '#E0F2FE' : '#22399A';

  if (variant === 'mark') {
    return (
      <svg
        viewBox="0 0 160 160"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Circular Sparkle Bubble */}
        <g transform="translate(108, 48)">
          <path
            d="M -10,24 C -22,14 -26,-6 -14,-19 C -2,-32 18,-32 30,-19 C 42,-6 38,16 26,26 C 20,30 14,32 8,32"
            stroke={brandColor}
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 10,-12 C 10,-5 14,-1 21,-1 C 14,-1 10,3 10,10 C 10,3 6,-1 -1,-1 C 6,-1 10,-5 10,-12 Z"
            fill={brandColor}
          />
          <path
            d="M -3,11 C -3,13.5 -1.5,15 1,15 C -1.5,15 -3,16.5 -3,19 C -3,16.5 -4.5,15 -7,15 C -4.5,15 -3,13.5 -3,11 Z"
            fill={brandColor}
          />
        </g>

        {/* Quicker Signature 'Q' */}
        <path
          d="M 66,24 C 92,24 110,42 110,70 C 110,92 98,108 78,114 C 73,116 67,117 62,117 C 36,117 18,99 18,71 C 18,59 22,48 30,41 C 36,35 43,31 51,29 L 52,44 C 47,46 43,50 40,55 C 36,60 34,65 34,71 C 34,89 45,102 62,102 C 78,102 93,89 93,70 C 93,52 82,39 66,39 C 61,39 57,40 54,42 L 51,26 C 56,24 61,24 66,24 Z"
          fill={brandColor}
        />
        <path
          d="M 52,90 C 40,90 32,98 32,108 C 32,118 40,126 50,126 C 65,126 80,117 96,105 C 103,116 111,125 120,131 L 130,120 C 120,113 112,103 107,91 C 98,99 86,105 75,109 C 68,111 60,113 53,112 C 48,111 46,109 46,106 C 46,103 48,101 54,99 C 64,96 76,91 86,84 L 78,74 C 70,80 60,90 52,90 Z"
          fill={brandColor}
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 460 145"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sparkle Badge Emblem above 'er' */}
      <g transform="translate(372, 42)">
        {/* Crescent / Circular bubble outline with opening */}
        <path
          d="M -12,28 C -26,16 -30,-8 -16,-23 C -2,-38 24,-38 38,-23 C 51,-8 48,18 33,30 C 27,35 19,38 11,38"
          stroke={brandColor}
          strokeWidth="4.8"
          strokeLinecap="round"
          fill="none"
        />
        {/* Primary 4-Point Diamond Sparkle */}
        <path
          d="M 12,-15 C 12,-6 17,-1 26,-1 C 17,-1 12,4 12,13 C 12,4 7,-1 -2,-1 C 7,-1 12,-6 12,-15 Z"
          fill={brandColor}
        />
        {/* Secondary Small Sparkle */}
        <path
          d="M -4,13 C -4,16 -2,18 1,18 C -2,18 -4,20 -4,23 C -4,20 -6,18 -9,18 C -6,18 -4,16 -4,13 Z"
          fill={brandColor}
        />
      </g>

      {/* Main Brand Title 'Quicker' */}
      <g fill={brandColor}>
        {/* 'Q' with stylish top-left cut and curving looping tail */}
        <path
          d="M 64,28 C 92,28 110,46 110,75 C 110,97 98,114 78,121 C 73,123 67,124 61,124 C 35,124 17,106 17,76 C 17,64 21,53 29,45 C 35,39 42,35 50,32 L 52,47 C 46,50 42,54 39,59 C 35,64 33,70 33,76 C 33,95 44,108 61,108 C 77,108 93,95 93,75 C 93,55 82,43 64,43 C 60,43 56,44 52,46 L 49,30 C 54,28 59,28 64,28 Z"
        />
        <path
          d="M 52,96 C 40,96 31,104 31,115 C 31,126 39,134 49,134 C 64,134 80,125 96,112 C 103,124 112,134 121,141 L 131,129 C 121,121 112,110 107,98 C 97,106 85,113 74,116 C 67,118 59,120 53,119 C 48,118 46,116 46,113 C 46,110 48,107 54,105 C 64,102 76,96 86,90 L 78,79 C 70,85 60,96 52,96 Z"
        />

        {/* 'u' */}
        <path
          d="M 124,63 L 140,63 L 140,98 C 140,106 146,111 154,111 C 162,111 169,105 169,96 L 169,63 L 185,63 L 185,99 C 185,114 172,125 154,125 C 135,125 124,113 124,98 L 124,63 Z"
        />

        {/* 'i' */}
        <circle cx="204" cy="46" r="8.5" />
        <rect x="196" y="63" width="16" height="60" rx="4" />

        {/* 'c' */}
        <path
          d="M 269,78 L 255,84 C 252,77 246,74 239,74 C 229,74 221,82 221,94 C 221,106 229,114 239,114 C 246,114 252,111 256,104 L 270,110 C 263,121 252,126 238,126 C 218,126 204,112 204,94 C 204,75 218,61 238,61 C 253,61 264,68 269,78 Z"
        />

        {/* 'k' */}
        <rect x="279" y="28" width="16" height="95" rx="4" />
        <path
          d="M 324,63 L 303,88 L 326,123 L 307,123 L 291,98 L 291,86 L 308,63 L 324,63 Z"
        />

        {/* 'e' */}
        <path
          d="M 372,93 L 339,93 C 340,84 346,77 355,77 C 362,77 368,81 370,87 L 384,81 C 379,70 369,62 355,62 C 337,62 323,75 323,94 C 323,113 336,126 355,126 C 371,126 382,116 386,102 L 371,98 C 369,105 363,111 355,111 C 346,111 340,104 339,96 L 386,96 C 386,95 386,94 386,93 Z M 339,84 C 340,80 346,73 355,73 C 363,73 369,79 370,84 L 339,84 Z"
        />

        {/* 'r' */}
        <rect x="396" y="63" width="16" height="60" rx="4" />
        <path
          d="M 410,65 C 416,62 423,61 430,62 L 428,78 C 422,77 415,79 411,83 L 411,123 L 396,123 L 396,63 L 411,63 L 411,65 Z"
        />
      </g>

      {/* Subtitle: "LAUNDRY & DRYCLEANING" */}
      {showSubtitle && (
        <text
          x="132"
          y="142"
          fill={subtitleColor}
          fontSize="19.5"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, Montserrat, sans-serif"
          letterSpacing="0.07em"
        >
          LAUNDRY &amp; DRYCLEANING
        </text>
      )}
    </svg>
  );
};
