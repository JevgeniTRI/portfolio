import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCV } from '../api/cv';
import { useLanguage } from '../context/LanguageContext';
import { SiJavascript } from 'react-icons/si';

const SkillCard = ({ skill, t }) => {
    const { language } = useLanguage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const description = skill.description ? (skill.description[language] || skill.description.en || '') : '';
    return (
        <>
            <div className="group relative bg-slate-50 border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-slate-800">{skill.name}</h3>
                    <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200">
                        {skill.level}
                    </div>
                </div>
                {description && (
                    <div className="text-slate-600 text-sm whitespace-pre-line leading-relaxed max-h-20 overflow-hidden relative">
                        {description}
                        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none"></div>
                    </div>
                )}

                <div className={`mt-auto pt-4 flex items-center justify-between text-sm font-semibold ${description || skill.certificate_url ? 'border-t border-slate-200 mt-4' : ''}`}>
                    {description ? (
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            className="text-blue-600 hover:text-blue-800 transition-colors bg-white px-4 py-1.5 rounded-lg border border-blue-200 hover:shadow-sm"
                        >
                            {t('cv.readMoreModal')}
                        </button>
                    ) : <span />}
                    {skill.certificate_url && (
                        <a
                            href={skill.certificate_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 flex items-center transition-colors group/cert ml-auto"
                        >
                            {t('cv.viewCertificate')}
                            <span className="transform transition-transform group-hover/cert:translate-x-1 ml-1">→</span>
                        </a>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm shadow-2xl"
                    onClick={() => setIsModalOpen(false)}>
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <div>
                                <h3 className="text-2xl font-extrabold text-slate-800 flex items-center">
                                    {skill.name}
                                    {skill.name.toLowerCase().includes('python') && (
                                        <img src="/python-logo.svg" alt="Python" className="h-8 w-auto ml-3" />
                                    )}
                                    {skill.name.toLowerCase().includes('javascript') && (
                                        <SiJavascript className="text-[#F7DF1E] text-3xl ml-3 drop-shadow-sm" />
                                    )}
                                </h3>
                                <div className="mt-2 inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-full border border-indigo-100">
                                    {skill.level}
                                </div>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 -mr-2 text-slate-400 hover:text-slate-800 rounded-full transition-colors bg-slate-50 hover:bg-slate-100"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line">
                                {description}
                            </p>
                        </div>
                        {skill.certificate_url && (
                            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end rounded-b-2xl">
                                <a
                                    href={skill.certificate_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition shadow"
                                >
                                    {t('cv.viewOfficialCertificate')}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

const ExpandableSection = ({ title, text, t }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // A helper to format text containing newlines to paragraph elements
    const formatText = (content) => {
        if (!content) return null;
        return content.split('\n').map((line, idx) => (
            <p key={idx} className="mb-2">{line}</p>
        ));
    };

    return (
        <section>
            <h2 className="text-2xl font-bold border-b border-slate-200 pb-3 mb-6 text-blue-700">{title}</h2>

            <div className={`relative overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-[160px] opacity-90'}`}>
                <div className="text-slate-600 leading-relaxed text-lg">
                    {formatText(text)}
                </div>
                {!isExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                )}
            </div>

            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-4 text-blue-600 hover:text-blue-800 font-semibold transition-colors flex items-center bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 hover:bg-blue-100 shadow-sm"
            >
                {isExpanded ? t('cv.showLess') : t('cv.readMore')}
            </button>
        </section>
    );
};

const CV = () => {
    const [cvData, setCvData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { t, language } = useLanguage();

    useEffect(() => {
        fetchCV();
    }, []);

    const fetchCV = async () => {
        try {
            const data = await getCV();
            setCvData(data);
        } catch (error) {
            console.error("Failed to fetch CV", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!cvData) {
        return <div className="min-h-screen flex justify-center items-center font-semibold text-slate-600">{t('cv.failedLoad')}</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 py-20 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-100/50 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-indigo-100/40 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/4 pointer-events-none"></div>

            <div className="container mx-auto px-6 max-w-4xl space-y-12 relative z-10">
                <div className="text-center flex flex-col items-center">
                    {cvData.photo_url && (
                        <div className="mb-8 p-1.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full shadow-2xl transform hover:scale-105 transition-transform duration-300">
                            <img
                                src={cvData.photo_url}
                                alt="Profile"
                                className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-full border-4 border-white"
                            />
                        </div>
                    )}
                    <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-4 tracking-tight">{t('cv.title')}</h1>
                    <div className="mb-4">
                        <Link to="/contact" className="inline-flex items-center justify-center px-8 py-3 text-base font-bold text-white bg-blue-600 rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            {t('hero.contactMe')}
                        </Link>
                    </div>
                    <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
                        {t('cv.subtitle')}
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 space-y-10">

                    {cvData.about && (
                        <ExpandableSection title={t('cv.about')} text={cvData.about[language] || cvData.about.en || ''} t={t} />
                    )}

                    {cvData.experience && (
                        <ExpandableSection title={t('cv.experience')} text={cvData.experience[language] || cvData.experience.en || ''} t={t} />
                    )}

                    {cvData.education && (
                        <ExpandableSection title={t('cv.education')} text={cvData.education[language] || cvData.education.en || ''} t={t} />
                    )}

                    {
                        cvData.skills && cvData.skills.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold border-b border-slate-200 pb-3 mb-6 text-blue-700">{t('cv.skillsTitle')}</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {cvData.skills.map((skill, index) => (
                                        <SkillCard key={index} skill={skill} t={t} />
                                    ))}
                                </div>
                            </section>
                        )
                    }
                </div >
            </div >
        </div >
    );
};

export default CV;
