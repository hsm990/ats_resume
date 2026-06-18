const AiButton = ({ loadKey, loadingMap, onClick, label = "✦ AI Suggest" }) => {
    const isLoading = loadingMap?.[loadKey];
    return (
        <button
            type="button"
            disabled={!!isLoading}
            onClick={onClick}
            style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "5px 12px",
                background: isLoading ? "#c4b5fd" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
                color: "#fff", border: "none", borderRadius: 5,
                fontSize: 11, fontWeight: 700,
                fontFamily: "'Syne',sans-serif",
                cursor: isLoading ? "not-allowed" : "pointer",
                letterSpacing: 0.3, flexShrink: 0,
                transition: "opacity .2s",
            }}
        >
            {isLoading
                ? <span style={{ width: 10, height: 10, border: "2px solid rgba(255,255,255,.4)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "ai-spin .6s linear infinite" }} />
                : null}
            {isLoading ? "Generating..." : label}
        </button>
    );
};

export default AiButton;
