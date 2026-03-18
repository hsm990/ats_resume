const ResumeTemplate = ({ personalInfo, experience, education, skills, projects, languages, summary }) => {

    const pi = personalInfo || {};
    const exps = experience || [];
    const edus = education || [];
    const skls = skills || { technicalSkills: "", softSkills: "" };
    const prjs = projects || [];
    const lngs = languages || [];
    const sum = summary || "";
    const technicalSkills = (skls.technicalSkills || "").split(",").map(x => x.trim()).filter(Boolean);
    const softSkills = (skls.softSkills || "").split(",").map(x => x.trim()).filter(Boolean);


    const fmt = (d) => {
        if (!d) return "";
        const [y, m] = d.split("-");
        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][+m - 1] + " " + y;
    };

    const toBullets = (text) => {
        if (!text?.trim()) return [];
        return text.split("\n").map(l => l.replace(/^[\s\-•*]+/, "").trim()).filter(Boolean);
    };

    const isEmpty = !pi.fullName && exps.length === 0 && !sum;

    return (
        <>
            <style>{`

                .cv-paper {
                    width: 210mm;
                    min-height: 297mm;
                    background: #ffffff;
                    padding: 20mm;
                    box-shadow: 0 1px 18px rgba(0,0,0,.10);
                    font-family: 'Times New Roman', Times, Georgia, serif;
                    color: #111;
                    font-size: 11.5px;
                    line-height: 1.45;
                    overflow: hidden;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                    box-sizing: border-box;
                    margin: 0 auto;
                }

                /* Header */
                .cv-name {
                    font-size: 19px;
                    font-weight: 700;
                    color: #000;
                    margin: 0 0 1px;
                    line-height: 1.15;
                }
                .cv-job-title {
                    font-size: 12px;
                    font-weight: 700;
                    color: #111;
                    margin: 0 0 4px;
                }
                .cv-header-row1 {
                    display: flex;
                    justify-content: space-between;
                    align-items: baseline;
                    font-size: 11px;
                    color: #333;
                    margin-bottom: 1px;
                }
                .cv-header-row2 {
                    font-size: 11px;
                    color: #333;
                    margin-bottom: 0;
                }
                .cv-rule-thick {
                    border: none;
                    border-top: 1.5px solid #000;
                    margin: 7px 0 0;
                }

                /* Sections */
                .cv-section { margin-top: 14px; }
                .cv-section h2.cv-section-title {
                    font-size: 13.5px;
                    font-weight: 700;
                    color: #000;
                    border-bottom: 1.5px solid #000;
                    padding-bottom: 2px;
                    margin: 0 0 8px 0;
                    text-transform: uppercase;
                }

                /* Summary */
                .cv-summary {
                    font-size: 11.5px;
                    color: #111;
                    line-height: 1.6;
                    text-align: justify;
                }

                /* Experience */
                .cv-exp-block { margin-bottom: 12px; }
                .cv-exp-role {
                    font-size: 12px;
                    font-weight: 700;
                    color: #000;
                    margin-bottom: 2px;
                }
                .cv-exp-meta {
                    display: flex;
                    justify-content: space-between;
                    font-size: 11.5px;
                    font-style: italic;
                    color: #000;
                    margin-bottom: 6px;
                }
                
                /* Lists (ATS friendly) */
                ul.cv-list {
                    margin: 0;
                    padding-left: 18px;
                }
                ul.cv-list li {
                    font-size: 11.5px;
                    color: #111;
                    line-height: 1.6;
                    margin-bottom: 3px;
                }

                /* Education */
                .cv-edu-block { margin-bottom: 10px; }
                .cv-edu-degree {
                    font-size: 12px;
                    font-weight: 700;
                    color: #000;
                    margin-bottom: 2px;
                    display: flex;
                    justify-content: space-between;
                }
                .cv-edu-school {
                    font-size: 11.5px;
                    color: #111;
                }

                /* Skills */
                .cv-skills-category {
                    font-size: 11.5px;
                    line-height: 1.6;
                    margin-bottom: 4px;
                }

                /* Projects */
                .cv-proj-block { margin-bottom: 10px; }
                .cv-proj-name {
                    font-size: 12px;
                    font-weight: 700;
                    color: #000;
                    margin-bottom: 2px;
                }
                .cv-proj-link {
                    font-size: 11px;
                    color: #111;
                    font-style: italic;
                    margin-bottom: 4px;
                }

                /* Empty state */
                .cv-empty {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    min-height: 400px;
                    color: #999;
                    font-size: 16px;
                    font-family: inherit;
                }
            `}</style>

            <div className="cv-paper" id="cv-print-area">
                {isEmpty ? (
                    <div className="cv-empty">Preview will appear here</div>
                ) : (
                    <>
                        {/* ── HEADER ── */}
                        <div style={{ textAlign: "center", marginBottom: "12px" }}>
                            <h1 className="cv-name" style={{ fontSize: "24px", marginBottom: "4px" }}>{pi.fullName || "Your Name"}</h1>
                            {pi.jobTitle && <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>{pi.jobTitle}</div>}

                            {/* ATS Friendly Contact Line with Pipes */}
                            <div style={{ fontSize: "11.5px", color: "#111", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px" }}>
                                {pi.address && <span>{pi.address}</span>}
                                {pi.address && pi.email && <span>|</span>}
                                {pi.email && <span>{pi.email}</span>}
                                {pi.email && pi.phone && <span>|</span>}
                                {pi.phone && <span>{pi.phone}</span>}
                                {pi.phone && pi.linkedin && <span>|</span>}
                                {pi.linkedin && <a href={pi.linkedin} style={{ color: "#111", textDecoration: "none" }}>LinkedIn</a>}
                                {(pi.linkedin || pi.phone) && pi.github && <span>|</span>}
                                {pi.github && <a href={pi.github} style={{ color: "#111", textDecoration: "none" }}>GitHub</a>}
                            </div>
                        </div>

                        {sum && (
                            <section className="cv-section">
                                <h2 className="cv-section-title">Professional Summary</h2>
                                <p className="cv-summary">{sum}</p>
                            </section>
                        )}

                        {exps.length > 0 && (
                            <section className="cv-section">
                                <h2 className="cv-section-title">Professional Experience</h2>
                                {exps.map(e => (
                                    <div className="cv-exp-block" key={e.id}>
                                        <div className="cv-exp-role">{e.jobTitle || "Position Title"}</div>
                                        <div className="cv-exp-meta">
                                            <span>
                                                <strong>{e.company || "Company Name"}</strong>{e.location ? `, ${e.location}` : ""}
                                            </span>
                                            <span>
                                                {fmt(e.startDate)}{e.startDate ? " \u2013 " : ""}{fmt(e.endDate) || (e.startDate ? "Present" : "")}
                                            </span>
                                        </div>
                                        <ul className="cv-list">
                                            {toBullets(e.description).map((line, i) => (
                                                <li key={i}>{line}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </section>
                        )}

                        {edus.length > 0 && (
                            <section className="cv-section">
                                <h2 className="cv-section-title">Education</h2>
                                {edus.map(e => (
                                    <div className="cv-edu-block" key={e.id}>
                                        <div className="cv-edu-degree">
                                            <span>{e.degree || "Degree Name"}</span>
                                            {(e.startDate || e.endDate) && (
                                                <span style={{ fontWeight: 400 }}>
                                                    {fmt(e.startDate)}{e.startDate && e.endDate ? " \u2013 " : ""}{fmt(e.endDate)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="cv-edu-school">
                                            {e.school || "Institution Name"}{e.location ? `, ${e.location}` : ""}
                                            {e.description && <span><br />{e.description}</span>}
                                        </div>
                                    </div>
                                ))}
                            </section>
                        )}

                        {(technicalSkills.length > 0 || softSkills.length > 0) && (
                            <section className="cv-section">
                                <h2 className="cv-section-title">Skills</h2>
                                {technicalSkills.length > 0 && (
                                    <div className="cv-skills-category">
                                        <strong>Technical Skills:</strong> {technicalSkills.join(", ")}
                                    </div>
                                )}
                                {softSkills.length > 0 && (
                                    <div className="cv-skills-category">
                                        <strong>Soft Skills:</strong> {softSkills.join(", ")}
                                    </div>
                                )}
                            </section>
                        )}

                        {/* ── PROJECTS ── */}
                        {prjs.length > 0 && (
                            <section className="cv-section">
                                <h2 className="cv-section-title">Projects</h2>
                                {prjs.map(pr => (
                                    <div className="cv-proj-block" key={pr.id}>
                                        <div className="cv-proj-name">
                                            {pr.projectName || "Project Name"}
                                            {pr.projectLink && <span className="cv-proj-link" style={{ fontWeight: "normal", marginLeft: "8px" }}>| <a href={pr.projectLink} style={{ color: "#111", textDecoration: "none" }}>{pr.projectLink}</a></span>}
                                        </div>
                                        {pr.projectDescription && (
                                            <ul className="cv-list">
                                                {toBullets(pr.projectDescription).map((line, i) => (
                                                    <li key={i}>{line}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </section>
                        )}

                        {lngs.length > 0 && (
                            <section className="cv-section">
                                <h2 className="cv-section-title">Languages</h2>
                                <div className="cv-skills-category">
                                    {lngs.map((l, i) => (
                                        <span key={l.id}>
                                            <strong>{l.languageName}</strong> {l.languageProficiency ? `(${l.languageProficiency})` : ""}
                                            {i < lngs.length - 1 ? ", " : ""}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default ResumeTemplate;