import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const skillsData = [
    {
        id: "fullstack",
        color: "#6366f1",
        title: "تطوير الويب المتكامل (Full Stack Web Development + AI Prompt Engineering)",
        description: "بناء المواقع والتطبيقات بالكامل من تصميم الواجهة الأمامية (Frontend) إلى برمجة الخوادم وقواعد البيانات (Backend).",
        whyItIsGood: "مجال تطوير الويب المتكامل هو من أكثر المجالات طلباً في عام 2026 وتستمر أهميته في التصاعد. كل الشركات الحديثة تحتاج إلى مطورين شاملين قادرين على فهم وتطوير بناء المشروع من الصفر وحتى النهاية. إنه يوفر لك فرصاً للعمل عن بعد بمرتبات مجزية ومرونة عالية لإطلاق مشاريعك الخاصة.",
        roadmap: [
            {
                step: 1,
                topic: "أساسيات بناء هيكل الويب (HTML)",
                resourceName: "مسار HTML - قناة Elzero Web School",
                resourceLink: "https://www.youtube.com/watch?v=6QAELgirvjs&list=PLDoPjvoNmBAw_t_XWUFbBX-c9MafPk9ji"
            },
            {
                step: 2,
                topic: "أساسيات بناء هيكل الويب (CSS)",
                resourceName: "مسار CSS - قناة Elzero Web School",
                resourceLink: "https://www.youtube.com/watch?v=qyVkLebgfzY&t=24164s"
            },
            {
                step: 3,
                topic: "لغة البرمجة وعصب الويب (JavaScript Bootcamp)",
                resourceName: "المعسكر الشامل لـ JavaScript - قناة Elzero",
                resourceLink: "https://www.youtube.com/watch?v=GM6dQBmc-Xg&list=PLDoPjvoNmBAx3kiplQR_oeDqLDBUDYwVv"
            },
            {
                step: 4,
                topic: "أنظمة إدارة الإصدارات (Git & GitHub)",
                resourceName: "مسار استخدام Git - قناة Elzero Web School",
                resourceLink: "https://www.youtube.com/playlist?list=PLDoPjvoNmBAw4eOj58MZPakHjaO3frVMF"
            },

            {
                step: 5,
                topic: "التعامل مع البيانات والـ API",
                resourceName: "شرح التعامل مع البيانات والـ API - قناة Tarmeez",
                resourceLink: "https://www.youtube.com/watch?v=pPnfmpj_MSQ&list=PLYyqC4bNbCIdvviLNbvYKfvHqszFPnUkj"
            },
            {
                step: 6,
                topic: "البناء المنظم وكتابة الأنواع (TypeScript)",
                resourceName: "كورس TypeScript الشامل - قناة Elzero",
                resourceLink: "https://www.youtube.com/watch?v=yUndnE-2osg&list=PLDoPjvoNmBAy532K9M_fjiAmrJ0gkCyLJ"
            },
            {
                step: 7,
                topic: "بناء واجهات تفاعلية حديثة (React.js )",
                resourceName: "أفضل دورة React ",
                resourceLink: "https://www.youtube.com/watch?v=ihRRf3EjTV8&list=PLYyqC4bNbCIdSZ-JayMLl4WO2Cr995vyS"
            },
            {
                step: 8,
                topic: "برمجة (PHP)",
                resourceName: "دورة PHP الشاملة للباك اند (Yehia Tech)",
                resourceLink: "https://www.youtube.com/watch?v=qmvjwRbtNww&t=16484s"
            },
            {
                step: 9,
                topic: "إدارة قواعد البيانات (MySQL)",
                resourceName: "كورس أساسيات قواعد بيانات MySQL - قناة Elzero",
                resourceLink: "https://www.youtube.com/watch?v=DftlOK7fCtc&list=PLDoPjvoNmBAz6DT8SzQ1CODJTH-NIA7R9&index=1"
            },
            {
                step: 10,
                topic: "إطار عمل الخوادم القوي (Laravel)",
                resourceName: "دورة Laravel",
                resourceLink: "https://www.youtube.com/watch?v=v6Vtn84gvzU"
            },

            {
                step: 11,
                topic: "ربط الواجهة الأمامية بالخلفية ورفع المشروع (React+Laravel)",
                resourceName: "بناء مشروع عملي متكامل (React & Laravel)",
                resourceLink: "https://www.youtube.com/watch?v=4nmAGK14DV0&list=PLm_sigBWSRY13JIWMkihzQq1ktg830aKm"
            },
            {
                step: 12,
                topic: "هندسة الأوامر (Prompt Engineering)",
                resourceName: "Prompt Engineering Roadmap",
                resourceLink: "#ai-prompt"
            },
            {
                step: 13,
                topic: "كورسات منوعة من anthropic (الشركة المطورة لـ Claude)",
                resourceName: "كورسات منوعة من anthropic (الشركة المطورة لـ Claude)",
                resourceLink: "https://anthropic.skilljar.com/"
            },

        ]
    },
    {
        id: "n8n",
        color: "#10b981",
        title: "أتمتة سير العمل والمهمات (Workflow Automation - n8n)",
        description: "أداة لتبسيط وأتمتة المهام وربط التطبيقات المختلفة (مثل البريد الإلكتروني، جداول البيانات، وبرامج المحادثة) دون كتابة أكواد معقدة.",
        whyItIsGood: "في هذا العصر، الأتمتة والذكاء الاصطناعي هما لغة المستقبل. الشركات تتسابق لتقليل التكاليف وزيادة الإنتاجية. بفضل أداة مثل n8n، ستكون الشخص القادر على تحويل المهام الروتينية التي تستغرق ساعات إلى خطوات تتم في ثوانٍ. هذه المهارة تجعلك عملة نادرة في أي مؤسسة وتختصر آلاف الساعات من العمل.",
        roadmap: [
            {
                step: 1,
                topic: "دورة n8n للمبتدئين",
                resourceName: "دورة n8n للمبتدئين",
                resourceLink: "https://www.youtube.com/watch?v=FBID4TaQ6OE&list=PLLHIYYlcgk6KN58UnPm8q1btNHLDJlYto"
            },
            {
                step: 2,
                topic: "دورة n8n المتقدمة من مبتدئ إلى محترف",
                resourceName: "دورة n8n المتقدمة من مبتدئ إلى محترف",
                resourceLink: "https://www.youtube.com/watch?v=J5HaXOTy16g&list=PLZ42ZUInDWC79Bw1K_tYQhUPfFRV7fy8v&index=1"
            },
        ]
    },
    {
        id: "ai-prompt",
        color: "#f59e0b",
        title: "هندسة التلقين وتطبيقات الذكاء الاصطناعي (AI Prompt Engineering)",
        description: "مهارة التخاطب الاحترافي مع نماذج الذكاء الاصطناعي (LLMs) للحصول على أقصى استفادة وحل المشاكل المعقدة.",
        whyItIsGood: "لم يعد استخدام الذكاء الاصطناعي رفاهية. قدرتك على صياغة الأوامر (Prompts) بشكل دقيق، مع فهم كيفية دمج واجهات برمجة الذكاء الاصطناعي، تتيح لك بناء أدوات قوية مثل 'خدمة عملاء ذكية' أو 'محلل بيانات آلي'. كل المشاريع الحديثة تتبنى الـ AI، ومن يتقنه اليوم سيكون له الأسبقية الكبرى غداً.",
        roadmap: [
            {
                step: 1,
                topic: " ChatGPT Prompt Engineering for Developers",
                resourceName: "دورة ChatGPT Prompt Engineering for Developers",
                resourceLink: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/"
            },
            {
                step: 2,
                topic: "دورة هندسة التلقين - Free Academy",
                resourceName: "دورة هندسة التلقين - Free Academy",
                resourceLink: "https://freeacademy.ai/courses/prompt-engineering"
            },
            {
                step: 3,
                topic: "Generative AI with Large Language Models (Advanced course)",
                resourceName: "دورة Generative AI with LLMs (Advanced course)",
                resourceLink: "https://learn.deeplearning.ai/courses/generative-ai-with-llms/information"
            }
        ]
    }
];

