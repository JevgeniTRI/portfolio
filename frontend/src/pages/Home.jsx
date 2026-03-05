import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

import { FaReact, FaPython } from 'react-icons/fa';
import { SiFastapi, SiJavascript, SiTailwindcss } from 'react-icons/si';

const Home = () => {
    const { t } = useLanguage();

    return (
        <div className="pb-20">
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-white z-0" />

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1.5 px-4 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6 tracking-wide border border-blue-100">
                            {t('hero.badge')}
                        </span>
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-slate-800 tracking-tight leading-tight">
                            {t('hero.titleStart')} <br />
                            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">{t('hero.titleEnd')}</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                            {t('hero.description')}
                        </p>

                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <Link
                                to="/projects"
                                className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-xl hover:shadow-blue-500/20 transform hover:-translate-y-1"
                            >
                                {t('hero.viewWork')}
                            </Link>
                            <Link
                                to="/contact"
                                className="px-8 py-4 border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 rounded-full font-bold transition-all"
                            >
                                {t('hero.contactMe')}
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Tech Stack Preview */}
            <section className="py-16 bg-white border-y border-slate-50">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-slate-300 mb-8 uppercase tracking-widest text-xs font-bold">{t('techCheck')}</p>
                    <div className="flex flex-wrap justify-center gap-12 text-slate-400 font-medium text-xl">
                        <div className="flex flex-col items-center gap-3 transition-transform hover:scale-110 cursor-default group">
                            <FaReact className="text-5xl text-[#61DAFB] drop-shadow-sm" />
                            <span className="group-hover:text-slate-600 transition-colors">React</span>
                        </div>
                        <div className="flex flex-col items-center gap-3 transition-transform hover:scale-110 cursor-default group">
                            <SiFastapi className="text-5xl text-[#009688] drop-shadow-sm" />
                            <span className="group-hover:text-slate-600 transition-colors">FastAPI</span>
                        </div>
                        <div className="flex flex-col items-center gap-3 transition-transform hover:scale-110 cursor-default group">
                            <img src="/python-logo.svg" alt="Python" className="h-[48px] w-auto drop-shadow-sm" />
                            <span className="group-hover:text-slate-600 transition-colors">Python</span>
                        </div>
                        <div className="flex flex-col items-center gap-3 transition-transform hover:scale-110 cursor-default group">
                            <SiJavascript className="text-5xl text-[#F7DF1E] drop-shadow-sm" />
                            <span className="group-hover:text-slate-600 transition-colors">JavaScript</span>
                        </div>
                        <div className="flex flex-col items-center gap-3 transition-transform hover:scale-110 cursor-default group">
                            <SiTailwindcss className="text-5xl text-[#06B6D4] drop-shadow-sm" />
                            <span className="group-hover:text-slate-600 transition-colors">TailwindCSS</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
