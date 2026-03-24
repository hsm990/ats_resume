import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';



const ResumePDFTemplate = ({ personalInfo, experience, education, skills, projects, languages, summary, certifications, awards, references, customSections, resumeLanguage, templateId = 'template1' }) => {
    
    const getFontFamily = (tId) => tId === 'template2' ? 'Helvetica' : tId === 'template3' ? 'Courier' : 'Times-Roman';
    const getBoldFontFamily = (tId) => tId === 'template2' ? 'Helvetica-Bold' : tId === 'template3' ? 'Courier-Bold' : 'Times-Bold';
    const getItalicFontFamily = (tId) => tId === 'template2' ? 'Helvetica-Oblique' : tId === 'template3' ? 'Courier-Oblique' : 'Times-Italic';
    const getPrimaryColor = (tId) => tId === 'template2' ? '#1e3a8a' : '#000000';
    const getSecondaryColor = (tId) => tId === 'template2' ? '#475569' : '#111111';

    const styles = React.useMemo(() => StyleSheet.create({
        page: { padding: '20mm', fontFamily: getFontFamily(templateId), fontSize: 11.5, lineHeight: 1.45, color: '#111' },
        header: { textAlign: 'center', marginBottom: 12 },
        name: { 
            fontSize: 24, 
            fontFamily: getBoldFontFamily(templateId), 
            marginBottom: 4, 
            color: getPrimaryColor(templateId),
            textTransform: templateId === 'template2' ? 'uppercase' : 'none',
            borderBottomWidth: templateId === 'template3' ? 2 : 0,
            borderBottomColor: '#333',
            paddingBottom: templateId === 'template3' ? 4 : 0
        },
        jobTitle: { fontSize: 14, fontFamily: getBoldFontFamily(templateId), marginBottom: 8, color: getSecondaryColor(templateId) },
        contactRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
        contactItem: { marginHorizontal: 3 },
        section: { marginTop: 14 },
        sectionTitle: { 
            fontSize: 13.5, 
            fontFamily: getBoldFontFamily(templateId), 
            borderBottomWidth: templateId === 'template3' ? 1 : 1.5, 
            borderBottomColor: templateId === 'template3' ? '#666' : getPrimaryColor(templateId), 
            borderStyle: templateId === 'template3' ? 'dashed' : 'solid',
            color: getPrimaryColor(templateId),
            paddingBottom: 2, 
            marginBottom: 8, 
            textTransform: 'uppercase' 
        },
        summary: { textAlign: 'justify' },
        expBlock: { marginBottom: 12 },
        expRole: { fontSize: 12, fontFamily: getBoldFontFamily(templateId), marginBottom: 2 },
        expMeta: { flexDirection: 'row', justifyContent: 'space-between', fontFamily: getItalicFontFamily(templateId), marginBottom: 6 },
        boldLabel: { fontFamily: getBoldFontFamily(templateId), fontStyle: 'normal' },
        bulletRow: { flexDirection: 'row', marginBottom: 3, paddingLeft: 18 },
        bulletText: { flex: 1, textAlign: 'justify' },
        eduBlock: { marginBottom: 10 },
        eduDegreeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
        eduDegree: { fontSize: 12, fontFamily: getBoldFontFamily(templateId) },
        skillsRow: { marginBottom: 4 },
        projBlock: { marginBottom: 10 },
        projName: { fontSize: 12, fontFamily: getBoldFontFamily(templateId), marginBottom: 2 },
        projLink: { fontSize: 11, fontFamily: getItalicFontFamily(templateId), marginBottom: 4 },
    }), [templateId]);

    const textFR = { summary: "Résumé Professionnel", experience: "Expérience Professionnelle", education: "Éducation", skills: "Compétences", technicalSkills: "Compétences techniques:", softSkills: "Compétences interpersonnelles:", projects: "Projets", languages: "Langues", certifications: "Certifications", awards: "Prix", references: "Références" };
    const textEN = { summary: "Professional Summary", experience: "Professional Experience", education: "Education", skills: "Skills", technicalSkills: "Technical Skills:", softSkills: "Soft Skills:", projects: "Projects", languages: "Languages", certifications: "Certifications", awards: "Awards", references: "References" };
    const t = resumeLanguage === 'fr' ? textFR : textEN;
    const pi = personalInfo || {};
    const exps = experience || [];
    const edus = education || [];
    const skls = skills || { technicalSkills: "", softSkills: "" };
    const prjs = projects || [];
    const lngs = languages || [];
    const certs = certifications || [];
    const awrds = awards || [];
    const refs = references || [];
    const custs = customSections || [];
    const sum = summary || "";
    
    const technicalSkills = (skls.technicalSkills || "").split(",").map(x => x.trim()).filter(Boolean);
    const softSkills = (skls.softSkills || "").split(",").map(x => x.trim()).filter(Boolean);

    const fmt = (d) => {
        if (!d) return "";
        const [y, m] = d.split("-");
        if (!m || !y) return d;
        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][+m - 1] + " " + y;
    };

    const toBullets = (text) => {
        if (!text?.trim()) return [];
        return text.split("\n").map(l => l.replace(/^[\s\-•*]+/, "").trim()).filter(Boolean);
    };

    const ContactSeparator = () => <Text style={styles.contactItem}> | </Text>;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.name}>{pi.fullName || "Your Name"}</Text>
                    {pi.jobTitle && <Text style={styles.jobTitle}>{pi.jobTitle}</Text>}
                    {/* Render contact info if any exists */}
                    {(pi.address || pi.email || pi.phone || pi.linkedin || pi.github) && (
                        <View style={styles.contactRow}>
                            {pi.address && <Text style={styles.contactItem}>{pi.address} </Text>}
                            {pi.address && pi.email && <ContactSeparator />}
                            {pi.email && <Text style={styles.contactItem}>{pi.email} </Text>}
                            {pi.email && pi.phone && <ContactSeparator />}
                            {pi.phone && <Text style={styles.contactItem}>{pi.phone} </Text>}
                            {pi.phone && pi.linkedin && <ContactSeparator />}
                            {pi.linkedin && <Link src={pi.linkedin} style={{ ...styles.contactItem, ...styles.boldLabel, color: '#111', textDecoration: 'none' }}>LinkedIn </Link>}
                            {(pi.linkedin || pi.phone) && pi.github && <ContactSeparator />}
                            {pi.github && <Link src={pi.github} style={{ ...styles.contactItem, ...styles.boldLabel, color: '#111', textDecoration: 'none' }}>GitHub </Link>}
                        </View>
                    )}
                </View>

                {sum && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t.summary}</Text>
                        <Text style={styles.summary}>{sum}</Text>
                    </View>
                )}

                {exps.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t.experience}</Text>
                        {exps.map(e => (
                            <View style={styles.expBlock} key={e.id}>
                                <Text style={styles.expRole}>{e.jobTitle}</Text>
                                <View style={styles.expMeta}>
                                    <Text><Text style={styles.boldLabel}>{e.company}</Text>{e.location ? `, ${e.location}` : ""} </Text>
                                    <Text>{fmt(e.startDate)}{e.startDate ? " \u2013 " : ""}{fmt(e.endDate) || (e.startDate ? "Present" : "")}</Text>
                                </View>
                                {toBullets(e.description).map((line, i) => (
                                    <View style={styles.bulletRow} key={i}>
                                        <Text style={{ width: 10 }}>• </Text>
                                        <Text style={styles.bulletText}>{line}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                )}

                {edus.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t.education}</Text>
                        {edus.map(e => (
                            <View style={styles.eduBlock} key={e.id}>
                                <View style={styles.eduDegreeRow}>
                                    <Text style={styles.eduDegree}>{e.degree} </Text>
                                    {(e.startDate || e.endDate) && (
                                        <Text>{fmt(e.startDate)}{e.startDate && e.endDate ? " \u2013 " : ""}{fmt(e.endDate)}</Text>
                                    )}
                                </View>
                                <Text>{e.school}{e.location ? `, ${e.location}` : ""}</Text>
                                {e.description && <Text>{e.description}</Text>}
                            </View>
                        ))}
                    </View>
                )}

                {(technicalSkills.length > 0 || softSkills.length > 0) && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t.skills}</Text>
                        {technicalSkills.length > 0 && (
                            <Text style={styles.skillsRow}><Text style={styles.boldLabel}>{t.technicalSkills} </Text>{technicalSkills.join(", ")}</Text>
                        )}
                        {softSkills.length > 0 && (
                            <Text style={styles.skillsRow}><Text style={styles.boldLabel}>{t.softSkills} </Text>{softSkills.join(", ")}</Text>
                        )}
                    </View>
                )}

                {prjs.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t.projects}</Text>
                        {prjs.map(pr => (
                            <View style={styles.projBlock} key={pr.id}>
                                <Text style={styles.projName}>
                                    {pr.projectName}
                                    {pr.projectLink && <Text style={{ fontFamily: 'Times-Roman', fontWeight: 'normal' }}> | {pr.projectLink}</Text>}
                                </Text>
                                {pr.projectDescription && toBullets(pr.projectDescription).map((line, i) => (
                                    <View style={styles.bulletRow} key={i}>
                                        <Text style={{ width: 10 }}>•</Text>
                                        <Text style={styles.bulletText}>{line}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                )}

                {lngs.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t.languages}</Text>
                        <Text style={styles.skillsRow}>
                            {lngs.map((l, i) => (
                                <React.Fragment key={l.id}>
                                    <Text style={styles.boldLabel}>{l.languageName} </Text> {l.languageProficiency ? `(${l.languageProficiency})` : ""}
                                    {i < lngs.length - 1 ? ", " : ""}
                                </React.Fragment>
                            ))}
                        </Text>
                    </View>
                )}

                {certs.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t.certifications}</Text>
                        {certs.map(c => (
                            <View style={styles.projBlock} key={c.id}>
                                <Text style={styles.projName}>
                                    {c.name}
                                    {c.date && <Text style={{ fontFamily: 'Times-Roman', fontWeight: 'normal' }}> | {c.date} </Text>}
                                </Text>
                                {c.issuer && <Text style={{ fontSize: 11, fontFamily: 'Times-Italic', marginBottom: 4 }}>{c.issuer} </Text>}
                            </View>
                        ))}
                    </View>
                )}

                {awrds.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t.awards}</Text>
                        {awrds.map(a => (
                            <View style={styles.projBlock} key={a.id}>
                                <Text style={styles.projName}>
                                    {a.title}
                                    {a.date && <Text style={{ fontFamily: 'Times-Roman', fontWeight: 'normal' }}> | {a.date} </Text>}
                                </Text>
                                {a.awarder && <Text style={{ fontSize: 11, fontFamily: 'Times-Italic', marginBottom: 2 }}>{a.awarder} </Text>}
                                {a.description && <Text>{a.description}</Text>}
                            </View>
                        ))}
                    </View>
                )}

                {custs.length > 0 && custs.map(c => (
                    <View style={styles.section} key={c.id}>
                        <Text style={styles.sectionTitle}>{c.sectionTitle}</Text>
                        {c.description && toBullets(c.description).map((line, i) => (
                            <View style={styles.bulletRow} key={i}>
                                <Text style={{ width: 10 }}>• </Text>
                                <Text style={styles.bulletText}>{line} </Text>
                            </View>
                        ))}
                    </View>
                ))}

                {refs.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t.references}</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20 }}>
                            {refs.map((r, i) => (
                                <View key={r.id} style={{ width: '45%', marginBottom: 8 }}>
                                    <Text style={{ fontSize: 12, fontFamily: 'Times-Bold' }}>{r.name} </Text>
                                    {r.position && <Text style={{ fontSize: 11, fontFamily: 'Times-Italic' }}>{r.position}{r.company ? `, ${r.company}` : ''} </Text>}
                                    {r.contactInfo && <Text style={{ fontSize: 11 }}>{r.contactInfo} </Text>}
                                </View>
                            ))}
                        </View>
                    </View>
                )}
            </Page>
        </Document>
    );
};

export default ResumePDFTemplate;
