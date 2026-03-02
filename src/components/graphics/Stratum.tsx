export const Stratum = () => {
  return (
    <div className="box b-moto fi2">
      <svg viewBox="0 0 500 420" fill="none" style={{ width: '100%', height: '100%', padding: '2rem' }}>
        <g stroke="#f5c842" strokeWidth="1">
          <circle cx="250" cy="210" r="150" strokeWidth="1.6" />
          <ellipse cx="250" cy="210" rx="150" ry="20" strokeWidth="0.8" />
          <ellipse cx="250" cy="210" rx="147" ry="55" strokeWidth="0.8" />
          <ellipse cx="250" cy="210" rx="139" ry="90" strokeWidth="0.8" />
          <ellipse cx="250" cy="210" rx="120" ry="120" strokeWidth="0.8" strokeDasharray="3 2" />
          <ellipse cx="250" cy="210" rx="139" ry="90" transform="rotate(180 250 210)" strokeWidth="0.6" />
          <ellipse cx="250" cy="210" rx="147" ry="55" transform="rotate(180 250 210)" strokeWidth="0.6" />
          <ellipse cx="250" cy="210" rx="30" ry="150" strokeWidth="0.8" />
          <ellipse cx="250" cy="210" rx="80" ry="150" strokeWidth="0.8" />
          <ellipse cx="250" cy="210" rx="120" ry="150" strokeWidth="0.8" />
          <ellipse cx="250" cy="210" rx="30" ry="150" transform="rotate(45 250 210)" strokeWidth="0.6" />
          <ellipse cx="250" cy="210" rx="80" ry="150" transform="rotate(45 250 210)" strokeWidth="0.6" />
          <ellipse cx="250" cy="210" rx="120" ry="150" transform="rotate(45 250 210)" strokeWidth="0.6" />
          <circle cx="250" cy="60" r="4" fill="#f5c842" />
          <circle cx="250" cy="360" r="4" fill="#f5c842" />
          <circle cx="100" cy="210" r="4" fill="#f5c842" />
          <circle cx="400" cy="210" r="4" fill="#f5c842" />
          <line x1="20" y1="20" x2="50" y2="20" strokeWidth="1.2" />
          <line x1="20" y1="20" x2="20" y2="50" strokeWidth="1.2" />
          <line x1="480" y1="400" x2="450" y2="400" strokeWidth="1.2" />
          <line x1="480" y1="400" x2="480" y2="370" strokeWidth="1.2" />

          {/* Top Left: Square with + and black dot */}
          <rect x="70" y="50" width="40" height="40" strokeWidth="1.2" />
          <line x1="90" y1="60" x2="90" y2="80" strokeWidth="1.2" />
          <line x1="80" y1="70" x2="100" y2="70" strokeWidth="1.2" />
          <circle cx="50" cy="100" r="10" fill="#f5c842" />

          {/* Bottom Right: Square with wave lines */}
          <rect x="390" y="320" width="40" height="40" strokeWidth="1.2" />
          <path d="M395 330 Q 400 325 405 330 T 415 330 T 425 330" strokeWidth="1.2" fill="none" />
          <path d="M395 340 Q 400 335 405 340 T 415 340 T 425 340" strokeWidth="1.2" fill="none" />
          <path d="M395 350 Q 400 345 405 350 T 415 350 T 425 350" strokeWidth="1.2" fill="none" />

          <text x="22" y="16" fontSize="8" fontFamily="monospace" fill="#f5c842">STRATUM — GEODESIC</text>
          <text x="22" y="395" fontSize="7" fontFamily="monospace" fill="#f5c842">ø 300u · 7 LAT · 8 LONG</text>
        </g>
      </svg>
      <span className="spec">STRATUM — WIREFRAME SPHERE · 2074</span>
    </div>
  );
};
