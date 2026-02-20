import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
    const { t, language, setLanguage } = useLanguage();
    const hasToken = Boolean(localStorage.getItem('token'));

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-sm border-b border-slate-100">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    DevPortfolio
                </Link>
                <div className="flex items-center space-x-8">
                    <div className="hidden md:flex space-x-8">
                        <Link to="/" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">{t('nav.home')}</Link>
                        <Link to="/projects" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">{t('nav.projects')}</Link>
                        {hasToken && (
                            <Link to="/admin" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">{t('nav.admin')}</Link>
                        )}
                    </div>

                    {/* Language Switcher */}
                    <div className="flex space-x-2 border-l border-slate-200 pl-6">
                        <button
                            onClick={() => setLanguage('en')}
                            className={`text-sm font-semibold transition-colors ${language === 'en' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => setLanguage('ru')}
                            className={`text-sm font-semibold transition-colors ${language === 'ru' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            RU
                        </button>
                        <button
                            onClick={() => setLanguage('et')}
                            className={`text-sm font-semibold transition-colors ${language === 'et' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            ET
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