const SkillRecommendations = () => {
    const navigate = useNavigate();
    const [expandedSkill, setExpandedSkill] = useState(skillsData[0].id);

    // Form state
    const [skillForm, setSkillForm] = useState({
        skillName: '',
        topics: [{ id: Date.now(), title: '', link: '' }]
    });
    const [formStatus, setFormStatus] = useState(null);

    const handleTopicChange = (id, field, value) => {
        setSkillForm(prev => ({
            ...prev,
            topics: prev.topics.map(t => t.id === id ? { ...t, [field]: value } : t)
        }));
    };

    const addTopic = () => {
        setSkillForm(prev => ({
            ...prev,
            topics: [...prev.topics, { id: Date.now(), title: '', link: '' }]
        }));
    };

    const removeTopic = (id) => {
        setSkillForm(prev => ({
            ...prev,
            topics: prev.topics.filter(t => t.id !== id)
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setFormStatus('loading');
            let response, data;

            if (import.meta.env.DEV && import.meta.env.VITE_GOOGLE_SHEET_SKILLS_API) {
                // In local dev, a direct POST to Google Scripts usually triggers a CORS opaque response block or redirect issue 
                // when trying to read response.json(), even if the script successfully executed.
                // We use 'no-cors' so the browser allows the fetch, and we mock the success response.
                await fetch(import.meta.env.VITE_GOOGLE_SHEET_SKILLS_API, {
                    method: 'POST',
                    mode: 'no-cors', 
                    body: JSON.stringify(skillForm)
                });
                data = { status: 'success' };
            } else {
                response = await fetch('/api/skills', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(skillForm)
                });
                data = await response.json();
            }

            if (data.status === 'success') {
                setFormStatus('success');
                // Reset form
                setSkillForm({
                    skillName: '',
                    topics: [{ id: Date.now(), title: '', link: '' }]
                });
                setTimeout(() => setFormStatus(null), 5000);
            } else {
                setFormStatus(null);
                alert("Error: " + (data.message || "Failed to submit skill."));
            }
        } catch(error) {
            console.error("Submission error:", error);
            setFormStatus(null);
            alert("Error: connection failed.");
        }
    };

    const toggleSkill = (id) => {
        setExpandedSkill(prev => (prev === id ? null : id));
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)", padding: "100px 20px 60px", fontFamily: "'Syne', 'Tajawal', sans-serif" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontFamily: "'Syne', 'Tajawal', sans-serif", fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '30px', transition: 'all 0.2s', fontWeight: 600 }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.05)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        ← Return Home
                    </button>
                    <a href="#suggest-skill">
                        <button style={{ background: 'transparent', border: '1px solid #6366f1', color: '#6366f1', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontFamily: "'Syne', 'Tajawal', sans-serif", fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '30px', transition: 'all 0.2s', fontWeight: 600 }}>suggest a skill</button>
                    </a>
                </div>
                <h1 style={{ fontSize: "36px", color: "var(--text-primary)", marginBottom: "15px", fontWeight: 800 }}>Best Skills 2026</h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "16px", marginBottom: "50px", lineHeight: 1.8 }}>
                    We have selected and summarized the best learning paths for the most in-demand technical fields. Instead of getting confused between hundreds of courses, follow this precise roadmap and start learning what will guarantee a bright professional future through the best free Arabic resources on YouTube.
                </p>

                <div dir="rtl" style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                    {skillsData.map((skill) => {
                        const isExpanded = expandedSkill === skill.id;
                        return (
                            <div
                                key={skill.id}
                                id={skill.id}
                                style={{
                                    border: `2px solid ${isExpanded ? skill.color : "var(--border-color)"}`,
                                    borderRadius: "12px",
                                    backgroundColor: "var(--bg-primary)",
                                    overflow: "hidden",
                                    transition: "all 0.3s ease",
                                    boxShadow: isExpanded ? `0 10px 30px ${skill.color}33` : "none"
                                }}
                            >
                                {/* Header (Clickable) */}
                                <div
                                    onClick={() => toggleSkill(skill.id)}
                                    style={{
                                        padding: "25px 30px",
                                        cursor: "pointer",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        backgroundColor: isExpanded ? "rgba(99, 102, 241, 0.03)" : "transparent"
                                    }}
                                >
                                    <div>
                                        <h2 style={{ fontSize: "22px", fontWeight: 800, color: isExpanded ? skill.color : "var(--text-primary)", marginBottom: "8px", transition: "color 0.3s" }}>
                                            {skill.title}
                                        </h2>
                                        <p style={{ color: "var(--text-secondary)", fontSize: "15px", margin: 0 }}>
                                            {skill.description}
                                        </p>
                                    </div>
                                    <div style={{
                                        width: "36px",
                                        height: "36px",
                                        borderRadius: "50%",
                                        backgroundColor: isExpanded ? skill.color : "rgba(150, 150, 150, 0.2)",
                                        color: isExpanded ? "#fff" : "var(--text-primary)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "20px",
                                        flexShrink: 0,
                                        marginRight: "20px", // Adjusted for RTL
                                        transition: "all 0.3s"
                                    }}>
                                        {isExpanded ? "−" : "+"}
                                    </div>
                                </div>

                                {/* Body (Expanded Content) */}
                                {isExpanded && (
                                    <div style={{ padding: "0 30px 30px", borderTop: "1px solid var(--border-color)", paddingTop: "25px", animation: "fadeIn 0.4s ease" }}>
                                        <div style={{ marginBottom: "30px" }}>
                                            <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#6366f1", marginBottom: "10px" }}>
                                                لماذا هذا المجال بالتحديد مميز وقوي؟
                                            </h3>
                                            <p style={{ color: "var(--text-primary)", fontSize: "16px", lineHeight: 1.8 }}>
                                                {skill.whyItIsGood}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#e84545", marginBottom: "15px" }}>
                                                خارطة الطريق (Roadmap) للتعلم
                                            </h3>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                                {skill.roadmap.map((node) => (
                                                    <div key={node.step} style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
                                                        <div style={{
                                                            width: "32px",
                                                            height: "32px",
                                                            borderRadius: "6px",
                                                            backgroundColor: skill.color,
                                                            color: "#fff",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            fontSize: "15px",
                                                            fontWeight: 700,
                                                            flexShrink: 0,
                                                            marginTop: "3px"
                                                        }}>
                                                            {node.step}
                                                        </div>
                                                        <div style={{ backgroundColor: "rgba(150, 150, 150, 0.1)", padding: "15px", borderRadius: "8px", flex: 1, border: "1px solid var(--border-color)" }}>
                                                            <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
                                                                {node.topic}
                                                            </div>
                                                            <a
                                                                href={node.resourceLink}
                                                                onClick={(e) => {
                                                                    if (node.resourceLink.startsWith('#')) {
                                                                        e.preventDefault();
                                                                        const targetId = node.resourceLink.substring(1);
                                                                        setExpandedSkill(targetId);
                                                                        setTimeout(() => {
                                                                            const element = document.getElementById(targetId);
                                                                            if (element) {
                                                                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                                            }
                                                                        }, 150);
                                                                    }
                                                                }}
                                                                target={node.resourceLink.startsWith('#') ? "_self" : "_blank"}
                                                                rel="noopener noreferrer"
                                                                style={{
                                                                    fontSize: "15px",
                                                                    color: "#6366f1",
                                                                    textDecoration: "none",
                                                                    display: "inline-flex",
                                                                    alignItems: "center",
                                                                    gap: "5px",
                                                                    fontWeight: 600
                                                                }}
                                                            >
                                                                <span style={{ textDecoration: "underline" }}>{node.resourceName}</span>
                                                                <span style={{ fontSize: "14px", marginRight: "5px" }}>←</span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div style={{ marginTop: "30px", padding: "15px 20px", backgroundColor: "rgba(232, 69, 69, 0.08)", borderRight: "4px solid #e84545", borderRadius: "8px" }}>
                                                <p style={{ margin: 0, color: "var(--text-primary)", fontSize: "15px", lineHeight: "1.8", fontWeight: 500 }}>
                                                    <strong style={{ color: "#e84545" }}>ملاحظة هامة: </strong>
                                                    هذه المسارات لا تغطي كل الأدوات والتقنيات بنسبة 100%، وهناك أدوات ومواضيع أخرى لم تُذكر هنا. لكن لا تقلق، ستكتشفها وتتعلمها تدريجياً مع الوقت ومن خلال المعرفة والمشاكل البرمجية التي ستواجهها وتحلها خلال رحلتك.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Suggest a Skill Form Section */}
                <div style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid var(--border-color)' }} id="suggest-skill">
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '30px', color: 'var(--text-primary)', marginBottom: '16px', fontWeight: '800', fontFamily: "'Syne', 'Tajawal', sans-serif" }}>Suggest a Skill</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', fontFamily: "'Syne', 'Tajawal', sans-serif" }}>
                            Want us to add a new roadmap? Submit a skill with its recommended resources below!
                        </p>
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-primary)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
                        {formStatus === 'success' && (
                            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '8px', border: '1px solid #10b981', textAlign: 'center', fontWeight: '600' }}>
                                Thank you! Your suggestion has been recorded successfully.
                            </div>
                        )}

                        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Syne', 'Tajawal', sans-serif" }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label htmlFor="skillName" style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '15px' }}>Name of Skill</label>
                                <input
                                    type="text"
                                    id="skillName"
                                    value={skillForm.skillName}
                                    onChange={(e) => setSkillForm(prev => ({ ...prev, skillName: e.target.value }))}
                                    required
                                    style={{ padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-primary)', fontSize: '16px', outline: 'none', transition: 'border-color 0.3s' }}
                                    onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                    placeholder="e.g. Python for Data Science"
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <label style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '15px' }}>Roadmap Topics</label>
                                </div>

                                {skillForm.topics.map((topic, index) => (
                                    <div key={topic.id} style={{ display: 'flex', gap: '16px', alignItems: 'center', backgroundColor: 'rgba(99, 102, 241, 0.02)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
                                        <div style={{ flex: '1 1 min-width: 200px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Topic Name</label>
                                            <input
                                                type="text"
                                                value={topic.title}
                                                onChange={(e) => handleTopicChange(topic.id, 'title', e.target.value)}
                                                required
                                                style={{ padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '15px', outline: 'none' }}
                                                placeholder={`Topic #${index + 1}`}
                                            />
                                        </div>
                                        <div style={{ flex: '2 1 min-width: 250px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Course/Resource Link</label>
                                            <input
                                                type="url"
                                                value={topic.link}
                                                onChange={(e) => handleTopicChange(topic.id, 'link', e.target.value)}
                                                required
                                                style={{ padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '15px', outline: 'none' }}
                                                placeholder="https://..."
                                            />
                                        </div>
                                        {skillForm.topics.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeTopic(topic.id)}
                                                style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid #ef4444', backgroundColor: 'transparent', color: '#ef4444', fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', alignSelf: 'flex-end', transition: 'all 0.2s' }}
                                                onMouseEnter={(e) => { e.target.style.backgroundColor = '#ef4444'; e.target.style.color = 'white'; }}
                                                onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#ef4444'; }}
                                                title="Remove Topic"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={addTopic}
                                    style={{ padding: '12px', borderRadius: '8px', border: '2px dashed #6366f1', backgroundColor: 'rgba(99, 102, 241, 0.05)', color: '#6366f1', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(99, 102, 241, 0.1)'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(99, 102, 241, 0.05)'}
                                >
                                    <span style={{ fontSize: '20px' }}>+</span> Add Topic
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={formStatus === 'loading'}
                                style={{
                                    padding: '16px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: formStatus === 'loading' ? '#a5b4fc' : '#6366f1',
                                    color: '#ffffff',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: formStatus === 'loading' ? 'not-allowed' : 'pointer',
                                    transition: 'background-color 0.3s, transform 0.1s',
                                    marginTop: '20px'
                                }}
                                onMouseEnter={(e) => { if (formStatus !== 'loading') e.target.style.backgroundColor = '#4f46e5'; }}
                                onMouseLeave={(e) => { if (formStatus !== 'loading') e.target.style.backgroundColor = '#6366f1'; }}
                                onMouseDown={(e) => { if (formStatus !== 'loading') e.target.style.transform = 'scale(0.98)'; }}
                                onMouseUp={(e) => { e.target.style.transform = 'scale(1)'; }}
                            >
                                {formStatus === 'loading' ? 'Submitting...' : 'Submit Skill Suggestion'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
            `}</style>
        </div>
    );
};

export default SkillRecommendations;
