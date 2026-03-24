import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimationBar from '../components/Layout/animationBar';
import JobCard from '../components/Jobs/JobCard';

const Jobs = () => {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const JOOBLE_API_KEY = import.meta.env.VITE_JOOBLE_API_KEY;
      const isDev = import.meta.env.DEV;

      let response;
      // We explicitly pass resultonpage: 50 to get a larger pool to cleanly filter
      const joobleParams = {
        keywords: jobTitle || "remote",
        location: location,
        resultonpage: 50
      };

      if (isDev && JOOBLE_API_KEY && JOOBLE_API_KEY !== 'your_jooble_api_key_here') {
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(`https://jooble.org/api/${JOOBLE_API_KEY}`)}`;
        response = await fetch(proxyUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(joobleParams)
        });
      } else {
        response = await fetch('/api/jooble', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(joobleParams)
        });
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        throw new Error('API routing error. Please restart your dev server after adding your API key.');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch jobs. Please try again later.');
      }

      if (data && data.jobs && data.jobs.length > 0) {
        // ENHANCEMENT: Aggressive Client-Side Filtering
        // 1. Remove jobs with no usable title or snippet
        let qualityJobs = data.jobs.filter(job => job.title && job.snippet && job.snippet.length > 20);

        // 2. Remove duplicates (Jooble frequently returns identical listings)
        const uniqueKeys = new Set();
        qualityJobs = qualityJobs.filter(job => {
          const key = `${job.title}-${job.company}`.toLowerCase();
          if (uniqueKeys.has(key)) return false;
          uniqueKeys.add(key);
          return true;
        });

        // 3. Sort by recency
        const sortedJobs = qualityJobs.sort((a, b) => {
          const dateA = new Date(a.updated || 0);
          const dateB = new Date(b.updated || 0);
          return dateB - dateA; // Descending
        });

        setFilteredJobs(sortedJobs);
      } else {
        setFilteredJobs([]);
      }
    } catch (err) {
      setError(err.message);
      setFilteredJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <>
      <style>{`
        .jobs-page {
          min-height: 100vh;
          background-color: var(--bg-primary, #0c0c0c);
          padding-bottom: 60px;
        }
        .jobs-header {
          padding: 80px 20px 60px 20px;
          text-align: center;
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
        }
        .search-container {
          max-width: 800px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 20px;
          border-radius: 16px;
          display: flex;
          gap: 15px;
          align-items: center;
          backdrop-filter: blur(10px);
        }
        @media (max-width: 768px) {
          .search-container {
            flex-direction: column;
          }
        }
        .input-group {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
        }
        .search-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
          padding: 12px 0;
          font-size: 16px;
          font-family: 'Syne', sans-serif;
          outline: none;
          transition: border-color 0.3s;
          color: #e84545;
        }
        .search-input:focus {
          border-color: #e84545;
          color: #e84545;
        }
        .search-input::placeholder {
          color: #666;
        }
        .search-btn {
          background-color: #e84545;
          color: white;
          border: none;
          padding: 0 40px;
          height: 50px;
          border-radius: 8px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        @media (max-width: 768px) {
          .search-btn {
            width: 100%;
            margin-top: 10px;
          }
        }
        .search-btn:hover {
          background-color: white;
          color: black;
        }
        .search-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .jobs-results {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 20px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 25px;
        }
        .results-count {
          max-width: 1100px;
          margin: 0 auto 20px auto;
          padding: 0 20px;
          color: #999;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
        }
        .status-message {
          text-align: center;
          color: #999;
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          padding: 60px 20px;
        }
        .spinner {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(255,255,255,0.1);
          border-radius: 50%;
          border-top-color: #e84545;
          animation: spin 1s ease-in-out infinite;
          margin: 0 auto 20px auto;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
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
          <h1>Find Your <span>Dream</span> Role</h1>
          <p>Search thousands of remote tech jobs matching your resume and land your next big career move today.</p>

          <form className="search-container" onSubmit={handleSearch}>
            <div className="input-group">
              <input
                type="text"
                className="search-input"
                placeholder="Job title, keywords, or company..."
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                className="search-input"
                placeholder="Location (e.g., Remote, USA, Europe)..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button type="submit" className="search-btn" disabled={loading}>
              {loading ? "Searching..." : "Search Jobs"}
            </button>
          </form>
        </div>

        {loading ? (
          <div className="status-message">
            <div className="spinner"></div>
            Searching for the best remote opportunities...
          </div>
        ) : error ? (
          <div className="status-message" style={{ color: '#e84545' }}>
            {error}
          </div>
        ) : hasSearched && filteredJobs.length === 0 ? (
          <div className="status-message">
            No jobs found matching your criteria. Try adjusting your search!
          </div>
        ) : filteredJobs.length > 0 ? (
          <>
            <div className="results-count">
              {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
            </div>
            <div className="jobs-results">
              {filteredJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </>
        ) : (
          <div className="status-message">
            Search for jobs above to get started.
          </div>
        )}
      </div>
    </>
  );
};

export default Jobs;