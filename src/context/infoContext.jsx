import { createContext, useState } from "react";

export const InfoContext = createContext();

const Info = {
    personalInfo: {
        fullName: "",
        jobTitle: "",
        email: "",
        phone: "",
        address: "",
        linkedin: "",
        github: "",
        portfolio: "",
    },
    experience: [],
    education: [],
    skills: {
        technicalSkills: "",
        softSkills: "",
    },
    summary: "",
    projects: [],
    languages: [],
};

export const InfoProvider = ({ children }) => {
    const [resumeInfo, setResumeInfo] = useState(Info);

    const updatePersonalInfo = (field, value) => {
        setResumeInfo(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [field]: value }
        }));
    };

    const addExperience = () => {
        setResumeInfo(prev => ({
            ...prev,
            experience: [...prev.experience, {
                id: Date.now(),
                jobTitle: "",
                company: "",
                location: "",
                startDate: "",
                endDate: "",
                description: "",
            }]
        }));
    };

    const removeExperience = (id) => {
        setResumeInfo(prev => ({
            ...prev,
            experience: prev.experience.filter((exp) => exp.id !== id)
        }));
    };

    const updateExperience = (id, field, value) => {
        setResumeInfo(prev => ({
            ...prev,
            experience: prev.experience.map((exp) => exp.id === id ? { ...exp, [field]: value } : exp)
        }));
    };

    const addEducation = () => {
        setResumeInfo(prev => ({
            ...prev,
            education: [...prev.education, {
                id: Date.now(),
                degree: "",
                school: "",
                location: "",
                startDate: "",
                endDate: "",
                description: "",
            }]
        }));
    };

    const removeEducation = (id) => {
        setResumeInfo(prev => ({
            ...prev,
            education: prev.education.filter((edu) => edu.id !== id)
        }));
    };

    const updateEducation = (id, field, value) => {
        setResumeInfo(prev => ({
            ...prev,
            education: prev.education.map((edu) => edu.id === id ? { ...edu, [field]: value } : edu)
        }));
    };

    // --- Skills ---
    const updateSkills = (field, value) => {
        setResumeInfo(prev => ({
            ...prev,
            skills: { ...prev.skills, [field]: value }
        }));
    };

    const updateSummary = (value) => {
        setResumeInfo(prev => ({ ...prev, summary: value }));
    };

    const addProject = () => {
        setResumeInfo(prev => ({
            ...prev,
            projects: [...prev.projects, {
                id: Date.now(),
                projectName: "",
                projectDescription: "",
                projectLink: "",
            }]
        }));
    };

    const removeProject = (id) => {
        setResumeInfo(prev => ({
            ...prev,
            projects: prev.projects.filter((project) => project.id !== id)
        }));
    };

    const updateProject = (id, field, value) => {
        setResumeInfo(prev => ({
            ...prev,
            projects: prev.projects.map((project) => project.id === id ? { ...project, [field]: value } : project)
        }));
    };

    const addLanguage = () => {
        setResumeInfo(prev => ({
            ...prev,
            languages: [...prev.languages, {
                id: Date.now(),
                languageName: "",
                languageProficiency: "",
            }]
        }));
    };

    const removeLanguage = (id) => {
        setResumeInfo(prev => ({
            ...prev,
            languages: prev.languages.filter((language) => language.id !== id)
        }));
    };

    const updateLanguage = (id, field, value) => {
        setResumeInfo(prev => ({
            ...prev,
            languages: prev.languages.map((language) => language.id === id ? { ...language, [field]: value } : language)
        }));
    };

    return (
        <InfoContext.Provider value={{
            resumeInfo,
            setResumeInfo,
            updatePersonalInfo,
            addExperience,
            removeExperience,
            updateExperience,
            addEducation,
            removeEducation,
            updateEducation,
            updateSkills,
            updateSummary,
            addProject,
            removeProject,
            updateProject,
            addLanguage,
            removeLanguage,
            updateLanguage
        }}>
            {children}
        </InfoContext.Provider>
    );
};