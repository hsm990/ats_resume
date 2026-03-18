import { useState } from "react";
import { useContext } from "react";
import { InfoContext } from "../context/infoContext";
import AccordionUsage from "../components/Layout/Accordion";
import ResumeTemplate from "./ResumeTemplate";

/* ─────────────────────────────────────────────
   🔑 FREE GEMINI API KEY
   Get yours at: https://aistudio.google.com
   No credit card needed — 15 req/min free
───────────────────────────────────────────── */
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

/* ─────────────────────────────────────────────
   Gemini 3 Flash Preview — free API helper
───────────────────────────────────────────── */
const gemini = async (prompt) => {
    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.4, maxOutputTokens: 1024 }
            })
        }
    );
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
};

const Builder = () => {
    const [activeStep, setActiveStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [aiLoading, setAiLoading] = useState({});   /* { key: bool } */

    const {
        resumeInfo,
        updatePersonalInfo,
        addExperience, removeExperience, updateExperience,
        addEducation, removeEducation, updateEducation,
        updateSkills,
        updateSummary,
        addProject, removeProject, updateProject,
        addLanguage, removeLanguage, updateLanguage,
    } = useContext(InfoContext);

    const pi = resumeInfo.personalInfo || {};
    const exps = resumeInfo.experience || [];
    const edus = resumeInfo.education || [];
    const skls = resumeInfo.skills || { technicalSkills: "", softSkills: "" };
    const prjs = resumeInfo.projects || [];
    const lngs = resumeInfo.languages || [];
    const sum = resumeInfo.summary || "";

    const allSkills = [
        ...(skls.technicalSkills ? skls.technicalSkills.split(",").map(x => x.trim()).filter(Boolean) : []),
        ...(skls.softSkills ? skls.softSkills.split(",").map(x => x.trim()).filter(Boolean) : [])
    ];

    /* ── validation ── */
    const validateStep1 = () => {
        const newErrors = {};
        if (!pi.fullName?.trim()) newErrors.fullName = "Full name is required.";
        if (!pi.jobTitle?.trim()) newErrors.jobTitle = "Job title is required.";
        if (!pi.phone?.trim()) newErrors.phone = "Phone number is required.";
        if (!pi.email?.trim()) {
            newErrors.email = "Email address is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pi.email.trim())) {
            newErrors.email = "Please enter a valid email (e.g. john@email.com).";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const clearError = (field) => setErrors(prev => ({ ...prev, [field]: null }));

    /* ── download ── */
    const handleDownload = () => {
        // Step 1: Add a special print-only class to body to hide the builder UI
        document.body.classList.add('print-mode');
        
        // Step 2: Trigger native browser print dialog
        window.print();
        
        // Step 3: Remove the class after printing is initiated/cancelled
        setTimeout(() => {
            document.body.classList.remove('print-mode');
        }, 500);
    };

    /* ════════════════════════════════════════
       AI SUGGEST HANDLERS — Prompt Engineering
    ════════════════════════════════════════ */

    const setLoading = (key, val) => setAiLoading(p => ({ ...p, [key]: val }));

    /* ── 1. Experience description ── */
    const suggestExpDesc = async (exp) => {
        if (!exp.jobTitle && !exp.company) return alert("Fill in Job Title and Company first.");
        const key = `exp_${exp.id}`;
        setLoading(key, true);
        try {
            const text = await gemini(`
You are an expert resume writer and technical recruiter. Your task is to write impact-driven bullet points for a candidate's work experience.
The bullet points must sound highly professional and should focus on outcomes, technical skills applied, and typical responsibilities for this role.

Write EXACTLY 3 bullet points for the position below. Follow these rules STRICTLY:
1. Format: Output plain text only. Provide EXACTLY 3 lines. DO NOT use bullet points (•), dashes, asterisks, or markdown. Each line should be a self-contained bullet point.
2. Structure: Start every bullet point with a strong, past-tense action verb (e.g., Architected, Engineered, Spearheaded, Optimized, Streamlined, Resolved, Managed).
3. Detail: Describe a realistic task, the tools/technologies used, and a realistic outcome or metric. For example: "Engineered a scalable RESTful API backend using Node.js and Express, improving data retrieval speeds by 20%."
4. Completeness: Ensure every sentence is a FULL, COMPLETE thought and ends with a proper period. Do not under any circumstances leave a sentence unfinished.
5. Length: Each bullet should be detailed, around 15-25 words.

Position: ${exp.jobTitle} at ${exp.company}${exp.location ? `, ${exp.location}` : ""}
Candidate Profile / Target Role: ${pi.jobTitle || "N/A"}
`.trim());
            const cleaned = text
                .split("\n")
                .map(l => l.replace(/^[\s\-•*\d.]+/, "").trim())
                .filter(Boolean)
                .slice(0, 3)
                .join("\n");
            updateExperience(exp.id, "description", cleaned);
        } catch (e) { alert("AI error: " + e.message); }
        setLoading(key, false);
    };

    /* ── 2. Technical skills ── */
    const suggestTechSkills = async () => {
        const key = "tech_skills";
        setLoading(key, true);
        try {
            const expDetails = exps.map(e => `${e.jobTitle} at ${e.company}${e.description ? ` (${e.description.slice(0, 80)})` : ""}`).join(" | ") || "N/A";
            const text = await gemini(`
ROLE: You are a senior technical recruiter and resume strategist. You know exactly which technical skills ATS systems and hiring managers look for in ${pi.jobTitle || "a professional"} roles.

TASK: Suggest exactly 10 technical skills for this candidate's resume.

STRICT RULES:
- Skills must be SPECIFIC tools, languages, frameworks, platforms — not vague concepts
- GOOD examples: React.js, PostgreSQL, Docker, AWS Lambda, Figma, TypeScript, Redis, Kubernetes
- BAD examples: "Programming", "Databases", "Cloud", "Software Development"
- Mix: 4 core hard skills for the role + 3 supporting tools + 3 trending/in-demand skills for this field
- Do NOT repeat skills already listed
- Output format: plain comma-separated list on ONE line, nothing else

CANDIDATE PROFILE:
- Job Title: ${pi.jobTitle || "N/A"}
- Experience: ${expDetails}
- Already listed (DO NOT repeat): ${skls.technicalSkills || "none"}

OUTPUT (comma-separated list only):
            `.trim());
            updateSkills("technicalSkills", text.replace(/\.$/, "").trim());
        } catch (e) { alert("AI error: " + e.message); }
        setLoading(key, false);
    };

    /* ── 3. Soft skills ── */
    const suggestSoftSkills = async () => {
        const key = "soft_skills";
        setLoading(key, true);
        try {
            const expDetails = exps.map(e => `${e.jobTitle} at ${e.company}`).join(", ") || "N/A";
            const text = await gemini(`
ROLE: You are a career coach and resume expert who understands what soft skills matter most for different roles and industries.

TASK: Suggest exactly 6 soft skills for this candidate's resume.

STRICT RULES:
- Skills must be specific and professional — not generic
- GOOD examples: Cross-functional collaboration, Stakeholder communication, Data-driven decision making, Agile project management, Conflict resolution, Executive presentation
- BAD examples: "Teamwork", "Hard worker", "Good communicator", "Fast learner"
- Choose skills that are RELEVANT to the role and would appear in real job descriptions
- Do NOT repeat skills already listed
- Output format: plain comma-separated list on ONE line, nothing else

CANDIDATE PROFILE:
- Job Title: ${pi.jobTitle || "N/A"}
- Experience: ${expDetails}
- Already listed (DO NOT repeat): ${skls.softSkills || "none"}

OUTPUT (comma-separated list only):
            `.trim());
            updateSkills("softSkills", text.replace(/\.$/, "").trim());
        } catch (e) { alert("AI error: " + e.message); }
        setLoading(key, false);
    };

    /* ── 4. Project description ── */
    const suggestProjDesc = async (proj) => {
        if (!proj.projectName) return alert("Fill in the Project Name first.");
        const key = `proj_${proj.id}`;
        setLoading(key, true);
        try {
            const text = await gemini(`
You are an expert technical resume writer. Your task is to write compelling bullet points for a candidate's personal or academic project.

Write EXACTLY 2 bullet points for the project below. Follow these rules STRICTLY:
1. Format: Output plain text only. Provide EXACTLY 2 lines. DO NOT use bullet points (•), dashes, asterisks, or markdown.
2. Content (Bullet 1): Describe what the project actually is and what core technologies were used to build it. Start with a strong action verb (e.g., Developed, Architected).
3. Content (Bullet 2): Describe a specific technical challenge solved, a prominent feature implemented, or a positive performance outcome. Ensure it is realistic.
4. Completeness: Ensure every sentence is a FULL, COMPLETE thought and ends with a proper period. Do not under any circumstances leave a sentence unfinished.
5. Length: Each bullet should be detailed, around 15-25 words.

Project Name: ${proj.projectName}
Link: ${proj.projectLink || "N/A"}
Developer Role: ${pi.jobTitle || "N/A"}
Candidate Skills: ${allSkills.slice(0, 8).join(", ") || "N/A"}
`.trim());
            const cleaned = text
                .split("\n")
                .map(l => l.replace(/^[\s\-•*\d.]+/, "").trim())
                .filter(Boolean)
                .slice(0, 2)
                .join("\n");
            updateProject(proj.id, "projectDescription", cleaned);
        } catch (e) { alert("AI error: " + e.message); }
        setLoading(key, false);
    };

    /* ── 5. Professional summary ── */
    const suggestSummary = async () => {
        setLoading("summary", true);
        try {
            const expDetails = exps.map(e =>
                `${e.jobTitle} at ${e.company}${e.description ? `: ${e.description.slice(0, 120)}` : ""}`
            ).join(" | ") || "N/A";
            const eduDetails = edus.map(e => `${e.degree} from ${e.school}`).join(", ") || "N/A";
            const numJobs = exps.length;
            const text = await gemini(`
You are a professional resume writer. Write a realistic, grounded professional summary — based only on what the candidate has actually done.

Write a 3-sentence professional summary for this candidate.

RULES:
1. Sentence 1: Mention their job title and their core area of expertise. Do NOT invent years of experience — only use the number if it can be calculated from the work history dates provided. If dates are missing just say "experienced" or "professional".
2. Sentence 2: Mention 2–3 of their actual skills from the skills list + reference what they actually did in their roles. Be specific to their real background.
3. Sentence 3: A confident closing statement about the value they bring. Forward-looking, specific to their field.
4. Total: 55–75 words, one paragraph
5. Tone: Professional, confident, no "I" — start with their role or a descriptor
6. BANNED words/phrases: passionate, results-driven, hard worker, team player, motivated, detail-oriented, dynamic, leverage, utilize, synergy
7. Output: one paragraph of plain text only — no labels, no quotes, no bullet points, nothing else

CANDIDATE:
- Job Title: ${pi.jobTitle || "N/A"}
- Work history: ${expDetails}
- Education: ${eduDetails}
- Skills: ${allSkills.slice(0, 10).join(", ") || "N/A"}
- Number of positions: ${numJobs}
`.trim());
            updateSummary(text.trim());
        } catch (e) { alert("AI error: " + e.message); }
        setLoading("summary", false);
    };

    /* ── Reusable AI button ── */
    const AiBtn = ({ loadKey, onClick, label = "✦ AI Suggest" }) => (
        <button
            type="button"
            disabled={!!aiLoading[loadKey]}
            onClick={onClick}
            style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "5px 12px",
                background: aiLoading[loadKey] ? "#c4b5fd" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
                color: "#fff", border: "none", borderRadius: 5,
                fontSize: 11, fontWeight: 700,
                fontFamily: "'Syne',sans-serif",
                cursor: aiLoading[loadKey] ? "not-allowed" : "pointer",
                letterSpacing: 0.3, flexShrink: 0,
                transition: "opacity .2s",
            }}
        >
            {aiLoading[loadKey]
                ? <span style={{ width: 10, height: 10, border: "2px solid rgba(255,255,255,.4)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "ai-spin .6s linear infinite" }} />
                : null}
            {aiLoading[loadKey] ? "Generating..." : label}
        </button>
    );

    return (
        <div className="builder-container">
            <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&display=swap');

            * { box-sizing: border-box; }

            .builder-container {
                height: 100vh;
                width: 100%;
                background-color: #fdfdfd;
                display: flex;
                font-family: 'Syne', sans-serif;
            }

            /* ════ LEFT PANEL ════ */
            .builder-left {
                height: 100vh;
                width: 55%;
                background-color: #ffffff;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                border-right: 1px solid #eee;
                padding-top: 40px;
                flex-direction: column;
                overflow-y: auto;
            }

            /* stepper */
            .builder-left ul {
                list-style: none;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 25px;
                position: relative;
                padding: 0;
                margin-bottom: 60px;
            }
            .builder-left ul li {
                font-size: 14px;
                font-weight: 600;
                color: #999;
                position: relative;
                cursor: pointer;
                width: 105px;
                display: flex;
                justify-content: center;
            }
            .builder-left ul li.active { color: #222; }
            .builder-left ul:before {
                content: "";
                position: absolute;
                bottom: -15px;
                left: 0;
                width: 100%;
                height: 2px;
                background-color: #e0e0e0;
            }
            .builder-left ul li:before {
                content: "";
                position: absolute;
                bottom: -19px;
                left: 50%;
                transform: translateX(-50%);
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: #fff;
                border: 2px solid #e0e0e0;
                z-index: 2;
                transition: all 0.3s ease;
            }
            .builder-left ul li.active:before {
                background-color: #e84545;
                border-color: #e84545;
                animation: dot-pulse 1s ease-in-out infinite;
            }
            @keyframes dot-pulse {
                0%   { transform: translateX(-50%) scale(1);   box-shadow: 0 0 0 0 rgba(232,69,69,0.7); }
                50%  { transform: translateX(-50%) scale(1.2); box-shadow: 0 0 0 4px rgba(232,69,69,0); }
                100% { transform: translateX(-50%) scale(1); }
            }
            .builder-left ul li.done:before {
                background-color: #e84545;
                border-color: #e84545;
            }
            .builder-left ul li.done:after {
                content: "";
                position: absolute;
                bottom: -15px;
                left: 0;
                width: 170%;
                height: 2px;
                background-color: #e84545;
                z-index: 2;
                transition: all 0.3s ease;
            }

            /* form */
            .builder-left-content {
                width: 80%;
                max-width: 600px;
                padding-bottom: 40px;
            }
            .builder-left-content h1 {
                font-size: 28px;
                margin-bottom: 10px;
                color: #1a1a1a;
            }
            .builder-left-content p {
                color: #666;
                margin-bottom: 30px;
                font-size: 14px;
            }
            .form-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
            }
            .form-group {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }
            .form-group.full-width { grid-column: span 2; }
            .form-group label {
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 1px;
                font-weight: 700;
                color: #444;
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .form-group label .req {
                color: #e84545;
                font-size: 14px;
                line-height: 1;
            }
            .form-group label .opt {
                color: #bbb;
                font-size: 10px;
                font-weight: 400;
                text-transform: none;
                letter-spacing: 0;
            }
            .form-group input {
                padding: 12px 15px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 15px;
                font-family: 'Syne', sans-serif;
                outline: none;
                transition: border-color 0.2s, background 0.2s;
            }
            .form-group input:focus { border-color: #222; }
            .form-group input.input-err {
                border-color: #e84545;
                background: #fff8f8;
            }
            .err-msg {
                font-size: 11.5px;
                color: #e84545;
                margin-top: 0;
                font-weight: 500;
            }

            @keyframes shake {
                0%,100% { transform: translateX(0); }
                20%     { transform: translateX(-5px); }
                40%     { transform: translateX(5px); }
                60%     { transform: translateX(-3px); }
                80%     { transform: translateX(3px); }
            }
            .shake { animation: shake 0.35s ease; }

            @keyframes ai-spin { to { transform: rotate(360deg); } }

            .btn-submit {
                margin-top: 30px;
                padding: 15px 40px;
                background-color: #222;
                color: white;
                border: none;
                border-radius: 4px;
                font-weight: 600;
                font-family: 'Syne', sans-serif;
                cursor: pointer;
                transition: opacity 0.2s;
                width: 40%;
            }
            .btn-submit:hover { opacity: 0.9; }
            .btn-back {
                margin-top: 30px;
                padding: 15px 40px;
                background-color: #e84545;
                color: white;
                border: none;
                border-radius: 4px;
                font-weight: 600;
                font-family: 'Syne', sans-serif;
                cursor: pointer;
                transition: opacity 0.2s;
                width: 40%;
            }
            .btn-back:hover { opacity: 0.9; }
            .btn-download {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                width: 100%;
                padding: 16px 0;
                background: #111;
                color: #fff;
                border: none;
                border-radius: 6px;
                font-size: 15px;
                font-weight: 700;
                font-family: 'Syne', sans-serif;
                cursor: pointer;
                letter-spacing: 0.3px;
                margin-bottom: 12px;
                transition: opacity 0.2s;
            }
            .btn-download:hover { opacity: 0.85; }

            /* ════ RIGHT PANEL ════ */
            .builder-right {
                height: 100vh;
                width: 45%;
                background-color: #555; /* Dark background to contrast the white paper */
                display: flex;
                align-items: flex-start;
                justify-content: center;
                position: sticky;
                top: 0;
                overflow-y: auto;
                overflow-x: auto;
                padding: 40px;
            }

            /* Print Mode (ATS Friendly PDF) */
            @media print {
                @page {
                    size: A4 portrait;
                    margin: 0; 
                }
                body {
                    margin: 0;
                    padding: 0;
                    background: white;
                }
                body * {
                    visibility: hidden;
                }
                .builder-right, .builder-right * {
                    visibility: visible;
                }
                .builder-right {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100vw;
                    height: 100vh;
                    padding: 0;
                    margin: 0;
                    background: white;
                    overflow: visible;
                    display: block;
                }
                .cv-paper {
                    box-shadow: none !important;
                    margin: 0 !important;
                    padding: 10mm 15mm !important; /* Proper internal spacing for printing */
                    width: 210mm !important; /* Exact A4 width */
                    height: 297mm !important; /* Exact A4 height */
                    box-sizing: border-box;
                    page-break-after: avoid;
                    page-break-before: avoid;
                    transform: none !important;
                }
            }

            /* checklist (step 8) */
            .checklist-item {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 12px;
            }
            .checklist-circle {
                width: 24px; height: 24px;
                border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                font-size: 12px; font-weight: 700;
                flex-shrink: 0;
                transition: background 0.2s;
            }
            .checklist-circle.done  { background: #222; color: #fff; }
            .checklist-circle.empty { background: #eee; color: #bbb; }
            .checklist-label { font-size: 14px; font-weight: 600; }
            .checklist-label.done  { color: #111; }
            .checklist-label.empty { color: #bbb; font-weight: 400; }
            `}</style>

            {/* ════════ LEFT ════════ */}
            <div className="builder-left">
                <ul>
                    <li className={activeStep === 1 ? "active" : activeStep > 1 ? "done" : ""} onClick={() => setActiveStep(1)}>Personal Info</li>
                    <li className={activeStep === 2 ? "active" : activeStep > 2 ? "done" : ""} onClick={() => setActiveStep(2)}>Experience</li>
                    <li className={activeStep === 3 ? "active" : activeStep > 3 ? "done" : ""} onClick={() => setActiveStep(3)}>Education</li>
                    <li className={activeStep === 4 ? "active" : activeStep > 4 ? "done" : ""} onClick={() => setActiveStep(4)}>Skills</li>
                    <li className={activeStep === 5 ? "active" : activeStep > 5 ? "done" : ""} onClick={() => setActiveStep(5)}>Projects</li>
                    <li className={activeStep === 6 ? "active" : activeStep > 6 ? "done" : ""} onClick={() => setActiveStep(6)}>Languages</li>
                    <li className={activeStep === 7 ? "active" : activeStep > 7 ? "done" : ""} onClick={() => setActiveStep(7)}>Summary</li>
                    <li className={activeStep === 8 ? "active" : activeStep > 8 ? "done" : ""} onClick={() => setActiveStep(8)}>Finalize</li>
                </ul>

                <div className="builder-left-content">

                    {/* ══ STEP 1 — Personal Info (with validation) ══ */}
                    {activeStep === 1 && (
                        <>
                            <h1>Personal Details</h1>
                            <p>Get started with your name and contact information.</p>
                            <div className="form-grid">

                                <div className="form-group">
                                    <label>Full Name <span className="req">*</span></label>
                                    <input
                                        type="text"
                                        placeholder="e.g. John Doe"
                                        className={errors.fullName ? "input-err" : ""}
                                        value={resumeInfo.personalInfo.fullName}
                                        onChange={(e) => {
                                            updatePersonalInfo("fullName", e.target.value);
                                            if (e.target.value.trim()) clearError("fullName");
                                        }}
                                    />
                                    {errors.fullName && <span className="err-msg">{errors.fullName}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Job Title <span className="req">*</span></label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Frontend Developer"
                                        className={errors.jobTitle ? "input-err" : ""}
                                        value={resumeInfo.personalInfo.jobTitle}
                                        onChange={(e) => {
                                            updatePersonalInfo("jobTitle", e.target.value);
                                            if (e.target.value.trim()) clearError("jobTitle");
                                        }}
                                    />
                                    {errors.jobTitle && <span className="err-msg">{errors.jobTitle}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Email Address <span className="req">*</span></label>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        className={errors.email ? "input-err" : ""}
                                        value={resumeInfo.personalInfo.email}
                                        onChange={(e) => {
                                            updatePersonalInfo("email", e.target.value);
                                            if (e.target.value.trim()) clearError("email");
                                        }}
                                    />
                                    {errors.email && <span className="err-msg">{errors.email}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Phone Number <span className="req">*</span></label>
                                    <input
                                        type="tel"
                                        placeholder="+1 234 567 890"
                                        className={errors.phone ? "input-err" : ""}
                                        value={resumeInfo.personalInfo.phone}
                                        onChange={(e) => {
                                            updatePersonalInfo("phone", e.target.value);
                                            if (e.target.value.trim()) clearError("phone");
                                        }}
                                    />
                                    {errors.phone && <span className="err-msg">{errors.phone}</span>}
                                </div>

                                <div className="form-group full-width">
                                    <label>Address <span className="opt">(optional)</span></label>
                                    <input
                                        type="text"
                                        placeholder="City, Country"
                                        value={resumeInfo.personalInfo.address}
                                        onChange={(e) => updatePersonalInfo("address", e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>LinkedIn <span className="opt">(optional)</span></label>
                                    <input
                                        type="text"
                                        placeholder="linkedin.com/in/username"
                                        value={resumeInfo.personalInfo.linkedin}
                                        onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>GitHub / Portfolio <span className="opt">(optional)</span></label>
                                    <input
                                        type="text"
                                        placeholder="github.com/username"
                                        value={resumeInfo.personalInfo.github}
                                        onChange={(e) => updatePersonalInfo("github", e.target.value)}
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <button
                                        type="button"
                                        className="btn-submit"
                                        onClick={() => { if (validateStep1()) setActiveStep(2); }}
                                    >
                                        Save & Continue
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {/* ══ STEP 2 — Experience ══ */}
                    {activeStep === 2 && (
                        <>
                            <h1>Experience</h1>
                            <p>Add your work experience.</p>
                            <span style={{ display: "block", color: "blue", cursor: "pointer", textDecoration: "underline" }} onClick={() => addExperience()}>+Add Experience</span>

                            {resumeInfo.experience.map((exp) => (
                                <>
                                    <span style={{ display: "flex", justifyContent: "right", color: "red", cursor: "pointer", textDecoration: "underline", fontSize: "12px", zIndex: "100" }} onClick={() => removeExperience(exp.id)}>Remove Experience</span>
                                    <div style={{ marginBottom: "20px" }}>
                                        <AccordionUsage key={exp.id} title={`${exp.jobTitle || "Job Title"} | ${exp.company || "Company"}`}>
                                            <form className="form-grid">
                                                <div className="form-group">
                                                    <label>Job Title</label>
                                                    <input type="text" placeholder="e.g. Frontend Developer" value={exp.jobTitle} onChange={(e) => updateExperience(exp.id, "jobTitle", e.target.value)} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Company</label>
                                                    <input type="text" placeholder="e.g. Google" value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Location</label>
                                                    <input type="text" placeholder="e.g. New York" value={exp.location} onChange={(e) => updateExperience(exp.id, "location", e.target.value)} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Start Date</label>
                                                    <input type="date" value={exp.startDate} onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)} />
                                                </div>
                                                <div className="form-group">
                                                    <label>End Date</label>
                                                    <input type="date" value={exp.endDate} onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)} />
                                                </div>
                                                {/* ── Description + AI Suggest ── */}
                                                <div className="form-group full-width">
                                                    <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <span>Description</span>
                                                        <AiBtn loadKey={`exp_${exp.id}`} onClick={() => suggestExpDesc(exp)} />
                                                    </label>
                                                    <textarea
                                                        placeholder="Describe your achievements... or click ✦ AI Suggest"
                                                        style={{ height: "100px", padding: "12px 15px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "15px", outline: "none", transition: "border-color 0.2s", resize: "vertical", fontFamily: "'Syne',sans-serif" }}
                                                        value={exp.description}
                                                        onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                                                    />
                                                </div>
                                            </form>
                                        </AccordionUsage>
                                    </div>
                                </>
                            ))}
                            <div className="form-group full-width" style={{ display: "flex", justifyContent: "space-between", marginTop: "30px", flexDirection: "row-reverse" }}>
                                <button type="button" className="btn-submit" onClick={() => setActiveStep(3)}>Save & Continue</button>
                                <button type="button" className="btn-back" onClick={() => setActiveStep(1)}>Back</button>
                            </div>
                        </>
                    )}

                    {/* ══ STEP 3 — Education ══ */}
                    {activeStep === 3 && (
                        <>
                            <h1>Education</h1>
                            <p>Add your education.</p>
                            <span style={{ display: "block", color: "blue", cursor: "pointer", textDecoration: "underline" }} onClick={() => addEducation()}>+Add Education</span>
                            {resumeInfo.education.map((edu) => (
                                <>
                                    <span style={{ display: "flex", justifyContent: "right", color: "red", cursor: "pointer", textDecoration: "underline", fontSize: "12px", zIndex: "100" }} onClick={() => removeEducation(edu.id)}>Remove Education</span>
                                    <div style={{ marginBottom: "20px" }}>
                                        <AccordionUsage key={edu.id} title={`${edu.degree || "Degree"} | ${edu.school || "School"}`}>
                                            <form className="form-grid">
                                                <div className="form-group">
                                                    <label>Degree</label>
                                                    <input type="text" placeholder="e.g. Bachelor of Science" value={edu.degree} onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} />
                                                </div>
                                                <div className="form-group">
                                                    <label>School</label>
                                                    <input type="text" placeholder="e.g. University of California" value={edu.school} onChange={(e) => updateEducation(edu.id, "school", e.target.value)} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Location</label>
                                                    <input type="text" placeholder="e.g. New York" value={edu.location} onChange={(e) => updateEducation(edu.id, "location", e.target.value)} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Start Date</label>
                                                    <input type="date" value={edu.startDate} onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)} />
                                                </div>
                                                <div className="form-group">
                                                    <label>End Date</label>
                                                    <input type="date" value={edu.endDate} onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)} />
                                                </div>
                                                <div className="form-group full-width">
                                                    <label>Description</label>
                                                    <textarea placeholder="e.g. Graduated with honors" style={{ height: "100px", padding: "12px 15px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "15px", outline: "none", transition: "border-color 0.2s" }} value={edu.description} onChange={(e) => updateEducation(edu.id, "description", e.target.value)} />
                                                </div>
                                            </form>
                                        </AccordionUsage>
                                    </div>
                                </>
                            ))}
                            <div className="form-group full-width" style={{ display: "flex", justifyContent: "space-between", marginTop: "30px", flexDirection: "row-reverse" }}>
                                <button type="button" className="btn-submit" onClick={() => setActiveStep(4)}>Save & Continue</button>
                                <button type="button" className="btn-back" onClick={() => setActiveStep(2)}>Back</button>
                            </div>
                        </>
                    )}

                    {/* ══ STEP 4 — Skills ══ */}
                    {activeStep === 4 && (
                        <>
                            <h1>Skills</h1>
                            <p>Add your skills.</p>
                            <div style={{ marginBottom: "20px" }}>
                                <form className="form-grid">
                                    {/* ── Technical Skills + AI ── */}
                                    <div className="form-group full-width">
                                        <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <span>Technical Skills</span>
                                            <AiBtn loadKey="tech_skills" onClick={suggestTechSkills} />
                                        </label>
                                        <textarea style={{ padding: "12px 15px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "15px", outline: "none", transition: "border-color 0.2s", fontFamily: "'Syne', sans-serif", resize: "vertical" }} placeholder="e.g. React, Node.js" value={skls.technicalSkills} onChange={(e) => updateSkills("technicalSkills", e.target.value)} rows={3} />
                                    </div>
                                    {/* ── Soft Skills + AI ── */}
                                    <div className="form-group full-width">
                                        <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <span>Soft Skills</span>
                                            <AiBtn loadKey="soft_skills" onClick={suggestSoftSkills} />
                                        </label>
                                        <textarea style={{ padding: "12px 15px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "15px", outline: "none", transition: "border-color 0.2s", fontFamily: "'Syne', sans-serif", resize: "vertical" }} placeholder="e.g. Communication, Teamwork" value={skls.softSkills} onChange={(e) => updateSkills("softSkills", e.target.value)} rows={3} />
                                    </div>
                                </form>
                            </div>


                            <div className="form-group full-width" style={{ display: "flex", justifyContent: "space-between", marginTop: "30px", flexDirection: "row-reverse" }}>
                                <button type="button" className="btn-submit" onClick={() => setActiveStep(5)}>Save & Continue</button>
                                <button type="button" className="btn-back" onClick={() => setActiveStep(3)}>Back</button>
                            </div>
                        </>
                    )}

                    {/* ══ STEP 5 — Projects ══ */}
                    {activeStep === 5 && (
                        <>
                            <h1>Projects</h1>
                            <p>Add your projects.</p>
                            <span style={{ display: "block", color: "blue", cursor: "pointer", textDecoration: "underline" }} onClick={() => addProject()}>+Add Project</span>
                            {resumeInfo.projects.map((project) => (
                                <>
                                    <span style={{ display: "flex", justifyContent: "right", color: "red", cursor: "pointer", textDecoration: "underline", fontSize: "12px", zIndex: "100" }} onClick={() => removeProject(project.id)}>Remove Project</span>
                                    <div style={{ marginBottom: "20px" }}>
                                        <AccordionUsage key={project.id} title={`${project.projectName || "Project Name"} | ${project.projectDescription || "Project Description"}`}>
                                            <form className="form-grid">
                                                <div className="form-group">
                                                    <label>Project Name</label>
                                                    <input type="text" placeholder="e.g. Project Name" value={project.projectName} onChange={(e) => updateProject(project.id, "projectName", e.target.value)} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Project Link</label>
                                                    <input type="text" placeholder="e.g. github.com/you/project" value={project.projectLink} onChange={(e) => updateProject(project.id, "projectLink", e.target.value)} />
                                                </div>
                                                {/* ── Project Description + AI ── */}
                                                <div className="form-group full-width">
                                                    <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <span>Project Description</span>
                                                        <AiBtn loadKey={`proj_${project.id}`} onClick={() => suggestProjDesc(project)} />
                                                    </label>
                                                    <textarea
                                                        placeholder="Describe your project... or click ✦ AI Suggest"
                                                        style={{ height: "80px", padding: "12px 15px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "15px", outline: "none", transition: "border-color 0.2s", resize: "vertical", fontFamily: "'Syne',sans-serif" }}
                                                        value={project.projectDescription}
                                                        onChange={(e) => updateProject(project.id, "projectDescription", e.target.value)}
                                                    />
                                                </div>
                                            </form>
                                        </AccordionUsage>
                                    </div>
                                </>
                            ))}
                            <div className="form-group full-width" style={{ display: "flex", justifyContent: "space-between", marginTop: "30px", flexDirection: "row-reverse" }}>
                                <button type="button" className="btn-submit" onClick={() => setActiveStep(6)}>Save & Continue</button>
                                <button type="button" className="btn-back" onClick={() => setActiveStep(4)}>Back</button>
                            </div>
                        </>
                    )}

                    {/* ══ STEP 6 — Languages ══ */}
                    {activeStep === 6 && (
                        <>
                            <h1>Languages</h1>
                            <p>Add your languages.</p>
                            <span style={{ display: "block", color: "blue", cursor: "pointer", textDecoration: "underline" }} onClick={() => addLanguage()}>+Add Language</span>
                            {resumeInfo.languages.map((language) => (
                                <>
                                    <span style={{ display: "flex", justifyContent: "right", color: "red", cursor: "pointer", textDecoration: "underline", fontSize: "12px", zIndex: "100" }} onClick={() => removeLanguage(language.id)}>Remove Language</span>
                                    <div style={{ marginBottom: "20px" }}>
                                        <AccordionUsage key={language.id} title={`${language.languageName || "Language Name"} | ${language.languageProficiency || "Language Proficiency"}`}>
                                            <form className="form-grid">
                                                <div className="form-group">
                                                    <label>Language Name</label>
                                                    <input type="text" placeholder="e.g. Language Name" value={language.languageName} onChange={(e) => updateLanguage(language.id, "languageName", e.target.value)} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Language Proficiency</label>
                                                    <input type="text" placeholder="e.g. Language Proficiency" value={language.languageProficiency} onChange={(e) => updateLanguage(language.id, "languageProficiency", e.target.value)} />
                                                </div>
                                            </form>
                                        </AccordionUsage>
                                    </div>
                                </>
                            ))}
                            <div className="form-group full-width" style={{ display: "flex", justifyContent: "space-between", marginTop: "30px", flexDirection: "row-reverse" }}>
                                <button type="button" className="btn-submit" onClick={() => setActiveStep(7)}>Save & Continue</button>
                                <button type="button" className="btn-back" onClick={() => setActiveStep(5)}>Back</button>
                            </div>
                        </>
                    )}

                    {/* ══ STEP 7 — Summary ══ */}
                    {activeStep === 7 && (
                        <>
                            <h1>Summary</h1>
                            <p>Add your summary.</p>
                            <div style={{ marginBottom: "20px" }}>
                                <div className="form-group full-width">
                                    {/* ── Summary label + AI Suggest ── */}
                                    <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                        <span style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700, color: "#444" }}>Summary</span>
                                        <AiBtn loadKey="summary" onClick={suggestSummary} label="✦ AI Write Summary" />
                                    </label>
                                    <textarea
                                        placeholder="e.g. Results-driven professional with 5+ years of experience... or click ✦ AI Write Summary above"
                                        style={{ width: "100%", minHeight: "150px", padding: "12px 15px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "15px", fontFamily: "'Syne', sans-serif", outline: "none", transition: "border-color 0.2s", resize: "vertical" }}
                                        value={resumeInfo.summary}
                                        onChange={(e) => updateSummary(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group full-width" style={{ display: "flex", justifyContent: "space-between", marginTop: "30px", flexDirection: "row-reverse" }}>
                                <button type="button" className="btn-submit" onClick={() => setActiveStep(8)}>Save & Continue</button>
                                <button type="button" className="btn-back" onClick={() => setActiveStep(6)}>Back</button>
                            </div>
                        </>
                    )}

                    {/* ══ STEP 8 — Finalize & Download ══ */}
                    {activeStep === 8 && (
                        <>
                            <h1>Your CV is Ready!</h1>
                            <p>Review your resume on the right, then download it as a PDF.</p>

                            <div style={{ marginBottom: 28 }}>
                                {[
                                    { label: "Personal Info", done: !!pi.fullName },
                                    { label: "Experience", done: exps.length > 0 },
                                    { label: "Education", done: edus.length > 0 },
                                    { label: "Skills", done: allSkills.length > 0 },
                                    { label: "Summary", done: !!sum },
                                ].map((item, i) => (
                                    <div key={i} className="checklist-item">
                                        <span className={`checklist-circle ${item.done ? "done" : "empty"}`}>
                                            {item.done ? "✓" : "–"}
                                        </span>
                                        <span className={`checklist-label ${item.done ? "done" : "empty"}`}>
                                            {item.label}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <button className="btn-download" onClick={handleDownload}>
                                ↓ Download PDF
                            </button>

                            <div className="form-group full-width" style={{ display: "flex", marginTop: 0 }}>
                                <button type="button" className="btn-back" style={{ width: "100%" }} onClick={() => setActiveStep(7)}>← Back</button>
                            </div>
                        </>
                    )}

                </div>
            </div>

            {/* ════════ RIGHT — CV PREVIEW ════════ */}
            <div className="builder-right">
                <ResumeTemplate
                    personalInfo={resumeInfo.personalInfo}
                    experience={resumeInfo.experience}
                    education={resumeInfo.education}
                    skills={resumeInfo.skills}
                    projects={resumeInfo.projects}
                    languages={resumeInfo.languages}
                    summary={resumeInfo.summary}
                />
            </div>
        </div>
    );
};

export default Builder;