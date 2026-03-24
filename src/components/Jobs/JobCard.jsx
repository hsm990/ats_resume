import React from 'react';

const JobCard = ({ job }) => {
  // Format the date
  const pubDate = new Date(job.updated || new Date());
  const timeAgo = Math.floor((new Date() - pubDate) / (1000 * 60 * 60 * 24)); // Days ago
  const dateString = timeAgo === 0 ? 'Today' : timeAgo === 1 ? '1 day ago' : `${timeAgo} days ago`;

  // Create markup for Jooble snippet which contains basic bold tags
  const createSnippetMarkup = () => {
    return { __html: job.snippet || 'No description provided.' };
  };

  return (
    <>
      <style>{`
        .job-card {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 25px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.3s ease, background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
          font-family: 'Syne', sans-serif;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .job-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
          border-color: rgba(232, 69, 69, 0.4);
        }
        
        .job-card-header {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .company-logo {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          object-fit: contain;
          background: white;
          padding: 5px;
        }
        .company-fallback {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          background: #e84545;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 800;
          color: white;
        }

        .job-meta {
          flex: 1;
        }
        .company-name {
          color: var(--text-secondary);
          font-size: 14px;
          margin: 0 0 5px 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .job-title {
          color: var(--text-primary);
          font-size: 20px;
          font-weight: 700;
          margin: 0;
          line-height: 1.2;
        }
        
        .job-snippet {
          color: var(--text-secondary);
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 20px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .job-snippet b {
          color: var(--text-primary);
        }

        .job-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 25px;
        }
        .tag {
          background: rgba(150, 150, 150, 0.1);
          color: var(--text-secondary);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        .tag.location {
          background: rgba(232, 69, 69, 0.15);
          color: #e84545;
        }

        .job-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--border-color);
          padding-top: 20px;
        }
        .post-date {
          color: var(--text-secondary);
          font-size: 13px;
        }
        
        .apply-btn {
          background-color: transparent;
          color: var(--text-primary);
          border: 1px solid var(--text-primary);
          padding: 8px 20px;
          border-radius: 6px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
          text-decoration: none;
        }
        .apply-btn:hover {
          background-color: var(--text-primary);
          color: var(--bg-primary);
        }
      `}</style>

      <div className="job-card">
        <div>
          <div className="job-card-header">
            <div className="company-fallback">{(job.source || job.company || 'J').charAt(0)}</div>
            <div className="job-meta">
              <p className="company-name">{job.source || job.company || 'Confidential'}</p>
              <h3 className="job-title">{job.title}</h3>
            </div>
          </div>
          
          <div className="job-snippet" dangerouslySetInnerHTML={createSnippetMarkup()}></div>

          <div className="job-tags">
            <span className="tag location">{job.location || 'Remote'}</span>
            <span className="tag">{job.type || 'Full-Time'}</span>
          </div>
        </div>

        <div className="job-card-footer">
          <span className="post-date">{dateString}</span>
          <a href={job.link} target="_blank" rel="noopener noreferrer" className="apply-btn">
            Apply Now
          </a>
        </div>
      </div>
    </>
  );
};

export default JobCard;
