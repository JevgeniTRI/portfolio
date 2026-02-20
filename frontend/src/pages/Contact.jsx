import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
    const { t } = useLanguage();
    const email = import.meta.env.VITE_CONTACT_EMAIL;

    return (
        <div className="container mx-auto px-6 py-20">
            <div className="max-w-2xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-900 tracking-tight">
                    {t('contact.title')}
                </h1>
                <p className="text-lg text-slate-500 mb-10">
                    {t('contact.subtitle')}
                </p>
                {email ? (
                    <a
                        href={`mailto:${email}`}
                        className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-slate-900 text-white font-bold hover:bg-black transition-colors shadow-lg"
                    >
                        {email}
                    </a>
                ) : (
                    <p className="text-slate-400">
                        {t('contact.comingSoon')}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Contact;
