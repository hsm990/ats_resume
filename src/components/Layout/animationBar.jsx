export default function AnimationBar() {
  const TICKER_ITEMS = [
    "ATS SCORE ANALYZER",
    "KEYWORD MATCHING",
    "BULLET REWRITES",
    "PDF EXPORT",
    "AI-POWERED",
    "GEMINI API",
    "BEAT THE BOTS",
  ];

  const TickerTrack = () => (
    <div className="ticker-track">
      {TICKER_ITEMS.map((item, index) => (
        <span key={index} className="ticker-item">
          <span className="ticker-dot">✦</span>
          {item}
        </span>
      ))}
    </div>
  );

  return (
    <div className="ticker-container bg-black text-white py-4">
      <style>{`
        .ticker-container {
          overflow: hidden;
          white-space: nowrap;
          display: flex;
          user-select: none;
        }

        .ticker-wrapper {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          min-width: 100%;
          animation: scroll 30s linear infinite;
        }

        .ticker-track {
          display: flex;
          align-items: center;
          justify-content: space-around;
          /* Ensure there is a consistent gap between items */
          gap: 40px; 
          padding-right: 40px; /* This must match the gap exactly */
        }

        .ticker-item {
          display: flex;
          align-items: center;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 2px;
          color: white;
        }

        .ticker-dot {
          color: #ff4757;
          margin-right: 12px;
        }

        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }

        .ticker-container:hover .ticker-wrapper {
          animation-play-state: paused;
        }
      `}</style>

      <div className="ticker-wrapper">
        <TickerTrack />
      </div>
      <div className="ticker-wrapper" aria-hidden="true">
        <TickerTrack />
      </div>
    </div>
  );
}