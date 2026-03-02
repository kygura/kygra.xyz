export const Geo1 = () => {
  return (
    <div className="box b-geo1">
      <svg viewBox="0 0 200 280" fill="none">
        <g stroke="#0a0a0a" strokeWidth="1.5">
          <rect x="15" y="15" width="85" height="60" className="df" />
          <rect x="32" y="32" width="85" height="60" className="df" />
          <rect x="49" y="49" width="85" height="60" fill="#0a0a0a" />
          <polygon points="100,135 18,255 182,255" strokeWidth="1.5" className="d2" />
          <polygon points="100,150 42,240 158,240" strokeDasharray="4 3" className="d2" />
          <line x1="100" y1="135" x2="100" y2="255" />
          <circle cx="55" cy="78" r="8" fill="#0a0a0a" />
          <circle cx="100" cy="195" r="13" className="df" />
          <circle cx="100" cy="195" r="5" fill="#0a0a0a" />
          <text x="14" y="11" fontSize="8" fontFamily="monospace" fill="#0a0a0a">GEO.01</text>
          <text x="126" y="253" fontSize="7" fontFamily="monospace" fill="#0a0a0a">45°</text>
        </g>
      </svg>
    </div>
  );
};
