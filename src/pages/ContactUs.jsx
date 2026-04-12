import React, { useState } from 'react';

const STATUS_CONFIG = {
    loading: {
        bg: '#f0f4ff',
        border: '#c7d7ff',
        color: '#2a4dbf',
        icon: null,
        text: 'Sending your message…',
    },
    success: {
        bg: '#f0faf4',
        border: '#86efac',
        color: '#166534',
        icon: '✓',
        text: 'Message sent! Check your inbox for a confirmation email.',
    },
    error: null,
};

const inputStyle = {
    padding: '13px 16px',
    borderRadius: '7px',
    border: '1.5px solid var(--border-color)',
    backgroundColor: 'transparent',
    color: 'var(--text-primary)',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: "'Syne', 'Tajawal', sans-serif",
};

const ContactUs = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState(null);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setStatus('loading');
        setError('');

        try {
            let response, data;

            if (import.meta.env.DEV && import.meta.env.VITE_GOOGLE_SHEET_API) {
                const url = `${import.meta.env.VITE_GOOGLE_SHEET_API}?name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}&message=${encodeURIComponent(formData.message)}`;
                response = await fetch(url);
                data = await response.json();
            } else {
                response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                data = await response.json();
            }

            if (data.status === 'success') {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setStatus(null), 6000);
            } else {
                throw new Error(data.message || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            setStatus('error');
            setError(err.message);
            setTimeout(() => setStatus(null), 6000);
        }
    }

    const cfg = status && status !== 'error' ? STATUS_CONFIG[status] : null;

    return (
        <section
            id="contact"
            style={{ padding: '80px 20px', backgroundColor: 'var(--bg-primary)', transition: 'background-color 0.3s ease' }}
        >
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                {/* Heading */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '36px', color: 'var(--text-primary)', marginBottom: '12px', fontWeight: '800', fontFamily: "'Syne', 'Tajawal', sans-serif" }}>
                        Get in Touch
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '17px', fontFamily: "'Syne', 'Tajawal', sans-serif", maxWidth: '480px', margin: '0 auto', lineHeight: '1.6' }}>
                        Have a question or suggestion? Send us a message and we'll get back to you within 1–2 business days.
                    </p>
                </div>

                {/* Card */}
                <div style={{ backgroundColor: 'var(--bg-primary)', padding: '40px', borderRadius: '14px', border: '1px solid var(--border-color)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', transition: 'all 0.3s ease' }}>

                    {/* Status banners */}
                    {cfg && (
                        <div style={{ marginBottom: '28px', padding: '14px 18px', background: cfg.bg, border: `1.5px solid ${cfg.border}`, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {cfg.icon && (
                                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: cfg.color, color: '#fff', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: '700' }}>
                                    {cfg.icon}
                                </span>
                            )}
                            {status === 'loading' && (
                                <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: `2px solid ${cfg.border}`, borderTopColor: cfg.color, display: 'inline-block', flexShrink: 0, animation: 'spin 0.8s linear infinite' }} />
                            )}
                            <span style={{ fontSize: '14px', color: cfg.color, fontWeight: '500', fontFamily: "'Syne', 'Tajawal', sans-serif" }}>{cfg.text}</span>
                        </div>
                    )}

                    {status === 'error' && (
                        <div style={{ marginBottom: '28px', padding: '14px 18px', background: '#fff5f5', border: '1.5px solid #fca5a5', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#dc2626', color: '#fff', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: '700', marginTop: '1px' }}>!</span>
                            <div>
                                <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: '600', color: '#991b1b', fontFamily: "'Syne', 'Tajawal', sans-serif" }}>Delivery failed</p>
                                <p style={{ margin: 0, fontSize: '13px', color: '#b91c1c', fontFamily: "'Syne', 'Tajawal', sans-serif" }}>{error || 'Something went wrong. Please try again.'}</p>
                            </div>
                        </div>
                    )}

                    {/* Spinner keyframe & mobile flex styles */}
                    <style>{`
                        @keyframes spin { to { transform: rotate(360deg); } }
                        .contact-row { display: flex; flex-wrap: wrap; gap: 22px; }
                        .contact-field { flex: 1 1 calc(50% - 11px); display: flex; flex-direction: column; gap: 7px; }
                        @media (max-width: 600px) {
                            .contact-field { flex: 1 1 100%; }
                        }
                    `}</style>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                        <div className="contact-row">
                            {/* Name */}
                            <div className="contact-field">
                                <label htmlFor="name" style={{ color: 'var(--text-secondary)', fontWeight: '600', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'Syne', 'Tajawal', sans-serif" }}>
                                    Full Name
                                </label>
                                <input
                                    type="text" id="name" name="name"
                                    value={formData.name} onChange={handleChange} required
                                    placeholder="e.g. Hanni Massi"
                                    style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                                    onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                                />
                            </div>
                            {/* Email */}
                            <div className="contact-field">
                                <label htmlFor="email" style={{ color: 'var(--text-secondary)', fontWeight: '600', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'Syne', 'Tajawal', sans-serif" }}>
                                    Email Address
                                </label>
                                <input
                                    type="email" id="email" name="email"
                                    value={formData.email} onChange={handleChange} required
                                    placeholder="you@example.com"
                                    style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                                    onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                                />
                            </div>
                        </div>

                        {/* Message */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                            <label htmlFor="message" style={{ color: 'var(--text-secondary)', fontWeight: '600', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'Syne', 'Tajawal', sans-serif" }}>
                                Your Message
                            </label>
                            <textarea
                                id="message" name="message"
                                value={formData.message} onChange={handleChange} required rows={5}
                                placeholder="How can we help you?"
                                style={{ ...inputStyle, resize: 'vertical', minHeight: '130px' }}
                                onFocus={e => e.target.style.borderColor = '#6366f1'}
                                onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            style={{
                                padding: '15px 28px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: status === 'loading' ? '#a5b4fc' : '#4f46e5',
                                color: '#ffffff',
                                fontSize: '15px',
                                fontWeight: '600',
                                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                                transition: 'background-color 0.2s, transform 0.1s',
                                letterSpacing: '0.02em',
                                fontFamily: "'Syne', 'Tajawal', sans-serif",
                                alignSelf: 'flex-start',
                            }}
                            onMouseEnter={e => { if (status !== 'loading') e.target.style.backgroundColor = '#3730a3'; }}
                            onMouseLeave={e => { if (status !== 'loading') e.target.style.backgroundColor = '#4f46e5'; }}
                            onMouseDown={e => { if (status !== 'loading') e.target.style.transform = 'scale(0.98)'; }}
                            onMouseUp={e => { e.target.style.transform = 'scale(1)'; }}
                        >
                            {status === 'loading' ? 'Sending…' : 'Send Message →'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ContactUs;