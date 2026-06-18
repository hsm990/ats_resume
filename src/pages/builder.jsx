import React, { useState, useContext } from "react";
import { InfoContext } from "../context/infoContext";
import AccordionUsage from "../components/Layout/Accordion";
import ResumeTemplate from "../components/resume/ResumeTemplate";
import ResumePDFTemplate from "../components/resume/ResumePDFTemplate";
import { PDFDownloadLink } from "@react-pdf/renderer";
import FormInput from "../components/common/FormInput";
import FormTextarea from "../components/common/FormTextarea";
import AiButton from "../components/common/AiButton";
import SectionNav from "../components/common/SectionNav";
import SectionHeader from "../components/common/SectionHeader";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const askAI = async (prompt) => {
    if (import.meta.env.DEV && GROQ_API_KEY) {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.4,
                max_tokens: 2048
            })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message || "Groq API Error");
        return data.choices?.[0]?.message?.content?.trim() || "";
    }

    const res = await fetch('/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed secure request to Vercel api");

    return data.text;
};

const Builder = () => {
    const [activeStep, setActiveStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [aiLoading, setAiLoading] = useState({});
    const [selectedTemplate, setSelectedTemplate] = useState('template1');
    const [atsLoading, setAtsLoading] = useState(false);
    const [atsResult, setAtsResult] = useState(null);
    const [toastError, setToastError] = useState("");

    const showError = (msg) => {
        setToastError(msg);
        setTimeout(() => setToastError(""), 5000);
    };

    const {
        resumeInfo,
        resetResumeInfo,
        updatePersonalInfo,
        addExperience, removeExperience, updateExperience,
        addEducation, removeEducation, updateEducation,
        updateSkills,
        updateSummary,
        updateResumeGoal,
        addProject, removeProject, updateProject,
        addLanguage, removeLanguage, updateLanguage,
        addCertification, removeCertification, updateCertification,
        addAward, removeAward, updateAward,
        addReference, removeReference, updateReference,
        addCustomSection, removeCustomSection, updateCustomSection,
    } = useContext(InfoContext);

    const pi = resumeInfo.personalInfo || {};
    const exps = resumeInfo.experience || [];
    const edus = resumeInfo.education || [];
    const skls = resumeInfo.skills || { technicalSkills: "", softSkills: "" };
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
    const setLoading = (key, val) => setAiLoading(prev => ({ ...prev, [key]: val }));

    const suggestExpDesc = async (exp) => {
        if (!exp.jobTitle && !exp.company) return showError("Fill in Job Title and Company first.");
        const key = `exp_${exp.id}`;
        setLoading(key, true);
        try {
            const targetContext = resumeInfo.resumeGoal?.mode === "targeted" && resumeInfo.resumeGoal?.targetJobTitle
                ? `TARGET ROLE: ${resumeInfo.resumeGoal.targetJobTitle}
REQUIRED KEYWORDS (use these exact terms, do not paraphrase them): ${resumeInfo.resumeGoal.targetJobDescription}`
                : `Role context: ${pi.jobTitle || "N/A"}`;

            const text = await askAI(`
[SYSTEM] You are a professional resume writer. Output ONLY the experience description. No greetings, no explanations, no labels, no bullet points, no markdown.

[TASK] Write exactly 3 sentences describing this work experience.

[RULES]
- Sentence 1: Start with a past-tense action verb. Describe the core responsibility and scale (team size, system size, or user base).
- Sentence 2: Start with a different past-tense action verb. Name specific tools, technologies, or methodologies used.
- Sentence 3: Start with a different past-tense action verb. State one measurable result (use a realistic % or number if unknown).
- Every sentence must end with a period and be fully grammatically complete.
- NEVER use: "various", "multiple", "several", "helped", "assisted", "worked on", "responsible for".
- Output ONLY 3 sentences. Nothing before, nothing after.

[POSITION]
Job Title: ${exp.jobTitle}
Company: ${exp.company}${exp.location ? `\nLocation: ${exp.location}` : ""}
${targetContext}

[OUTPUT - 3 SENTENCES ONLY]
`.trim());

            // Strip any preamble llama might add before the actual sentences
            const lines = text
                .split(/(?<=[.!?])\s+/) // split on sentence boundaries
                .map(s => s.replace(/^[\s\-•*\d.)]+/, "").trim())
                .filter(s => s.length > 20 && /[A-Z]/.test(s[0])); // keep only real sentences

            const result = lines.slice(0, 3).join(" ");
            updateExperience(exp.id, "description", result || text.trim());
        } catch (e) { showError("AI error: " + e.message); }
        setLoading(key, false);
    };
    const suggestEduDesc = async (edu) => {
        if (!edu.degree && !edu.school) return showError("Fill in Degree and School first.");
        const key = `edu_${edu.id}`;
        setLoading(key, true);
        try {
            const targetContext = resumeInfo.resumeGoal?.mode === "targeted" && resumeInfo.resumeGoal?.targetJobTitle
                ? `TARGET ROLE: ${resumeInfo.resumeGoal.targetJobTitle}
ALIGN WITH THESE KEYWORDS (use exact terms where natural): ${resumeInfo.resumeGoal.targetJobDescription}`
                : `Candidate's target role: ${pi.jobTitle || "N/A"}`;

            const text = await askAI(`
[SYSTEM] You are a professional resume writer. Output ONLY the education description. No greetings, no explanations, no labels, no bullet points, no markdown.

[TASK] Write exactly 2 sentences describing this candidate's education entry.

[RULES]
- Sentence 1: Describe the degree, field of study, and any notable academic focus, specialization, or relevant coursework. Be specific and realistic.
- Sentence 2: Mention one concrete achievement, extracurricular, thesis topic, academic honor, or skill gained that is relevant to the candidate's career direction.
- Both sentences must be fully grammatically complete and end with a period.
- NEVER use vague filler: "various", "multiple", "several", "helped", "studied hard", "worked on", "responsible for".
- If a target role is provided, naturally weave in 1-2 keywords from it without forcing them.
- Output ONLY 2 sentences. Nothing before, nothing after.

[EDUCATION]
Degree: ${edu.degree}
School: ${edu.school}${edu.location ? `\nLocation: ${edu.location}` : ""}
${edu.graduationYear ? `Graduation Year: ${edu.graduationYear}` : ""}
${targetContext}

[OUTPUT - 2 SENTENCES ONLY]
`.trim());

            const sentences = text
                .split(/(?<=[.!?])\s+/)
                .map(s => s.replace(/^[\s\-•*\d.)]+/, "").trim())
                .filter(s => s.length > 20 && /[A-Z]/.test(s[0]));

            const result = sentences.slice(0, 2).join(" ");
            updateEducation(edu.id, "description", result || text.trim());
        } catch (e) { showError("AI error: " + e.message); }
        setLoading(key, false);
    };


    const suggestTechSkills = async () => {
        if (resumeInfo.resumeGoal?.mode === "targeted" && !resumeInfo.resumeGoal?.targetJobDescription) {
            return showError("Please provide a Target Job Description in Step 1 to extract targeted skills.");
        }
        const key = "tech_skills";
        setLoading(key, true);
        try {
            const expDetails = exps
                .map(e => `${e.jobTitle} at ${e.company}${e.description ? ` (${e.description.slice(0, 80)})` : ""}`)
                .join(" | ") || "N/A";

            const existingSkills = skls.technicalSkills
                ? `ALREADY LISTED — DO NOT INCLUDE ANY OF THESE: ${skls.technicalSkills}`
                : "";

            const targetContext = resumeInfo.resumeGoal?.mode === "targeted" && resumeInfo.resumeGoal?.targetJobTitle
                ? `Target job title: ${resumeInfo.resumeGoal.targetJobTitle}
Job description (extract exact tool/technology names from this): ${resumeInfo.resumeGoal.targetJobDescription}`
                : `Candidate's current/target role: ${pi.jobTitle || "N/A"}`;

            const text = await askAI(`
[SYSTEM] You are a resume ATS optimization expert. Output ONLY a comma-separated list. No numbering, no bullets, no headers, no explanation, no extra text.

[TASK] Generate exactly 10 technical skills for this candidate's resume.

[RULES]
- Every skill must be a specific named tool, language, framework, or platform.
- ALLOWED: React.js, PostgreSQL, Docker, AWS Lambda, Figma, TypeScript, Redis, Kubernetes, Tailwind CSS, GraphQL
- NOT ALLOWED: "Programming", "Databases", "Cloud Computing", "Software Development", "Problem Solving"
- Distribute as: 4 core skills directly matching the role + 3 complementary tools + 3 in-demand skills for this field
- Each skill must be 1-4 words maximum. No descriptions, no parentheses, no explanations next to the skill.
- You MUST output all 10. Do not stop early.
- ${existingSkills}

[CANDIDATE]
Role context: ${targetContext}
Experience: ${expDetails}

[OUTPUT - comma-separated list of exactly 10 skills, nothing else]
`.trim());

            // Clean up common LLaMA output issues
            const cleaned = text
                .replace(/^[^a-zA-Z]+/, "")           // strip leading symbols/numbers
                .replace(/\n/g, ", ")                   // flatten any newlines into the list
                .replace(/\d+\.\s*/g, "")              // remove "1. 2. 3." numbering
                .replace(/[-•*]\s*/g, "")              // remove bullet chars
                .replace(/\s{2,}/g, " ")               // collapse whitespace
                .replace(/,\s*,/g, ",")                // fix double commas
                .replace(/\.$/, "")                     // strip trailing period
                .trim();

            updateSkills("technicalSkills", cleaned);
        } catch (e) { showError("AI error: " + e.message); }
        setLoading(key, false);
    };

    const suggestSoftSkills = async () => {
        const key = "soft_skills";
        setLoading(key, true);
        try {
            const expDetails = exps
                .map(e => `${e.jobTitle} at ${e.company}`)
                .join(", ") || "N/A";

            const existingSkills = skls.softSkills
                ? `ALREADY LISTED — DO NOT INCLUDE ANY OF THESE: ${skls.softSkills}`
                : "";

            const targetContext = resumeInfo.resumeGoal?.mode === "targeted" && resumeInfo.resumeGoal?.targetJobTitle
                ? `Target job title: ${resumeInfo.resumeGoal.targetJobTitle}
Job description (extract the most valued interpersonal traits and work-style keywords from this): ${resumeInfo.resumeGoal.targetJobDescription}`
                : `Candidate's current/target role: ${pi.jobTitle || "N/A"}`;

            const text = await askAI(`
[SYSTEM] You are a career coach and resume strategist. Output ONLY a comma-separated list. No numbering, no bullets, no headers, no explanation, no extra text whatsoever.

[TASK] Generate exactly 6 soft skills for this candidate's resume.

[RULES]
- Every skill must be a specific, professional 2-5 word phrase used in real job descriptions.
- ALLOWED: Cross-functional collaboration, Stakeholder communication, Data-driven decision making, Agile project management, Conflict resolution, Executive presentation, Iterative feedback integration
- NOT ALLOWED: "Teamwork", "Hard worker", "Good communicator", "Fast learner", "Motivated", "Team player"
- The skills must feel natural and tailored to the specific role — not copy-pasted generic resume filler.
- If a job description is provided, at least 3 skills must reflect traits explicitly or implicitly valued in that description.
- Each skill must be 2-5 words. No descriptions, no parentheses, no explanations next to the skill.
- You MUST output all 6. Do not stop early.
- ${existingSkills}

[CANDIDATE]
Role context: ${targetContext}
Experience: ${expDetails}

[OUTPUT - comma-separated list of exactly 6 skills, nothing else]
`.trim());

            const cleaned = text
                .replace(/^[^a-zA-Z]+/, "")
                .replace(/\n/g, ", ")
                .replace(/\d+\.\s*/g, "")
                .replace(/[-•*]\s*/g, "")
                .replace(/\s{2,}/g, " ")
                .replace(/,\s*,/g, ",")
                .replace(/\.$/, "")
                .trim();

            updateSkills("softSkills", cleaned);
        } catch (e) { showError("AI error: " + e.message); }
        setLoading(key, false);
    };

    const suggestProjDesc = async (proj) => {
        if (!proj.projectName) return showError("Fill in the Project Name first.");
        const key = `proj_${proj.id}`;
        setLoading(key, true);
        try {
            const targetContext = resumeInfo.resumeGoal?.mode === "targeted" && resumeInfo.resumeGoal?.targetJobTitle
                ? `Target job title: ${resumeInfo.resumeGoal.targetJobTitle}
Job description (mirror relevant technologies and keywords from this naturally): ${resumeInfo.resumeGoal.targetJobDescription}`
                : `Candidate's current/target role: ${pi.jobTitle || "N/A"}`;

            const candidateSkills = allSkills.slice(0, 8).join(", ") || "N/A";
            const projectLink = proj.projectLink ? `Project URL: ${proj.projectLink}` : "";

            const text = await askAI(`
[SYSTEM] You are a professional technical resume writer. Output ONLY the project description. No greetings, no explanations, no labels, no bullet points, no markdown.

[TASK] Write exactly 2 sentences describing this candidate's project for their resume.

[RULES]
- Sentence 1: State what the project does and name the specific technologies, frameworks, or languages used to build it. Start with a past-tense action verb (Built, Developed, Engineered, Designed, Architected).
- Sentence 2: Describe one concrete technical challenge solved, a key feature implemented, or a measurable outcome (performance gain, users served, uptime, load time, etc.). Start with a different past-tense action verb.
- Both sentences must be fully grammatically complete and end with a period.
- Pull technologies from the candidate's skill set where naturally applicable — do not invent unrelated stacks.
- If a target role is provided, reflect 1-2 keywords or technologies from the job description naturally.
- NEVER use: "various", "multiple", "several", "innovative", "cutting-edge", "state-of-the-art", "robust", "scalable solution".
- Each sentence should be 20-35 words. Concise but technically specific.
- Output ONLY 2 sentences. Nothing before, nothing after.

[PROJECT]
Project name: ${proj.projectName}
${projectLink}
Candidate's known skills (use these where relevant): ${candidateSkills}
${targetContext}

[OUTPUT - 2 SENTENCES ONLY]
`.trim());

            const sentences = text
                .split(/(?<=[.!?])\s+/)
                .map(s => s.replace(/^[\s\-•*\d.)]+/, "").trim())
                .filter(s => s.length > 20 && /[A-Z]/.test(s[0]));

            const result = sentences.slice(0, 2).join(" ");
            updateProject(proj.id, "projectDescription", result || text.trim());
        } catch (e) { showError("AI error: " + e.message); }
        setLoading(key, false);
    };

    const suggestSummary = async () => {
        setLoading("summary", true);
        try {
            const expDetails = exps.map(e =>
                `${e.jobTitle} at ${e.company}${e.description ? `: ${e.description.slice(0, 120)}` : ""}`
            ).join(" | ") || "N/A";
            const eduDetails = edus.map(e => `${e.degree} from ${e.school}`).join(", ") || "N/A";
            const numJobs = exps.length;
            const targetContext = resumeInfo.resumeGoal?.mode === "targeted" && resumeInfo.resumeGoal?.targetJobTitle
                ? `TARGET ROLE: ${resumeInfo.resumeGoal.targetJobTitle}\nJOB DESCRIPTION: ${resumeInfo.resumeGoal.targetJobDescription}\nCRITICAL: YOU MUST EXTRACT AND USE EXACT KEYWORDS from the job description to bypass ATS. Generate concise sentences under 60 words total. Do NOT cut off mid-sentence.`
                : `- Job Title: ${pi.jobTitle || "N/A"}`;

            const text = await askAI(`
You are an elite career strategist. Write a realistic, compelling, 2-sentence professional summary for this candidate.
1. Sentence 1: State their core area of expertise and professional title.
2. Sentence 2: State their best actual skills and what outcomes they drove based strictly on the data below.
3. Keep the tone professional and confident.
4. Output one fully complete paragraph. Do not use random hardware word count limits that cause you to cut off natively. Ensure the sentences finish.

CANDIDATE DATA:
${targetContext}
- Work history: ${expDetails}
- Education: ${eduDetails}
- Skills: ${allSkills.slice(0, 10).join(", ") || "N/A"}
- Number of positions: ${numJobs}
`.trim());
            const cleaned = text
                .replace(/^[\s\-•*\d."]+/, "")
                .replace(/["']$/g, "")
                .trim();
            updateSummary(cleaned);
        } catch (e) { showError("AI error: " + e.message); }
        setLoading("summary", false);
    };

    const analyzeATS = async () => {
        if (resumeInfo.resumeGoal?.mode !== "targeted" || !resumeInfo.resumeGoal?.targetJobDescription) {
            showError("You must select 'Targeted (Specific Job)' in Step 1 and provide a Target Job Description to use the ATS Scanner.");
            return;
        }
        setAtsLoading(true);
        setAtsResult(null);
        try {
            const resumeTextDump = JSON.stringify({
                summary: sum,
                skills: allSkills,
                experience: exps.map(e => ({ title: e.jobTitle, desc: e.description })),
                education: edus.map(e => ({ degree: e.degree, desc: e.description })),
            });
            const text = await askAI(`
You are a strict algorithmic ATS (Applicant Tracking System) scanner. 
Calculate the resume score using this exact formula:
1. Exact Skill Matches (50% weight): Does the resume contain the exact technical tools mentioned?
2. Context/Experience (30% weight): Are those skills used in the experience context?
3. Action Verbs & Outcomes (20% weight): Does the resume use quantifiable metrics?

Target Job Description:
${resumeInfo.resumeGoal.targetJobDescription}

Resume Data:
${resumeTextDump}

CRITICAL RULES FOR JSON OUTPUT:
1. Output EXACTLY a valid JSON object and NOTHING else.
2. DO NOT wrap the output in markdown blocks or backticks.
3. If you need to use quotes inside the feedback string, use single quotes (') NOT double quotes.
4. DO NOT use line breaks/newlines inside string values.

Format:
{
  "score": <number between 0 and 100 based strictly on the math formula>,
  "missingKeywords": ["keyword1", "keyword2"],
  "feedback": "One exact sentence explaining score without newlines."
}
            `.trim());

            let cleanJson = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
            const startIdx = cleanJson.indexOf('{');
            const endIdx = cleanJson.lastIndexOf('}');
            if (startIdx !== -1 && endIdx !== -1) {
                cleanJson = cleanJson.substring(startIdx, endIdx + 1);
            }

            cleanJson = cleanJson.replace(/[\n\r]+/g, " ");

            let parsed;
            try {
                parsed = JSON.parse(cleanJson);

                // CRITICAL FIX: If AI accidentally returns a string or null instead of an array, fix it to prevent React crash!
                if (typeof parsed.missingKeywords === 'string') {
                    parsed.missingKeywords = parsed.missingKeywords.split(',').map(s => s.trim());
                } else if (!Array.isArray(parsed.missingKeywords)) {
                    parsed.missingKeywords = [];
                }

                if (typeof parsed.score !== 'number') {
                    parsed.score = parseInt(parsed.score, 10) || 50;
                }
            } catch (err) {
                console.warn("Fast JSON parse failed, falling back to regex extraction:", err.message);

                const scoreMatch = cleanJson.match(/"score"\s*:\s*(\d+)/i);
                const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 50;

                let missingKeywords = [];
                const keywordsMatch = cleanJson.match(/"missingKeywords"\s*:\s*\[(.*?)\]/i);
                if (keywordsMatch && keywordsMatch[1]) {
                    missingKeywords = keywordsMatch[1].split(',')
                        .map(s => s.replace(/["']/g, '').trim())
                        .filter(Boolean);
                }

                let feedback = "ATS Analysis complete. Ensure your keywords are fully optimized.";
                const fbMatch = cleanJson.match(/"feedback"\s*:\s*"([^"]*)/i);
                if (fbMatch && fbMatch[1]) {
                    feedback = fbMatch[1];
                }

                parsed = { score, missingKeywords, feedback };
            }

            setAtsResult(parsed);
        } catch (e) {
            showError("ATS Connection Error: " + e.message);
        }
        setAtsLoading(false);
    };

    return (
        <div className="builder-container">
            <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&display=swap');

            * { box-sizing: border-box; }

            .builder-container {
                height: 100vh;
                width: 100%;
                background-color: var(--bg-primary);
                display: flex;
                font-family: 'Syne', sans-serif;
            }

            /* ════ LEFT PANEL ════ */
            .builder-left {
                height: 100vh;
                width: 55%;
                background-color: var(--bg-primary);
                display: flex;
                align-items: center;
                justify-content: flex-start;
                border-right: 1px solid var(--border-color);
                padding-top: 40px;
                flex-direction: column;
                overflow-y: auto;
            }

            .builder-left textarea {
                background-color: var(--bg-primary) !important;
                color: var(--text-primary) !important;
                border-color: var(--border-color) !important;
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
                color: var(--text-secondary);
                position: relative;
                cursor: pointer;
                width: 105px;
                display: flex;
                justify-content: center;
            }
            .builder-left ul li.active { color: var(--text-primary); }
            .builder-left ul:before {
                content: "";
                position: absolute;
                bottom: -15px;
                left: 0;
                width: 100%;
                height: 2px;
                background-color: var(--border-color);

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
                background-color: var(--bg-primary);
                border: 2px solid var(--border-color);
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
                color: var(--text-primary);
            }
            .builder-left-content p {
                color: var(--text-secondary);
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
                color: var(--text-secondary);
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
                color: var(--text-secondary);
                font-size: 10px;
                font-weight: 400;
                text-transform: none;
                letter-spacing: 0;
            }
            .form-group input {
                padding: 12px 15px;
                border: 1px solid var(--border-color);
                border-radius: 6px;
                font-size: 15px;
                font-family: 'Syne', sans-serif;
                outline: none;
                transition: border-color 0.2s, background 0.2s;
                background-color: var(--bg-primary);
                color: var(--text-primary);
            }
            .form-group input:focus { border-color: var(--text-primary); }
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
                background-color: var(--text-primary);
                color: var(--bg-primary);
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
                background: var(--text-primary);
                color: var(--bg-primary);
                border: none;
                border-radius: 6px;
                font-size: 15px;
                font-weight: 700;
                font-family: 'Syne', sans-serif;
                cursor: pointer;
                letter-spacing: 0.3px;
                margin-bottom: 12px;
                transition: opacity 0.2s;
                text-align: center;
            }
            .btn-download:hover { opacity: 0.85; }

            /* ════ RIGHT PANEL ════ */
            .builder-right {
                height: 100vh;
                width: 45%;
                background-color: #eee; /* Dark background to contrast the white paper */
                display: flex;
                align-items: flex-start;
                justify-content: center;
                position: sticky;
                top: 0;
                overflow-y: auto;
                overflow-x: auto;
                padding: 40px;
            }

            @media (max-width: 900px) {
                .builder-container { flex-direction: column; height: auto; overflow: visible; }
                .builder-left { width: 100%; height: auto; min-height: unset; padding: 30px 20px; border-right: none; }
                .builder-left-content { width: 100%; max-width: 100%; padding-bottom: 20px; }
                .builder-right { width: 100%; height: auto; padding: 20px 0; display: flex; justify-content: center; overflow: hidden; position: static; }
                .form-grid { grid-template-columns: 1fr; }
                .form-group.full-width { grid-column: span 1; }
                .builder-left ul { flex-wrap: wrap; gap: 10px; margin-bottom: 40px; }
                .builder-left ul:before { display: none; } /* hide progress line on mobile */
                .scale-wrapper { transform: scale(0.42) !important; transform-origin: top center !important; margin-bottom: -160mm !important; }
                .btn-submit, .btn-back { width: 48%; padding: 12px 10px; }
            }

            @media print {
                @page {
                    size: A4 portrait;
                    margin: 0; 
                }
                body, html {
                    margin: 0 !important;
                    padding: 0 !important;
                    background: white !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                .builder-left {
                    display: none !important;
                }
                .builder-right {
                    width: 100% !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    display: block !important;
                    height: auto !important;
                    overflow: visible !important;
                    background: transparent !important;
                }
                .builder-container {
                    display: block !important;
                    height: auto !important;
                    background: transparent !important;
                }
                .scale-wrapper {
                    transform: none !important;
                    margin: 0 !important;
                }
                .cv-paper {
                    box-shadow: none !important;
                    margin: 0 auto !important;
                    padding: 20mm !important;
                    width: 210mm !important;
                    min-height: 297mm !important;
                    height: auto !important;
                    box-sizing: border-box;
                    page-break-after: auto;
                    page-break-before: auto;
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
            .checklist-circle.done  { background: var(--text-primary); color: var(--bg-primary); }
            .checklist-circle.empty { background: var(--border-color); color: var(--text-secondary); }
            .checklist-label { font-size: 14px; font-weight: 600; }
            .checklist-label.done  { color: var(--text-primary); }
            .checklist-label.empty { color: var(--text-secondary); font-weight: 400; }

            /* Mobile Responsiveness */
            @media (max-width: 900px) {
                .builder-container {
                    flex-direction: column;
                    height: auto;
                    overflow: visible;
                }
                .builder-left {
                    width: 100%;
                    height: auto;
                    border-right: none;
                    border-bottom: 2px solid var(--border-color);
                    padding: 20px 10px;
                }
                .builder-left-content {
                    width: 100%;
                }
                .builder-left ul {
                    flex-wrap: wrap;
                    gap: 30px;
                }
                .form-grid {
                    display: flex;
                    flex-direction: column;
                }
                .btn-submit, .btn-back {
                    width: 100%;
                }
                .builder-right {
                    width: 100%;
                    height: auto;
                    padding: 10px;
                    overflow-x: auto;
                }
            }
            `}</style>

            <div className="builder-left">
                <SectionNav activeStep={activeStep} onStep={setActiveStep} />

                <div style={{ marginTop: "30px", padding: "15px", borderTop: "2px solid var(--border-color)", textAlign: "center" }}>
                    <button type="button" onClick={() => {
                        resetResumeInfo();
                        setActiveStep(1);
                        setAtsResult(null);
                    }} style={{ background: "transparent", color: "#e84545", border: "1px solid #e84545", padding: "8px 15px", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontWeight: "600", transition: "all 0.2s" }} onMouseEnter={e => { e.target.style.background = "#fbf2f2" }} onMouseLeave={e => { e.target.style.background = "transparent" }}>Start Over (Clear Data)</button>
                </div>

                <div className="builder-left-content">

                    {/* STEP 1 — Personal Info  */}
                    {activeStep === 1 && (
                        <>
                            <SectionHeader title="Personal Details" description="Get started with your name and contact information." />
                            <div className="form-grid">

                                <div className="form-group full-width" style={{ marginBottom: "20px" }}>
                                    <label>Resume Goal <span className="req">*</span></label>
                                    <div style={{ display: "flex", gap: "20px", marginTop: "10px", marginBottom: "15px" }}>
                                        <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer", textTransform: "none", fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>
                                            <input
                                                type="radio"
                                                name="resumeMode"
                                                style={{ cursor: "pointer", width: "16px", height: "16px" }}
                                                checked={resumeInfo.resumeGoal?.mode === "global"}
                                                onChange={() => updateResumeGoal("mode", "global")}
                                            />
                                            Standard Resume
                                        </label>
                                        <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer", textTransform: "none", fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>
                                            <input
                                                type="radio"
                                                name="resumeMode"
                                                style={{ cursor: "pointer", width: "16px", height: "16px" }}
                                                checked={resumeInfo.resumeGoal?.mode === "targeted"}
                                                onChange={() => updateResumeGoal("mode", "targeted")}
                                            />
                                            Targeted (Specific Job)
                                        </label>
                                    </div>

                                    {resumeInfo.resumeGoal?.mode === "targeted" && (
                                        <div style={{
                                            marginTop: "5px",
                                            padding: "20px",
                                            border: "1px dashed #e84545",
                                            borderRadius: "8px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "15px",
                                            backgroundColor: "rgba(232, 69, 69, 0.03)"
                                        }}>
                                            <p style={{ margin: "0 0 5px 0", fontSize: "12px", fontWeight: "600", color: "var(--text-secondary)" }}>The AI will tailor all auto-generated content to match this exact role.</p>
                                            <input
                                                type="text"
                                                placeholder="Target Job Title (e.g. Senior Frontend Engineer)"
                                                value={resumeInfo.resumeGoal.targetJobTitle}
                                                onChange={(e) => updateResumeGoal("targetJobTitle", e.target.value)}
                                                style={{ width: "100%", padding: "12px 15px", borderRadius: "6px", border: "1px solid var(--border-color)", fontFamily: "'Syne', sans-serif" }}
                                            />
                                            <textarea
                                                placeholder="Paste the Target Job Description here..."
                                                value={resumeInfo.resumeGoal.targetJobDescription}
                                                onChange={(e) => updateResumeGoal("targetJobDescription", e.target.value)}
                                                style={{ width: "100%", padding: "12px 15px", borderRadius: "6px", border: "1px solid var(--border-color)", minHeight: "120px", resize: "vertical", fontFamily: "'Syne', sans-serif" }}
                                            ></textarea>
                                        </div>
                                    )}
                                </div>


                                <FormInput
                                    label="Full Name" required value={resumeInfo.personalInfo.fullName}
                                    placeholder="e.g. John Doe" error={errors.fullName}
                                    onChange={(v) => { updatePersonalInfo("fullName", v); clearError("fullName"); }}
                                />
                                <FormInput
                                    label="Job Title" required value={resumeInfo.personalInfo.jobTitle}
                                    placeholder="e.g. Frontend Developer" error={errors.jobTitle}
                                    onChange={(v) => { updatePersonalInfo("jobTitle", v); clearError("jobTitle"); }}
                                />
                                <FormInput
                                    label="Email Address" required value={resumeInfo.personalInfo.email}
                                    placeholder="john@example.com" error={errors.email} type="email"
                                    onChange={(v) => { updatePersonalInfo("email", v); clearError("email"); }}
                                />
                                <FormInput
                                    label="Phone Number" required value={resumeInfo.personalInfo.phone}
                                    placeholder="+1 234 567 890" error={errors.phone} type="tel"
                                    onChange={(v) => { updatePersonalInfo("phone", v); clearError("phone"); }}
                                />
                                <FormInput
                                    label="Address" optional="optional" value={resumeInfo.personalInfo.address}
                                    placeholder="City, Country"
                                    onChange={(v) => updatePersonalInfo("address", v)}
                                />
                                <FormInput
                                    label="LinkedIn" optional="optional" value={resumeInfo.personalInfo.linkedin}
                                    placeholder="linkedin.com/in/username"
                                    onChange={(v) => updatePersonalInfo("linkedin", v)}
                                />
                                <FormInput
                                    label="GitHub / Portfolio" optional="optional" value={resumeInfo.personalInfo.github}
                                    placeholder="github.com/username"
                                    onChange={(v) => updatePersonalInfo("github", v)}
                                />

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

                    {/* STEP 2 — Experience  */}
                    {activeStep === 2 && (
                        <>
                            <SectionHeader title="Experience" description="Add your work experience." />
                            <span style={{ display: "block", width: "fit-content", color: "#e84545", cursor: "pointer", textDecoration: "underline" }} onClick={() => addExperience()}>+Add Experience</span>

                            {resumeInfo.experience.map((exp) => (
                                <React.Fragment key={exp.id}>
                                    <span style={{ display: "flex", justifyContent: "right", color: "red", cursor: "pointer", textDecoration: "underline", fontSize: "12px", zIndex: "100" }} onClick={() => removeExperience(exp.id)}>Remove Experience</span>
                                    <div style={{ marginBottom: "20px" }}>
                                        <AccordionUsage title={`${exp.jobTitle || "Job Title"} | ${exp.company || "Company"}`}>
                                            <div className="form-grid">
                                                <FormInput label="Job Title" value={exp.jobTitle} placeholder="e.g. Frontend Developer" onChange={(v) => updateExperience(exp.id, "jobTitle", v)} />
                                                <FormInput label="Company" value={exp.company} placeholder="e.g. Google" onChange={(v) => updateExperience(exp.id, "company", v)} />
                                                <FormInput label="Location" value={exp.location} placeholder="e.g. New York" onChange={(v) => updateExperience(exp.id, "location", v)} />
                                                <FormInput label="Start Date" value={exp.startDate} placeholder="e.g. Sep 2020" onChange={(v) => updateExperience(exp.id, "startDate", v)} />
                                                <FormInput label="End Date" value={exp.endDate} placeholder="e.g. Sep 2020" onChange={(v) => updateExperience(exp.id, "endDate", v)} />
                                                <FormTextarea label="Description" value={exp.description} placeholder="Describe your achievements... or click ✦ AI Suggest" style={{ height: "100px" }} onChange={(v) => updateExperience(exp.id, "description", v)}>
                                                    <AiButton loadingMap={aiLoading} loadKey={`exp_${exp.id}`} onClick={() => suggestExpDesc(exp)} />
                                                </FormTextarea>
                                            </div>
                                        </AccordionUsage>
                                    </div>
                                </React.Fragment>
                            ))}
                            <div className="form-group full-width" style={{ display: "flex", justifyContent: "space-between", marginTop: "30px", flexDirection: "row-reverse" }}>
                                <button type="button" className="btn-submit" onClick={() => setActiveStep(3)}>Save & Continue</button>
                                <button type="button" className="btn-back" onClick={() => setActiveStep(1)}>Back</button>
                            </div>
                        </>
                    )}

                    {/* STEP 3 — Education  */}
                    {activeStep === 3 && (
                        <>
                            <SectionHeader title="Education" description="Add your education." />
                            <span style={{ display: "block", color: "#e84545", cursor: "pointer", textDecoration: "underline" }} onClick={() => addEducation()}>+Add Education</span>
                            {resumeInfo.education.map((edu) => (
                                <React.Fragment key={edu.id}>
                                    <span style={{ display: "flex", justifyContent: "right", color: "red", cursor: "pointer", textDecoration: "underline", fontSize: "12px", zIndex: "100" }} onClick={() => removeEducation(edu.id)}>Remove Education</span>
                                    <div style={{ marginBottom: "20px" }}>
                                        <AccordionUsage title={`${edu.degree || "Degree"} | ${edu.school || "School"}`}>
                                            <div className="form-grid">
                                                <FormInput label="Degree" value={edu.degree} placeholder="e.g. Bachelor of Science" onChange={(v) => updateEducation(edu.id, "degree", v)} />
                                                <FormInput label="School" value={edu.school} placeholder="e.g. University of California" onChange={(v) => updateEducation(edu.id, "school", v)} />
                                                <FormInput label="Location" value={edu.location} placeholder="e.g. New York" onChange={(v) => updateEducation(edu.id, "location", v)} />
                                                <FormInput label="Start Date" value={edu.startDate} placeholder="e.g. Sep 2020" onChange={(v) => updateEducation(edu.id, "startDate", v)} />
                                                <FormInput label="End Date" value={edu.endDate} placeholder="e.g. Sep 2020" onChange={(v) => updateEducation(edu.id, "endDate", v)} />
                                                <FormTextarea label="Description" value={edu.description} placeholder="e.g. Graduated with honors... or click ✦ AI Suggest" style={{ height: "100px" }} onChange={(v) => updateEducation(edu.id, "description", v)}>
                                                    <AiButton loadingMap={aiLoading} loadKey={`edu_${edu.id}`} onClick={() => suggestEduDesc(edu)} />
                                                </FormTextarea>
                                            </div>
                                        </AccordionUsage>
                                    </div>
                                </React.Fragment>
                            ))}
                            <div className="form-group full-width" style={{ display: "flex", justifyContent: "space-between", marginTop: "30px", flexDirection: "row-reverse" }}>
                                <button type="button" className="btn-submit" onClick={() => setActiveStep(4)}>Save & Continue</button>
                                <button type="button" className="btn-back" onClick={() => setActiveStep(2)}>Back</button>
                            </div>
                        </>
                    )}

                    {/* STEP 4 — Skills  */}
                    {activeStep === 4 && (
                        <>
                            <SectionHeader title="Skills" description="Add your skills." />
                            <div style={{ marginBottom: "20px" }}>
                                <div className="form-grid">
                                    <FormTextarea label="Technical Skills" value={skls.technicalSkills} placeholder="e.g. React, Node.js" rows={3} onChange={(v) => updateSkills("technicalSkills", v)}>
                                        <AiButton loadingMap={aiLoading} loadKey="tech_skills" onClick={suggestTechSkills} />
                                    </FormTextarea>
                                    <FormTextarea label="Soft Skills" value={skls.softSkills} placeholder="e.g. Communication, Teamwork" rows={3} onChange={(v) => updateSkills("softSkills", v)}>
                                        <AiButton loadingMap={aiLoading} loadKey="soft_skills" onClick={suggestSoftSkills} />
                                    </FormTextarea>
                                </div>
                            </div>

                            <div className="form-group full-width" style={{ display: "flex", justifyContent: "space-between", marginTop: "30px", flexDirection: "row-reverse" }}>
                                <button type="button" className="btn-submit" onClick={() => setActiveStep(5)}>Save & Continue</button>
                                <button type="button" className="btn-back" onClick={() => setActiveStep(3)}>Back</button>
                            </div>
                        </>
                    )}

                    {/* STEP 5 — Projects  */}
                    {activeStep === 5 && (
                        <>
                            <SectionHeader title="Projects" description="Add your projects." />
                            <span style={{ display: "block", color: "#e84545", cursor: "pointer", textDecoration: "underline" }} onClick={() => addProject()}>+Add Project</span>
                            {resumeInfo.projects.map((project) => (
                                <React.Fragment key={project.id}>
                                    <span style={{ display: "flex", justifyContent: "right", color: "red", cursor: "pointer", textDecoration: "underline", fontSize: "12px", zIndex: "100" }} onClick={() => removeProject(project.id)}>Remove Project</span>
                                    <div style={{ marginBottom: "20px" }}>
                                        <AccordionUsage title={`${project.projectName || "Project Name"} `}>
                                            <div className="form-grid">
                                                <FormInput label="Project Name" value={project.projectName} placeholder="e.g. Project Name" onChange={(v) => updateProject(project.id, "projectName", v)} />
                                                <FormInput label="Project Link" value={project.projectLink} placeholder="e.g. github.com/you/project" onChange={(v) => updateProject(project.id, "projectLink", v)} />
                                                <FormTextarea label="Project Description" value={project.projectDescription} placeholder="Describe your project... or click ✦ AI Suggest" style={{ height: "80px" }} onChange={(v) => updateProject(project.id, "projectDescription", v)}>
                                                    <AiButton loadingMap={aiLoading} loadKey={`proj_${project.id}`} onClick={() => suggestProjDesc(project)} />
                                                </FormTextarea>
                                            </div>
                                        </AccordionUsage>
                                    </div>
                                </React.Fragment>
                            ))}
                            <div className="form-group full-width" style={{ display: "flex", justifyContent: "space-between", marginTop: "30px", flexDirection: "row-reverse" }}>
                                <button type="button" className="btn-submit" onClick={() => setActiveStep(6)}>Save & Continue</button>
                                <button type="button" className="btn-back" onClick={() => setActiveStep(4)}>Back</button>
                            </div>
                        </>
                    )}

                    {/* STEP 6 — Languages  */}
                    {activeStep === 6 && (
                        <>
                            <SectionHeader title="Languages" description="Add your languages." />
                            <span style={{ display: "block", color: "#e84545", cursor: "pointer", textDecoration: "underline" }} onClick={() => addLanguage()}>+Add Language</span>
                            {resumeInfo.languages.map((language) => (
                                <React.Fragment key={language.id}>
                                    <span style={{ display: "flex", justifyContent: "right", color: "red", cursor: "pointer", textDecoration: "underline", fontSize: "12px", zIndex: "100" }} onClick={() => removeLanguage(language.id)}>Remove Language</span>
                                    <div style={{ marginBottom: "20px" }}>
                                        <AccordionUsage title={`${language.languageName || "Language Name"} | ${language.languageProficiency || "Language Proficiency"}`}>
                                            <div className="form-grid">
                                                <FormInput label="Language Name" value={language.languageName} placeholder="e.g. Language Name" onChange={(v) => updateLanguage(language.id, "languageName", v)} />
                                                <FormInput label="Language Proficiency" value={language.languageProficiency} placeholder="e.g. Language Proficiency" onChange={(v) => updateLanguage(language.id, "languageProficiency", v)} />
                                            </div>
                                        </AccordionUsage>
                                    </div>
                                </React.Fragment>
                            ))}
                            <div className="form-group full-width" style={{ display: "flex", justifyContent: "space-between", marginTop: "30px", flexDirection: "row-reverse" }}>
                                <button type="button" className="btn-submit" onClick={() => setActiveStep(7)}>Save & Continue</button>
                                <button type="button" className="btn-back" onClick={() => setActiveStep(5)}>Back</button>
                            </div>
                        </>
                    )}

                    {/* STEP 7 — Summary  */}
                    {activeStep === 7 && (
                        <>
                            <SectionHeader title="Summary" description="Add your summary." />
                            <div style={{ marginBottom: "20px" }}>
                                <FormTextarea label="Summary" value={resumeInfo.summary} placeholder="e.g. Results-driven professional with 5+ years of experience... or click ✦ AI Write Summary above" style={{ minHeight: "150px" }} onChange={(v) => updateSummary(v)}>
                                    <AiButton loadingMap={aiLoading} loadKey="summary" onClick={suggestSummary} label="✦ AI Write Summary" />
                                </FormTextarea>
                            </div>
                            <div className="form-group full-width" style={{ display: "flex", justifyContent: "space-between", marginTop: "30px", flexDirection: "row-reverse" }}>
                                <button type="button" className="btn-submit" onClick={() => setActiveStep(8)}>Save & Continue</button>
                                <button type="button" className="btn-back" onClick={() => setActiveStep(6)}>Back</button>
                            </div>
                        </>
                    )}

                    {/* STEP 8 — Finalize & Additional Sections */}
                    {activeStep === 8 && (
                        <>
                            <SectionHeader title="Your CV is Ready!" description="Review your resume on the right, then download it as a PDF. You can also add optional sections below." />

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

                            <h3 style={{ fontSize: "16px", marginTop: 20, marginBottom: 15 }}>Select Template</h3>
                            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
                                <button type="button" onClick={() => setSelectedTemplate('template1')} style={{ padding: '12px 24px', border: selectedTemplate === 'template1' ? '2px solid #e84545' : '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', background: selectedTemplate === 'template1' ? 'rgba(232,69,69,0.1)' : 'transparent', color: selectedTemplate === 'template1' ? '#e84545' : 'var(--text-primary)', fontWeight: 600, transition: 'all 0.2s', fontFamily: "'Syne', sans-serif" }}>Classic</button>
                                <button type="button" onClick={() => setSelectedTemplate('template2')} style={{ padding: '12px 24px', border: selectedTemplate === 'template2' ? '2px solid #e84545' : '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', background: selectedTemplate === 'template2' ? 'rgba(232,69,69,0.1)' : 'transparent', color: selectedTemplate === 'template2' ? '#e84545' : 'var(--text-primary)', fontWeight: 600, transition: 'all 0.2s', fontFamily: "'Syne', sans-serif" }}>Modern (Blue)</button>
                                <button type="button" onClick={() => setSelectedTemplate('template3')} style={{ padding: '12px 24px', border: selectedTemplate === 'template3' ? '2px solid #e84545' : '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', background: selectedTemplate === 'template3' ? 'rgba(232,69,69,0.1)' : 'transparent', color: selectedTemplate === 'template3' ? '#e84545' : 'var(--text-primary)', fontWeight: 600, transition: 'all 0.2s', fontFamily: "'Syne', sans-serif", letterSpacing: '1px' }}>MINIMALIST</button>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '20px' }}>
                                <PDFDownloadLink
                                    document={<ResumePDFTemplate
                                        personalInfo={resumeInfo.personalInfo}
                                        experience={resumeInfo.experience}
                                        education={resumeInfo.education}
                                        skills={resumeInfo.skills}
                                        projects={resumeInfo.projects}
                                        languages={resumeInfo.languages}
                                        certifications={resumeInfo.certifications}
                                        awards={resumeInfo.awards}
                                        references={resumeInfo.references}
                                        customSections={resumeInfo.customSections}
                                        summary={resumeInfo.summary}
                                        resumeLanguage={resumeInfo.resumeLanguage}
                                        templateId={selectedTemplate}
                                    />}
                                    fileName={pi.fullName ? `${pi.fullName.replace(/\s+/g, '_')}_Resume.pdf` : "resume.pdf"}
                                    className="btn-download"
                                    style={{ textDecoration: 'none', display: 'flex', maxWidth: '350px' }}
                                >
                                    {({ loading }) => (loading ? 'Preparing Document...' : '↓ Download PDF')}
                                </PDFDownloadLink>
                            </div>

                            {/* ATS Scanner Section */}
                            {resumeInfo.resumeGoal?.mode === "targeted" && (
                                <div style={{ marginTop: "40px", padding: "20px", border: "1px solid var(--border-color)", borderRadius: "8px", backgroundColor: "rgba(232, 69, 69, 0.03)" }}>
                                    <h3 style={{ fontSize: "18px", marginBottom: "10px", color: "var(--text-primary)" }}>ATS Keyword Scanner</h3>
                                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "15px" }}>See how well your resume matches the target job description.</p>

                                    {!atsResult ? (
                                        <button type="button" onClick={analyzeATS} disabled={atsLoading} style={{ padding: "10px 20px", background: "#e84545", color: "white", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "600", opacity: atsLoading ? 0.7 : 1 }}>
                                            {atsLoading ? "Analyzing Match..." : "✦ Run ATS Scan"}
                                        </button>
                                    ) : (
                                        <div style={{ padding: "20px", backgroundColor: "var(--bg-primary)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
                                                <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: atsResult.score > 75 ? "#10b981" : atsResult.score > 50 ? "#f59e0b" : "#ef4444", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: "bold", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
                                                    {atsResult.score}%
                                                </div>
                                                <div>
                                                    <h4 style={{ margin: 0, fontSize: "18px", color: "var(--text-primary)" }}>Match Score</h4>
                                                    <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "var(--text-secondary)" }}>Based on keyword overlap</p>
                                                </div>
                                            </div>
                                            <p style={{ fontSize: "15px", lineHeight: "1.6", marginBottom: "15px", color: "var(--text-primary)" }}>{atsResult.feedback}</p>

                                            {atsResult.missingKeywords && atsResult.missingKeywords.length > 0 && (
                                                <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "rgba(239, 68, 68, 0.05)", borderRadius: "6px", borderLeft: "4px solid #ef4444" }}>
                                                    <strong style={{ display: "block", fontSize: "14px", color: "#ef4444", marginBottom: "10px" }}>Missing Keywords to Add to Your Resume:</strong>
                                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
                                                        {atsResult.missingKeywords.map((k, i) => (
                                                            <span key={i} style={{ padding: "6px 12px", backgroundColor: "white", border: "1px solid #fca5a5", color: "#c62828", borderRadius: "4px", fontSize: "13px", fontWeight: "600" }}>{k}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <button type="button" onClick={analyzeATS} disabled={atsLoading} style={{ marginTop: "20px", padding: "8px 16px", background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border-color)", borderRadius: "6px", fontSize: "14px", cursor: atsLoading ? "not-allowed" : "pointer", fontWeight: "600", transition: "all 0.2s" }} onMouseEnter={e => { e.target.style.background = "var(--border-color)" }} onMouseLeave={e => { e.target.style.background = "transparent" }}>
                                                {atsLoading ? "Rescanning..." : "Rescan Resume"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <hr style={{ margin: "40px 0", borderTop: "1px solid var(--border-color)" }} />

                            <h2 style={{ fontSize: "20px" }}>Additional Sections <span style={{ fontSize: "14px", fontWeight: "400", color: "#666" }}>(Optional)</span></h2>
                            <p>Enhance your resume by adding certifications, awards, references, or custom sections.</p>

                            {/* Certifications */}
                            <h3 style={{ marginTop: 20, marginBottom: 10, borderBottom: "1px solid #ddd", paddingBottom: 5 }}>Certifications</h3>
                            <span style={{ display: "block", color: "#e84545", cursor: "pointer", textDecoration: "underline", marginBottom: 15 }} onClick={() => addCertification()}>+Add Certification</span>
                            {resumeInfo.certifications.map((cert) => (
                                <div key={cert.id} style={{ marginBottom: "20px" }}>
                                    <span style={{ display: "flex", justifyContent: "right", color: "red", cursor: "pointer", textDecoration: "underline", fontSize: "12px", zIndex: "100" }} onClick={() => removeCertification(cert.id)}>Remove Certification</span>
                                    <AccordionUsage title={`${cert.name || "Certification Name"} | ${cert.issuer || "Issuer"}`}>
                                        <div className="form-grid">
                                            <div className="form-group"><label>Certification Name</label><input type="text" placeholder="e.g. AWS Certified Solutions Architect" value={cert.name} onChange={(e) => updateCertification(cert.id, "name", e.target.value)} /></div>
                                            <div className="form-group"><label>Issuer</label><input type="text" placeholder="e.g. Amazon Web Services" value={cert.issuer} onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)} /></div>
                                            <div className="form-group"><label>Date / Year</label><input type="text" placeholder="e.g. 2023" value={cert.date} onChange={(e) => updateCertification(cert.id, "date", e.target.value)} /></div>
                                        </div>
                                    </AccordionUsage>
                                </div>
                            ))}

                            {/* Awards */}
                            <h3 style={{ marginTop: 30, marginBottom: 10, borderBottom: "1px solid #ddd", paddingBottom: 5 }}>Awards & Achievements</h3>
                            <span style={{ display: "block", color: "#e84545", cursor: "pointer", textDecoration: "underline", marginBottom: 15 }} onClick={() => addAward()}>+Add Award</span>
                            {resumeInfo.awards.map((award) => (
                                <div key={award.id} style={{ marginBottom: "20px" }}>
                                    <span style={{ display: "flex", justifyContent: "right", color: "red", cursor: "pointer", textDecoration: "underline", fontSize: "12px", zIndex: "100" }} onClick={() => removeAward(award.id)}>Remove Award</span>
                                    <AccordionUsage title={`${award.title || "Award Title"} | ${award.awarder || "Organization"}`}>
                                        <div className="form-grid">
                                            <div className="form-group"><label>Award Title</label><input type="text" placeholder="e.g. Employee of the Month" value={award.title} onChange={(e) => updateAward(award.id, "title", e.target.value)} /></div>
                                            <div className="form-group"><label>Organization / Issuer</label><input type="text" placeholder="e.g. Google" value={award.awarder} onChange={(e) => updateAward(award.id, "awarder", e.target.value)} /></div>
                                            <div className="form-group"><label>Date / Year</label><input type="text" placeholder="e.g. 2022" value={award.date} onChange={(e) => updateAward(award.id, "date", e.target.value)} /></div>
                                            <div className="form-group full-width"><label>Description</label><textarea style={{ padding: "12px 15px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "15px", outline: "none", fontFamily: "'Syne', sans-serif" }} placeholder="Briefly describe the award" value={award.description} onChange={(e) => updateAward(award.id, "description", e.target.value)} /></div>
                                        </div>
                                    </AccordionUsage>
                                </div>
                            ))}

                            {/* References */}
                            <h3 style={{ marginTop: 30, marginBottom: 10, borderBottom: "1px solid #ddd", paddingBottom: 5 }}>References</h3>
                            <span style={{ display: "block", color: "#e84545", cursor: "pointer", textDecoration: "underline", marginBottom: 15 }} onClick={() => addReference()}>+Add Reference</span>
                            {resumeInfo.references.map((ref) => (
                                <div key={ref.id} style={{ marginBottom: "20px" }}>
                                    <span style={{ display: "flex", justifyContent: "right", color: "red", cursor: "pointer", textDecoration: "underline", fontSize: "12px", zIndex: "100" }} onClick={() => removeReference(ref.id)}>Remove Reference</span>
                                    <AccordionUsage title={`${ref.name || "Reference Name"} | ${ref.company || "Company"}`}>
                                        <div className="form-grid">
                                            <div className="form-group"><label>Full Name</label><input type="text" placeholder="e.g. Jane Doe" value={ref.name} onChange={(e) => updateReference(ref.id, "name", e.target.value)} /></div>
                                            <div className="form-group"><label>Job Title</label><input type="text" placeholder="e.g. Senior Manager" value={ref.position} onChange={(e) => updateReference(ref.id, "position", e.target.value)} /></div>
                                            <div className="form-group"><label>Company</label><input type="text" placeholder="e.g. Acme Corp" value={ref.company} onChange={(e) => updateReference(ref.id, "company", e.target.value)} /></div>
                                            <div className="form-group"><label>Contact Info</label><input type="text" placeholder="e.g. jane@example.com / +12345" value={ref.contactInfo} onChange={(e) => updateReference(ref.id, "contactInfo", e.target.value)} /></div>
                                        </div>
                                    </AccordionUsage>
                                </div>
                            ))}

                            {/* Custom Sections */}
                            <h3 style={{ marginTop: 30, marginBottom: 10, borderBottom: "1px solid #ddd", paddingBottom: 5 }}>Custom Section</h3>
                            <span style={{ display: "block", color: "#e84545", cursor: "pointer", textDecoration: "underline", marginBottom: 15 }} onClick={() => addCustomSection()}>+Add Custom Section</span>
                            {resumeInfo.customSections.map((sec) => (
                                <div key={sec.id} style={{ marginBottom: "20px" }}>
                                    <span style={{ display: "flex", justifyContent: "right", color: "red", cursor: "pointer", textDecoration: "underline", fontSize: "12px", zIndex: "100" }} onClick={() => removeCustomSection(sec.id)}>Remove Section</span>
                                    <AccordionUsage title={`${sec.sectionTitle || "Custom Section Title"}`}>
                                        <div className="form-grid">
                                            <div className="form-group full-width"><label>Section Title</label><input type="text" placeholder="e.g. Publications, Volunteering" value={sec.sectionTitle} onChange={(e) => updateCustomSection(sec.id, "sectionTitle", e.target.value)} /></div>
                                            <div className="form-group full-width"><label>Description / Details</label><textarea style={{ height: "100px", padding: "12px 15px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "15px", outline: "none", fontFamily: "'Syne', sans-serif" }} placeholder="List details separated by new lines for bullets" value={sec.description} onChange={(e) => updateCustomSection(sec.id, "description", e.target.value)} /></div>
                                        </div>
                                    </AccordionUsage>
                                </div>
                            ))}

                            <div className="form-group full-width" style={{ display: "flex", marginTop: "30px" }}>
                                <button type="button" className="btn-back" style={{ width: "100%" }} onClick={() => setActiveStep(7)}>← Back</button>
                            </div>
                        </>
                    )}

                </div>
            </div>

            <div className="builder-right">
                <div className="scale-wrapper" style={{ transform: "scale(0.85)", transformOrigin: "top center", marginBottom: "-40mm" }}>
                    <ResumeTemplate
                        personalInfo={resumeInfo.personalInfo}
                        experience={resumeInfo.experience}
                        education={resumeInfo.education}
                        skills={resumeInfo.skills}
                        projects={resumeInfo.projects}
                        languages={resumeInfo.languages}
                        certifications={resumeInfo.certifications}
                        awards={resumeInfo.awards}
                        references={resumeInfo.references}
                        customSections={resumeInfo.customSections}
                        summary={resumeInfo.summary}
                        resumeLanguage={resumeInfo.resumeLanguage}
                        templateId={selectedTemplate}
                    />
                </div>
            </div>

            {toastError && (
                <div style={{
                    position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
                    backgroundColor: "#e84545", color: "white", padding: "12px 24px",
                    borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    zIndex: 9999, fontWeight: 600, fontSize: "14px", display: "flex", alignItems: "center", gap: "8px"
                }}>
                    <span>⚠️</span> {toastError}
                </div>
            )}
        </div>
    );
};

export default Builder;