import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { textFR, textEN, fmt, toBullets } from "../../utils/resumeUtils";

const ResumePDFTemplate = ({ personalInfo, experience, education, skills, projects, languages, summary, certifications, awards, references, customSections, resumeLanguage, templateId = 'template1' }) => {

    const getFontFamily = (tId) => tId === 'template2' ? 'Helvetica' : tId === 'template3' ? 'Courier' : 'Times-Roman';
    const getBoldFontFamily = (tId) => tId === 'template2' ? 'Helvetica-Bold' : tId === 'template3' ? 'Courier-Bold' : 'Times-Bold';
    const getItalicFontFamily = (tId) => tId === 'template2' ? 'Helvetica-Oblique' : tId === 'template3' ? 'Courier-Oblique' : 'Times-Italic';
    const getPrimaryColor = (tId) => tId === 'template2' ? '#1e3a8a' : '#000000';
    const getSecondaryColor = (tId) => tId === 'template2' ? '#475569' : '#111111';

    const styles = React.useMemo(() => StyleSheet.create({
        page: {
            // Reduced padding: was '20mm', now tighter horizontal + vertical
            paddingTop: 28,
            paddingBottom: 28,
            paddingHorizontal: 36,
            fontFamily: getFontFamily(templateId),
            fontSize: 9,
            // Reduced lineHeight: was 1.25, now tighter
            lineHeight: 1.2,
            color: '#111'
        },
        header: {
            textAlign: 'center',
            // Reduced marginBottom: was 6
            marginBottom: 4,
            paddingBottom: templateId === 'template3' ? 5 : 0,
            borderBottomWidth: templateId === 'template3' ? 1 : 0,
            borderBottomColor: '#333',
            borderStyle: 'solid'
        },
        name: {
            fontSize: templateId === 'template3' ? 16 : 19,
            fontFamily: getBoldFontFamily(templateId),
            // Reduced marginBottom: was 3
            marginBottom: 2,
            color: getPrimaryColor(templateId),
            lineHeight: 1.1,
            textTransform: (templateId === 'template2' || templateId === 'template3') ? 'uppercase' : 'none'
        },
        jobTitle: {
            fontSize: 10.5,
            fontFamily: getBoldFontFamily(templateId),
            // Reduced marginBottom: was 5
            marginBottom: 3,
            color: getSecondaryColor(templateId)
        },
        contactRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
        contactItem: { marginHorizontal: 2, fontSize: 8.5 },
        section: {
            // Reduced marginTop: was 6
            marginTop: 5
        },
        sectionTitle: {
            fontSize: 9.5,
            fontFamily: getBoldFontFamily(templateId),
            borderBottomWidth: templateId === 'template2' ? 1.5 : 1,
            borderBottomColor: templateId === 'template3' ? '#666' : getPrimaryColor(templateId),
            borderStyle: templateId === 'template3' ? 'dashed' : 'solid',
            color: getPrimaryColor(templateId),
            paddingBottom: 1,
            // Reduced marginBottom: was 4
            marginBottom: 3,
            textTransform: 'uppercase',
            letterSpacing: 0.3
        },
        summary: {
            textAlign: 'justify',
            fontSize: 9,
            // Reduced lineHeight: was default (1.25), now tighter
            lineHeight: 1.3
        },
        // Reduced marginBottom: was 6
        expBlock: { marginBottom: 5 },
        expRole: { fontSize: 9.5, fontFamily: getBoldFontFamily(templateId), marginBottom: 1 },
        expMeta: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            fontFamily: getItalicFontFamily(templateId),
            fontSize: 8.5,
            // Reduced marginBottom: was 2.5
            marginBottom: 2
        },
        boldLabel: { fontFamily: getBoldFontFamily(templateId), fontStyle: 'normal' },
        bulletRow: {
            flexDirection: 'row',
            // Reduced marginBottom: was 1.5
            marginBottom: 1,
            paddingLeft: 10
        },
        bulletText: { flex: 1, textAlign: 'justify', fontSize: 9, lineHeight: 1.3 },
        // Reduced marginBottom: was 6
        eduBlock: { marginBottom: 5 },
        eduDegreeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
        eduDegree: { fontSize: 9.5, fontFamily: getBoldFontFamily(templateId) },
        // Reduced marginBottom: was 2.5
        skillsRow: { marginBottom: 2, fontSize: 9, lineHeight: 1.3 },
        // Reduced marginBottom: was 6
        projBlock: { marginBottom: 5 },
        projName: { fontSize: 9.5, fontFamily: getBoldFontFamily(templateId), marginBottom: 1 },
        projLink: { fontSize: 8.5, fontFamily: getItalicFontFamily(templateId), marginBottom: 1.5 },
    }), [templateId]);

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

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* ── HEADER ── */}
                <View style={styles.header}>
                    <Text style={styles.name}>{(pi.fullName || "Your Name").trim()}</Text>
                    {pi.jobTitle && <Text style={styles.jobTitle}>{pi.jobTitle}</Text>}
                    {(pi.address || pi.email || pi.phone || pi.linkedin || pi.github) && (
                        <View style={styles.contactRow}>
                            {pi.address && <Text style={styles.contactItem}>{pi.address}</Text>}
                            {pi.address && pi.email && <Text style={styles.contactItem}> | </Text>}
                            {pi.email && <Text style={styles.contactItem}>{pi.email}</Text>}
                            {pi.email && pi.phone && <Text style={styles.contactItem}> | </Text>}
                            {pi.phone && <Text style={styles.contactItem}>{pi.phone}</Text>}
                            {pi.phone && pi.linkedin && <Text style={styles.contactItem}> | </Text>}
                            {pi.linkedin && <Link src={pi.linkedin} style={{ ...styles.contactItem, ...styles.boldLabel, color: '#111', textDecoration: 'none' }}>LinkedIn</Link>}
                            {(pi.linkedin || pi.phone) && pi.github && <Text style={styles.contactItem}> | </Text>}
                            {pi.github && <Link src={pi.github} style={{ ...styles.contactItem, ...styles.boldLabel, color: '#111', textDecoration: 'none' }}>GitHub</Link>}
                        </View>
                    )}
                </View>

                {/* ── SUMMARY ── */}
                {sum && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t.summary}</Text>
                        <Text style={styles.summary}>{sum}</Text>
                    </View>
                )}

                {/* ── EXPERIENCE ── */}
                {exps.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t.experience}</Text>
                        {exps.map(e => (
                            <View style={styles.expBlock} key={e.id}>
                                <Text style={styles.expRole}>{e.jobTitle}</Text>
                                <View style={styles.expMeta}>
                                    <Text><Text style={styles.boldLabel}>{e.company}</Text>{e.location ? `, ${e.location}` : ""}</Text>
                                    <Text>{fmt(e.startDate)}{e.startDate ? " – " : ""}{fmt(e.endDate) || (e.startDate ? "Present" : "")}</Text>
                                </View>
                                {toBullets(e.description).map((line, i) => (
                                    <View style={styles.bulletRow} key={i}>
                                        <Text style={{ width: 8, fontSize: 9 }}>• </Text>
                                        <Text style={styles.bulletText}>{line}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                )}

                {/* ── EDUCATION ── */}
                {edus.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t.education}</Text>
                        {edus.map(e => (
                            <View style={styles.eduBlock} key={e.id}>
                                <View style={styles.eduDegreeRow}>
                                    <Text style={styles.eduDegree}>{e.degree}</Text>
                                    {(e.startDate || e.endDate) && (
                                        <Text style={{ fontSize: 8.5 }}>{fmt(e.startDate)}{e.startDate && e.endDate ? " – " : ""}{fmt(e.endDate)}</Text>
                                    )}
                                </View>
                                <Text style={{ fontSize: 8.5 }}>{e.school}{e.location ? `, ${e.location}` : ""}</Text>
                                {e.description && <Text style={{ fontSize: 8.5, lineHeight: 1.3, marginTop: 1 }}>{e.description}</Text>}
                            </View>
                        ))}
                    </View>
                )}

                {/* ── SKILLS ── */}
                {(technicalSkills.length > 0 || softSkills.length > 0) && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t.skills}</Text>
                        {technicalSkills.length > 0 && (
                            <Text style={styles.skillsRow}>
                                <Text style={styles.boldLabel}>{t.technicalSkills} </Text>
                                {technicalSkills.join(", ")}
                            </Text>
                        )}
                        {softSkills.length > 0 && (
                            <Text style={styles.skillsRow}>
                                <Text style={styles.boldLabel}>{t.softSkills} </Text>
                                {softSkills.join(", ")}
                            </Text>
                        )}
                    </View>
                )}

                {/* ── PROJECTS ── */}
                {prjs.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t.projects}</Text>
                        {prjs.map(pr => (
                            <View style={styles.projBlock} key={pr.id}>
                                <Text style={styles.projName}>
                                    {pr.projectName}
                                    {pr.projectLink && <Text style={{ fontFamily: getFontFamily(templateId), fontSize: 8.5 }}> | {pr.projectLink}</Text>}
                                </Text>
                                {pr.projectDescription && toBullets(pr.projectDescription).map((line, i) => (
                                    <View style={styles.bulletRow} key={i}>
                                        <Text style={{ width: 8, fontSize: 9 }}>•</Text>
                                        <Text style={styles.bulletText}>{line}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                )}

                {/* ── LANGUAGES ── */}
                {lngs.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t.languages}</Text>
                        <Text style={styles.skillsRow}>
                            {lngs.map((l, i) => (
                                <React.Fragment key={l.id}>
                                    <Text style={styles.boldLabel}>{l.languageName}</Text>
                                    {l.languageProficiency ? ` (${l.languageProficiency})` : ""}
                                    {i < lngs.length - 1 ? ", " : ""}
                                </React.Fragment>
                            ))}
                        </Text>
                    </View>
                )}

                {/* ── CERTIFICATIONS ── */}
                {certs.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t.certifications}</Text>
                        {certs.map(c => (
                            <View style={styles.projBlock} key={c.id}>
                                <Text style={styles.projName}>
                                    {c.name}
                                    {c.date && <Text style={{ fontFamily: getFontFamily(templateId), fontSize: 8.5 }}> | {c.date}</Text>}
                                </Text>
                                {c.issuer && <Text style={{ fontSize: 8.5, fontFamily: getItalicFontFamily(templateId), marginBottom: 2 }}>{c.issuer}</Text>}
                            </View>
                        ))}
                    </View>
                )}

                {/* ── AWARDS ── */}
                {awrds.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t.awards}</Text>
                        {awrds.map(a => (
                            <View style={styles.projBlock} key={a.id}>
                                <Text style={styles.projName}>
                                    {a.title}
                                    {a.date && <Text style={{ fontFamily: getFontFamily(templateId), fontSize: 8.5 }}> | {a.date}</Text>}
                                </Text>
                                {a.awarder && <Text style={{ fontSize: 8.5, fontFamily: getItalicFontFamily(templateId), marginBottom: 1 }}>{a.awarder}</Text>}
                                {a.description && <Text style={{ fontSize: 9, lineHeight: 1.3 }}>{a.description}</Text>}
                            </View>
                        ))}
                    </View>
                )}

                {/* ── CUSTOM SECTIONS ── */}
                {custs.length > 0 && custs.map(c => (
                    <View style={styles.section} key={c.id}>
                        <Text style={styles.sectionTitle}>{c.sectionTitle}</Text>
                        {c.description && toBullets(c.description).map((line, i) => (
                            <View style={styles.bulletRow} key={i}>
                                <Text style={{ width: 8, fontSize: 9 }}>• </Text>
                                <Text style={styles.bulletText}>{line}</Text>
                            </View>
                        ))}
                    </View>
                ))}

                {/* ── REFERENCES ── */}
                {refs.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t.references}</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                            {refs.map(r => (
                                <View key={r.id} style={{ width: '47%', marginBottom: 5 }}>
                                    <Text style={{ fontSize: 9.5, fontFamily: getBoldFontFamily(templateId) }}>{r.name}</Text>
                                    {r.position && <Text style={{ fontSize: 8.5, fontFamily: getItalicFontFamily(templateId) }}>{r.position}{r.company ? `, ${r.company}` : ''}</Text>}
                                    {r.contactInfo && <Text style={{ fontSize: 8.5 }}>{r.contactInfo}</Text>}
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