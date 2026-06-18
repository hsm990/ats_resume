const FormTextarea = ({ label, value, onChange, placeholder, rows, style, children }) => (
    <div className="form-group full-width">
        {label && (
            <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{label}</span>
                {children}
            </label>
        )}
        <textarea
            placeholder={placeholder}
            style={{
                padding: "12px 15px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "15px",
                outline: "none",
                transition: "border-color 0.2s",
                resize: "vertical",
                fontFamily: "'Syne',sans-serif",
                ...style
            }}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
        />
    </div>
);

export default FormTextarea;
