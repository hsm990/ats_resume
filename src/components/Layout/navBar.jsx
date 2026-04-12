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
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid var(--border-color, #e5e7eb);
                background-color: var(--bg-primary);
                transition: background-color 0.3s ease, border-color 0.3s ease;
            }
            .logo-text {
                font-family: 'Syne', sans-serif;
                font-weight: 800;
                font-size: 28px;
                letter-spacing: -1px;
            }
            .navbar-actions {
                display: flex;
                gap: 16px;
                align-items: center;
                justify-content: center;
            }

            @media (max-width: 768px) {
                .navbar {
                    padding: 16px 20px;
                    flex-wrap: wrap;
                }
                .logo-text {
                    font-size: 22px;
                }
            }
        `}</style>
        <nav className="navbar">
            <Link to="/" className="navbar-logo" style={{ textDecoration: 'none', color: 'var(--text-primary)' }}>
                <span className="logo-text">Your<span style={{ color: '#e84545' }}> career</span></span>
            </Link>

            <div className="navbar-actions">
                <Switch />
            </div>
        </nav>
    </>
);