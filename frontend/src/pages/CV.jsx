import { useState, useEffect } from 'react';
import { getCV } from '../api/cv';
import { useLanguage } from '../context/LanguageContext';

const CV = () => {
    const [cvData, setCvData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

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
        return <div className="min-h-screen flex justify-center items-center font-semibold text-slate-600">Failed to load CV.</div>;
    }

    // A helper to format text containing newlines to paragraph elements
    const formatText = (text) => {
        if (!text) return null;
        return text.split('\n').map((line, idx) => (
            <p key={idx} className="mb-2">{line}</p>
        ));
    };

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
                    <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-4 tracking-tight">Curriculum Vitae</h1>
                    <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
                        My professional journey, experience, and educational background.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 space-y-10">

                    {cvData.about && (
                        <section>
                            <h2 className="text-2xl font-bold border-b border-slate-200 pb-3 mb-6 text-blue-700">About Me</h2>
                            <div className="text-slate-600 leading-relaxed text-lg">
                                {formatText(cvData.about)}
                            </div>
                        </section>
                    )}

                    {cvData.experience && (
                        <section>
                            <h2 className="text-2xl font-bold border-b border-slate-200 pb-3 mb-6 text-blue-700">Experience</h2>
                            <div className="text-slate-600 leading-relaxed text-lg">
                                {formatText(cvData.experience)}
                            </div>
                        </section>
                    )}

                    {cvData.education && (
                        <section>
                            <h2 className="text-2xl font-bold border-b border-slate-200 pb-3 mb-6 text-blue-700">Education</h2>
                            <div className="text-slate-600 leading-relaxed text-lg">
                                {formatText(cvData.education)}
                            </div>
                        </section>
                    )}

                    {cvData.skills && cvData.skills.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold border-b border-slate-200 pb-3 mb-6 text-blue-700">Skills & Certificates</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {cvData.skills.map((skill, index) => (
                                    <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                                        <h3 className="text-xl font-bold text-slate-800 mb-1">{skill.name}</h3>
                                        <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-full mb-3">
                                            {skill.level}
                                        </div>
                                        {skill.description && (
                                            <p className="text-slate-600 text-sm mb-3 whitespace-pre-line leading-relaxed">
                                                {skill.description}
                                            </p>
                                        )}
                                        {skill.certificate_url && (
                                            <div className="mt-2 text-sm">
                                                <a
                                                    href={skill.certificate_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 font-semibold flex items-center group"
                                                >
                                                    View Certificate
                                                    <span className="transform transition-transform group-hover:translate-x-1 ml-1">→</span>
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CV;
