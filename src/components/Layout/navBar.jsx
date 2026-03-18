import { Link } from "react-router-dom";
import Switch from "../common/switch";
import logo from "../../assets/logo.png"

export const Navbar = () => (
    <>
        <style>{`
            .navbar {
                display: flex;
                width: 100%;
                padding: 16px 80px;
                justify-content: center;
                gap: 128px;
                align-items: center;
                border-bottom: 1px solid var(--border-color, #e5e7eb);
                background-color: var(--bg-primary);
                transition: background-color 0.3s ease, border-color 0.3s ease;
            }
            .navbar-logo {
                font-weight: 700;
                font-size: 24px;
            }
            .navbar-links {
                display: flex;
                gap: 24px;
                align-items: center;
                justify-content: center;
            }
            .navbar-link {
                font-family: 'Instrument Serif', serif;
                color: var(--text-secondary);
                font-size: 21px;
                transition: color 0.3s ease;
                text-decoration: none;
                font-weight: 500;
            }
            .navbar-link:hover {
                color: var(--text-primary);
            }
            .navbar-actions {
                display: flex;
                gap: 16px;
                align-items: center;
                justify-content: center;
            }

            @media (max-width: 768px) {
                .navbar {
                    flex-direction: column;
                    gap: 20px;
                    padding: 16px 20px;
                }
                .navbar-links {
                    flex-wrap: wrap;
                    gap: 16px;
                }
            }
        `}</style>
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                <img src={logo} alt="Logo" style={{ width: "100px", height: "50px" }} />
            </Link>
            <div className="navbar-links">
                <Link to="/how-it-works" className="navbar-link">How it works</Link>
                <Link to="/who-we-are" className="navbar-link">Who we are</Link>
                <Link to="/contact-us" className="navbar-link">Contact us</Link>
            </div>
            <div className="navbar-actions">
                <Switch />
            </div>
        </nav>
    </>
);