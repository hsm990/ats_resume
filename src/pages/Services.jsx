import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { InfoContext } from '../context/infoContext';
import AnimationBar from '../components/Layout/animationBar';
import LanguageModal from '../components/common/LanguageModal';

const Services = () => {
  const navigate = useNavigate();
  const [showLangModal, setShowLangModal] = useState(false);
  const { updateResumeLanguage } = useContext(InfoContext);

  const handleLanguageSelect = (lang) => {
    updateResumeLanguage(lang);
    setShowLangModal(false);
    navigate("/builder");
  };

  const services = [
    {
      id: "01",
      title: "Build Resume",
      description: "Create a professional, ATS-friendly resume from scratch using our intuitive builder.",
      path: "builder",
      color: "#e84545"
    },
    {
      id: "02",
      title: "Find Remote Jobs",
      description: "Discover high-quality remote opportunities perfectly suited for your skills.",
      path: "/jobs",
      color: "#e84545"
    },
    {
      id: "03",
      title: "Skill Recommendations",
      description: "Get curated roadmaps and resources to level up your career.",
      path: "/skill-recommendations",
      color: "#e84545"
    }
  ];

  const handleServiceClick = (path) => {
    if (path === "builder") {
      setShowLangModal(true);
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <style>{`
        .services-page {
          min-height: 100vh;
          background-color: var(--bg-primary);
          padding-bottom: 80px;
        }
        .services-header {
          padding: 80px 20px 40px 20px;
          text-align: center;
        }
        .services-header h1 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(36px, 5vw, 56px);
          color: var(--text-primary);
          margin-bottom: 20px;
        }
        .services-header h1 span {
          color: #e84545;
          font-style: italic;
          font-family: 'Instrument Serif', serif;
        }
        .services-header p {
          color: var(--text-secondary);
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          max-width: 600px;
          margin: 0 auto;
        }
        .services-grid {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 20px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }
        .service-card {
          background: transparent;
          border: 1px solid currentColor;
          border-radius: 16px;
          padding: 40px 30px;
          text-align: left;
          cursor: pointer;
          transition: all 0.4s ease;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          position: relative;
          overflow: hidden;
        }
        .service-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: currentColor;
          opacity: 0.8;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s ease;
        }
        .service-card:hover::before {
          transform: scaleX(1);
        }
        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.05);
          /* border color already set to currentColor */
        }
        body.dark .service-card:hover {
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .service-id {
          font-family: 'Syne Mono', monospace;
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 25px;
          opacity: 0.7;
          letter-spacing: 2px;
        }
        .service-card:hover .service-id {
          color: currentColor;
          opacity: 1;
        }
        .service-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(20px, 2.5vw, 26px);
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 15px;
          line-height: 1.1;
          word-break: break-word;
          hyphens: auto;
        }
        .service-desc {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 30px;
          flex-grow: 1;
        }
        .service-btn {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 15px;
          color: var(--text-primary);
          background: transparent;
          border: 1px solid var(--text-primary);
          border-radius: 8px;
          padding: 8px 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s;
          margin-top: auto;
        }
        .service-card:hover .service-btn {
          gap: 15px;
          color: var(--bg-primary);
          background: var(--text-primary);
        }

      `}</style>

      <div className="services-page">
        <AnimationBar />

        <div className="services-header">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="back-btn"
            style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '30px', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
          >
            ← Return to Home
          </button>
          <h1>Explore <span>Services</span></h1>
          <p>Everything you need to build your career, optimize your chances, and land your next role.</p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <div
              key={service.id}
              className="service-card"
              onClick={() => handleServiceClick(service.path)}
              style={{ color: service.color }}
            >
              <div className="service-id">{service.id}</div>
              <h2 className="service-title" style={{ color: 'var(--text-primary)' }}>{service.title}</h2>
              <p className="service-desc">{service.description}</p>
              <div className="service-btn">
                <span>Explore</span> <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <LanguageModal
        show={showLangModal}
        onClose={() => setShowLangModal(false)}
        onSelect={handleLanguageSelect}
      />
    </>
  );
};

export default Services;
