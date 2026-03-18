import { Link } from "react-router-dom"
const Hero = () => {
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
            gap: 20px;
          }
          .button {
            color: white;
            padding: 13px 30px;
            cursor: pointer;
            margin-left:15px;
            margin-right:15px;
            font-family: 'Syne', sans-serif;
            font-size: 16px;
            font-weight: 700;
          }
            .button.first {
              background-color: #e84545;
              transition: all 0.4s ease-in-out;
            }
              .button.first:hover {
                background-color: var(--text-primary);
                color: var(--bg-primary);
              }
 

            .button.second {
             border:1px solid var(--text-primary);
             color:var(--text-primary);
             background-color: transparent;
             position:relative;
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
    `}</style>
      <div className="hero">
        <span className="span" >AI-Powered Resume Optimization</span>
        <h1 style={{ marginTop: "25px" }}>BEAT</h1>
        <h1>THE <span className="h1-span">ATS</span></h1>
        <h1 className="hero-title-outline">LAND</h1>
        <h1>THE JOB.</h1>
        <div className="button-container">
          <Link to="/builder"><button className="button first"><span >✦ Build My Resume</span> </button></Link>
          <button className="button second" onClick={() => alert("Coming Soon!")}>✦ Analyze My Resume</button>
        </div>
      </div>
    </>
  )
}
export default Hero