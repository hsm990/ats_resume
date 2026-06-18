const FormInput = ({ label, required, optional, error, value, onChange, placeholder, type = "text", onClearError }) => (
    <div className="form-group">
        <label>
            {label} {required && <span className="req">*</span>}
            {optional && <span className="opt">({optional})</span>}
        </label>
        <input
            type={type}
            placeholder={placeholder}
            className={error ? "input-err" : ""}
            value={value}
            onChange={(e) => {
                onChange(e.target.value);
                if (onClearError && e.target.value.trim()) onClearError();
            }}
        />
        {error && <span className="err-msg">{error}</span>}
    </div>
);

export default FormInput;
