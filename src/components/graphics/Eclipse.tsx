export const Eclipse = () => {
  return (
    <div className="box b-jet">
      <svg viewBox="0 0 300 280" fill="none" style={{ width: '100%', height: '100%', padding: '1.5rem' }}>
        <g stroke="#f0ede6" strokeWidth="1.1">
          <circle cx="150" cy="140" r="105" strokeWidth="1.8" />
          <ellipse cx="150" cy="140" rx="105" ry="22" />
          <ellipse cx="150" cy="140" rx="100" ry="55" />
          <ellipse cx="150" cy="140" rx="88" ry="80" />
          <ellipse cx="150" cy="140" rx="88" ry="80" transform="rotate(180 150 140)" strokeDasharray="3 3" />
          <ellipse cx="150" cy="140" rx="100" ry="55" transform="rotate(180 150 140)" strokeDasharray="3 3" />
          <ellipse cx="150" cy="140" rx="40" ry="105" />
          <ellipse cx="150" cy="140" rx="80" ry="105" />
          <ellipse cx="150" cy="140" rx="105" ry="105" strokeDasharray="3 3" />
          <ellipse cx="150" cy="140" rx="40" ry="105" transform="rotate(45 150 140)" strokeDasharray="3 3" />
          <ellipse cx="150" cy="140" rx="80" ry="105" transform="rotate(45 150 140)" strokeDasharray="3 3" />

          {/* Top Left: Concentric Square and Circle */}
          <rect x="30" y="25" width="45" height="45" strokeWidth="1.2" />
          <circle cx="52.5" cy="47.5" r="16" strokeWidth="1.2" />
          <rect x="42.5" y="37.5" width="20" height="20" strokeWidth="1.2" />

          {/* Bottom Right: Star and Sweep */}
          <rect x="225" y="210" width="45" height="45" strokeWidth="1.2" />
          <path d="M247.5 220 Q 249 226 254 227.5 Q 249 229 247.5 235 Q 246 229 241 227.5 Q 246 226 247.5 220" fill="#f0ede6" />
          <path d="M232 245 Q 247.5 255 263 245" fill="none" strokeWidth="1.2" />

          <text x="20" y="14" fontSize="7" fontFamily="monospace" fill="#f0ede6">AXIS — ORBITAL GRID</text>
          <text x="20" y="260" fontSize="7" fontFamily="monospace" fill="#f0ede6">ø 210u · SPARSE · 5+5</text>
        </g>
      </svg>
      <span className="spec">ECLIPSE — ORBITAL MECHANICS</span>
    </div>
  );
};
