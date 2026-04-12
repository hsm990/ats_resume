import React from 'react';
import { useNavigate } from 'react-router-dom';
import AnimationBar from '../components/Layout/animationBar';

const Jobs = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        .jobs-page {
          min-height: 100vh;
          background-color: var(--bg-primary, #0c0c0c);
          padding-bottom: 60px;
          display: flex;
          flex-direction: column;
        }
        .jobs-header {
          padding: 80px 20px 60px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
        }
        .jobs-header h1 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(36px, 5vw, 56px);
          color: var(--text-primary, #ffffff);
          margin-bottom: 20px;
        }
        .jobs-header h1 span {
          color: #e84545;
          font-style: italic;
          font-family: 'Instrument Serif', serif;
        }
        .jobs-header p {
          color: #999;
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          max-width: 600px;
          margin: 0 auto 40px auto;
          line-height: 1.6;
        }
        .coming-soon-box {
          max-width: 600px;
          margin: 0 auto;
          border: 1px solid rgba(232, 69, 69, 0.2);
          padding: 40px;
          border-radius: 16px;
          backdrop-filter: blur(10px);
        }
        .coming-soon-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }
      `}</style>

      <div className="jobs-page">
        <AnimationBar />

        <div className="jobs-header">
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.7)', color: '#e84545', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '30px', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            ← Return to Home
          </button>

          <div className="coming-soon-box">
            <h1>Job Finder is <span>Coming Soon</span></h1>
            <p>
              We are temporarily disabling the job search to bring you something much more powerful.
              We are actively working on an advanced automated solution using <strong>n8n</strong> to curate and deliver the absolute best remote opportunities tailored just for you.
            </p>
            <p style={{ color: '#e84545', fontWeight: 'bold' }}>
              Stay tuned for the ultimate job hunting experience!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Jobs;