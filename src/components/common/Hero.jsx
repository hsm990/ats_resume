import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { InfoContext } from "../../context/infoContext";
import LanguageModal from "./LanguageModal";

const Hero = () => {
  const [showLangModal, setShowLangModal] = useState(false);
  const { updateResumeLanguage } = useContext(InfoContext);
  const navigate = useNavigate();

  const handleLanguageSelect = (lang) => {
    updateResumeLanguage(lang);
    setShowLangModal(false);
    navigate("/builder");
  };

  return (
    <>
      <style>{`
        .hero-section {
          position: relative;
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 60px 20px 80px;
          overflow: hidden;
          background-color: var(--bg-primary);
        }

        .hero-bg-glow {
          position: absolute;
          top: -20%;
          right: -10%;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(232,69,69,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-bg-glow-2 {
          position: absolute;
          bottom: -20%;
          left: -10%;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border: 1px solid var(--border-color);
          border-radius: 100px;
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
          color: var(--text-secondary);
          margin-bottom: 32px;
          transition: all 0.3s ease;
          cursor: default;
        }
        .hero-badge:hover {
          border-color: #e84545;
          color: #e84545;
        }
        .hero-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .hero-heading {
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .hero-subtitle {
          color: #797979;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 20px;
          position: relative;
          display: inline-block;
        }
        .hero-subtitle::before {
          content: "";
          position: absolute;
          top: 50%;
          right: calc(100% + 16px);
          width: 24px;
          height: 2px;
          background-color: #e84545;
        }
        .hero-subtitle::after {
          content: "";
          position: absolute;
          top: 50%;
          left: calc(100% + 16px);
          width: 24px;
          height: 2px;
          background-color: #e84545;
        }

        .hero h1 {
          font-weight: 800;
          font-size: clamp(56px, 6.5vw, 92px);
          line-height: 0.95;
          letter-spacing: -3px;
          color: var(--text-primary);
          margin-bottom: 8px;
          font-family: 'Syne', sans-serif;
        }
        .hero .h1-span {
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          font-weight: 400;
          color: #e84545;
          letter-spacing: -2px;
        }
        .hero h1.hero-title-outline {
          -webkit-text-stroke: 2px var(--text-primary);
          color: transparent;
          margin-bottom: 25px;
        }

        .hero-tagline {
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          color: var(--text-secondary);
          max-width: 480px;
          margin: 16px auto 0;
          line-height: 1.6;
        }

        .button-container {
          margin-top: 48px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
        }

        .button {
          padding: 0 40px;
          height: 54px;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          box-sizing: border-box;
          border-radius: 6px;
          transition: all 0.3s ease;
          text-decoration: none;
          letter-spacing: 0.3px;
        }
        .button.first {
          background-color: #e84545;
          border: 1px solid transparent;
          color: white;
        }
        .button.first:hover {
          background-color: var(--text-primary);
          color: var(--bg-primary);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        .button.second {
          border: 1px solid var(--text-primary);
          color: var(--text-primary);
          background-color: transparent;
          position: relative;
          overflow: hidden;
        }
        .button.second::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 0;
          height: 100%;
          background-color: var(--text-primary);
          transition: width 0.4s ease;
          z-index: 0;
        }
        .button.second:hover::before {
          width: 100%;
        }
        .button.second:hover {
          color: var(--bg-primary);
          transform: translateY(-2px);
        }
        .button.second span {
          position: relative;
          z-index: 1;
        }

        .button.primary {
          background-color: var(--text-primary);
          color: var(--bg-primary);
          border: 1px solid var(--text-primary);
        }
        .button.primary:hover {
          opacity: 0.85;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 40px 16px 60px;
            min-height: auto;
          }
          .hero h1 {
            font-size: 42px !important;
            letter-spacing: -1.5px;
          }
          .hero-subtitle::before,
          .hero-subtitle::after {
            display: none;
          }
          .button-container {
            flex-direction: column;
            gap: 12px;
            margin-top: 36px;
            width: 100%;
          }
          .button-container a, .button-container button {
            width: 100%;
          }
          .button {
            width: 100%;
            height: 48px;
            font-size: 14px;
          }
          .hero-bg-glow, .hero-bg-glow-2 {
            width: 300px;
            height: 300px;
          }
        }
      `}</style>

      <section className="hero-section">
        <div className="hero-bg-glow" />
        <div className="hero-bg-glow-2" />

        <div className="hero-badge">
          <span className="hero-badge-dot" />
          AI-Powered ATS Optimization
        </div>

        <div className="hero-heading">
          <span className="hero-subtitle">Next-Generation Career Tools</span>
          <div className="hero">
            <h1 style={{ marginTop: "20px" }}>ELEVATE</h1>
            <h1>YOUR <span className="h1-span">POTENTIAL</span></h1>
            <h1 className="hero-title-outline">LAND</h1>
            <h1>THE JOB.</h1>
          </div>
          <p className="hero-tagline">
            Build ATS-optimized resumes, match keywords, and land more interviews with AI-powered tools.
          </p>
        </div>

        <div className="button-container">
          <Link to="/services" style={{ textDecoration: 'none' }}>
            <button className="button first">
              <span>Start Free →</span>
            </button>
          </Link>
          <Link to="/contact" style={{ textDecoration: 'none' }}>
            <button className="button second">
              <span>Contact with us →</span>
            </button>
          </Link>
        </div>
      </section>

      <LanguageModal
        show={showLangModal}
        onClose={() => setShowLangModal(false)}
        onSelect={handleLanguageSelect}
      />
    </>
  )
}

export default Hero;
