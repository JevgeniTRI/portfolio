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
        <div className="min-h-screen bg-slate-50 py-20">
            <div className="container mx-auto px-6 max-w-4xl space-y-12">
                <div className="text-center">
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

                    {cvData.skills && (
                        <section>
                            <h2 className="text-2xl font-bold border-b border-slate-200 pb-3 mb-6 text-blue-700">Skills</h2>
                            <div className="text-slate-600 leading-relaxed text-lg">
                                {formatText(cvData.skills)}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CV;
