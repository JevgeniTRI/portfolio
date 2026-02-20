import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();
    return (
        <footer className="bg-white text-gray-500 py-8 border-t border-gray-200 mt-20">
            <div className="container mx-auto px-6 text-center">
                <p>&copy; {new Date().getFullYear()} DevPortfolio. {t('footer.rights')}</p>
            </div>
        </footer>
    );
};

export default Footer;
