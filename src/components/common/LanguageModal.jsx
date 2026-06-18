const LanguageModal = ({ show, onClose, onSelect }) => {
    if (!show) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <style>{`
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
                    .lang-buttons {
                        display: flex;
                        gap: 15px;
                        justify-content: center;
                        margin-bottom: 20px;
                    }
                    .lang-btn {
                        padding: 12px 30px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        background: none;
                        border: 2px solid var(--text-primary);
                        color: var(--text-primary);
                        border-radius: 6px;
                        font-family: 'Syne', sans-serif;
                        transition: all 0.2s;
                    }
                    .lang-btn:hover {
                        background: var(--text-primary);
                        color: var(--bg-primary);
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
                    .modal-close:hover { opacity: 0.9; }
                `}</style>
                <h2 className="modal-title">Choose Language</h2>
                <p className="modal-desc">Select the language for your resume</p>
                <div className="lang-buttons">
                    <button className="lang-btn" onClick={() => onSelect('en')}>English</button>
                    <button className="lang-btn" onClick={() => onSelect('fr')}>Français</button>
                </div>
                <button className="modal-close" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default LanguageModal;
