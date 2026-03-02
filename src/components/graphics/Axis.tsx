export const Axis = () => {
  return (
    <div className="box b-blueprint">
      <svg viewBox="0 0 400 280" fill="none" style={{ width: '100%', height: '100%', padding: '1.5rem' }}>
        <g stroke="#f0ede6" strokeWidth="0.9">
          <circle cx="200" cy="140" r="110" strokeWidth="1.8" />
          <ellipse cx="200" cy="140" rx="110" ry="10" />
          <ellipse cx="200" cy="140" rx="109" ry="28" />
          <ellipse cx="200" cy="140" rx="105" ry="46" />
          <ellipse cx="200" cy="140" rx="99" ry="63" />
          <ellipse cx="200" cy="140" rx="89" ry="78" />
          <ellipse cx="200" cy="140" rx="75" ry="90" />
          <ellipse cx="200" cy="140" rx="55" ry="99" />
          <ellipse cx="200" cy="140" rx="75" ry="90" transform="rotate(180 200 140)" />
          <ellipse cx="200" cy="140" rx="89" ry="78" transform="rotate(180 200 140)" />
          <ellipse cx="200" cy="140" rx="99" ry="63" transform="rotate(180 200 140)" />
          <ellipse cx="200" cy="140" rx="105" ry="46" transform="rotate(180 200 140)" />
          <ellipse cx="200" cy="140" rx="109" ry="28" transform="rotate(180 200 140)" />
          <ellipse cx="200" cy="140" rx="18" ry="110" />
          <ellipse cx="200" cy="140" rx="50" ry="110" />
          <ellipse cx="200" cy="140" rx="80" ry="110" />
          <ellipse cx="200" cy="140" rx="105" ry="110" />
          <ellipse cx="200" cy="140" rx="18" ry="110" transform="rotate(30 200 140)" />
          <ellipse cx="200" cy="140" rx="50" ry="110" transform="rotate(30 200 140)" />
          <ellipse cx="200" cy="140" rx="80" ry="110" transform="rotate(30 200 140)" />
          <ellipse cx="200" cy="140" rx="105" ry="110" transform="rotate(30 200 140)" />
          <ellipse cx="200" cy="140" rx="18" ry="110" transform="rotate(60 200 140)" />
          <ellipse cx="200" cy="140" rx="50" ry="110" transform="rotate(60 200 140)" />
          <circle cx="200" cy="140" rx="80" ry="110" transform="rotate(60 200 140)" />
          <circle cx="110" cy="90" r="7" fill="#f0ede6" />

          {/* Top Left: Square with two 4-point stars */}
          <rect x="30" y="40" width="45" height="45" strokeWidth="1.2" />
          <path d="M42 45 Q 45 53 53 56 Q 45 59 42 67 Q 39 59 31 56 Q 39 53 42 45" fill="none" strokeWidth="1.2" />
          <path d="M60 62 Q 63 68 69 70 Q 63 72 60 78 Q 57 72 51 70 Q 57 68 60 62" fill="none" strokeWidth="1.2" />

          {/* Bottom Right: Square with concentric circles */}
          <rect x="325" y="195" width="45" height="45" strokeWidth="1.2" />
          <circle cx="347.5" cy="217.5" r="4" strokeWidth="1.2" />
          <circle cx="347.5" cy="217.5" r="10" strokeWidth="1.2" />
          <circle cx="347.5" cy="217.5" r="16" strokeWidth="1.2" />

          <text x="15" y="12" fontSize="8" fontFamily="monospace" fill="#f0ede6">AXIS — DENSE MESH</text>
        </g>
        {/* Red tilt axis */}
        <line x1="150" y1="45" x2="250" y2="235" stroke="#e8553d" strokeWidth="1.2" strokeDasharray="5 4" />
        <circle cx="154" cy="48" r="4" fill="#e8553d" />
        <circle cx="246" cy="232" r="4" fill="#e8553d" />
      </svg>
      <span className="spec">AXIS — SECURE TRANSMISSION</span>
    </div>
  );
};
