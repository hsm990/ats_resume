import { useState } from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <style>{`
        .hero {
            height: 600px;
            display: flex;
            align-items: center;
            justify-content: start;
            text-align: center;
            flex-direction: column;
            padding-top: 100px;
        }
            .hero .span {
                color: #797979;
                position: relative;
                font-family: 'Syne', sans-serif;
            }
            .hero .span:before {
                content: "";
                position: absolute;
                top: 50%;
                left: -25px;
                width: 20px;
                height: 2px;
                background-color: #e84545;
                z-index: -1;
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
          .button-container {
            margin-top: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
          }
          .button {
            color: white;
            padding: 0 40px;
            height: 52px;
            cursor: pointer;
            font-family: 'Syne', sans-serif;
            font-size: 16px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            white-space: nowrap;
            box-sizing: border-box;
          }
            .button.first {
              background-color: #e84545;
              border: 1px solid transparent;
              transition: all 0.4s ease-in-out;
            }
              .button.first:hover {
                background-color: var(--text-primary);
                color: var(--bg-primary);
                border-color: var(--text-primary);
              }
 

            .button.second {
             border: 1px solid var(--text-primary);
             color: var(--text-primary);
             background-color: transparent;
             position: relative;
            }
            .button.second:before {
            content:"";
            position:absolute;
            left:0;
            top:0;
            width:0;
            height:100%;
            background-color:var(--text-primary);
            z-index:-1;
            transition: all 0.4s ease-in-out;
            }
            .button.second:hover:before {
              width:100%;
              height:100%;
            }
              .button.second:hover{
                color:var(--bg-primary);
              }
              
              /* Responsiveness */
              @media (max-width: 768px) {
                  .hero {
                      padding-top: 60px;
                      padding-bottom: 60px;
                      height: auto;
                  }
                  .hero h1 {
                      font-size: 48px !important;
                  }
                  .button-container {
                      flex-direction: column;
                      gap: 15px;
                      margin-top: 40px;
                      width: 100%;
                      padding: 0 20px;
                  }
                  .button-container a {
                      width: 100%;
                      text-decoration: none;
                  }
                  .button {
                      margin: 0;
                      width: 100%;
                  }
              }

              /* Modal Styles */
              .modal-overlay {
                  position: fixed;
                  top: 0; left: 0; right: 0; bottom: 0;
                  background: rgba(0, 0, 0, 0.6);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  z-index: 1000;
                  backdrop-filter: blur(4px);
              }
              .modal-content {
                  background-color: var(--bg-primary);
                  padding: 40px;
                  border-radius: 12px;
                  text-align: center;
                  max-width: 400px;
                  width: 90%;
                  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                  border: 1px solid var(--border-color, #444);
              }
              .modal-title {
                  font-size: 24px;
                  font-weight: 800;
                  margin-bottom: 10px;
                  color: var(--text-primary);
                  font-family: 'Syne', sans-serif;
              }
              .modal-desc {
                  font-size: 16px;
                  color: var(--text-secondary, #999);
                  margin-bottom: 25px;
                  font-family: 'Syne', sans-serif;
              }
              .modal-close {
                  background-color: #e84545;
                  color: white;
                  padding: 10px 24px;
                  border: none;
                  border-radius: 6px;
                  font-weight: 700;
                  cursor: pointer;
                  font-family: 'Syne', sans-serif;
                  transition: opacity 0.2s;
              }
              .modal-close:hover {
                  opacity: 0.9;
              }
    `}</style>
      <div className="hero">
        <span className="span" >AI-Powered Resume Optimization</span>
        <h1 style={{ marginTop: "25px" }}>BEAT</h1>
        <h1>THE <span className="h1-span">ATS</span></h1>
        <h1 className="hero-title-outline">LAND</h1>
        <h1>THE JOB.</h1>
        <div className="button-container">
          <Link to="/builder" style={{ textDecoration: 'none' }}><button className="button first"><span >✦ Build My Resume</span></button></Link>
          <button className="button second" onClick={() => setShowModal(true)}>✦ Analyze My Resume</button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Coming Soon!</div>
            <div className="modal-desc">
              Our AI-powered resume analyzer is currently under development. Check back soon for this feature!
            </div>
            <button className="modal-close" onClick={() => setShowModal(false)}>Got it</button>
          </div>
        </div>
      )}
    </>
  )
}
export default Hero