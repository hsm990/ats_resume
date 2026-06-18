export const textFR = {
    summary: "Résumé Professionnel",
    experience: "Expérience Professionnelle",
    education: "Éducation",
    skills: "Compétences",
    technicalSkills: "Compétences techniques:",
    softSkills: "Compétences interpersonnelles:",
    projects: "Projets",
    languages: "Langues",
    certifications: "Certifications",
    awards: "Prix",
    references: "Références"
};

export const textEN = {
    summary: "Professional Summary",
    experience: "Professional Experience",
    education: "Education",
    skills: "Skills",
    technicalSkills: "Technical Skills:",
    softSkills: "Soft Skills:",
    projects: "Projects",
    languages: "Languages",
    certifications: "Certifications",
    awards: "Awards",
    references: "References"
};

export const fmt = (d) => {
    if (!d) return "";
    if (typeof d !== 'string') return d;
    const pts = d.split("-");
    if (pts.length < 2) return d;
    const [y, m] = pts;
    const mIdx = parseInt(m, 10) - 1;
    if (isNaN(mIdx) || mIdx < 0 || mIdx > 11) return d;
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][mIdx] + " " + y;
};

export const toBullets = (text) => {
    if (!text?.trim()) return [];
    return text.split("\n").map(l => l.replace(/^[\s\-•*]+/, "").trim()).filter(Boolean);
};
