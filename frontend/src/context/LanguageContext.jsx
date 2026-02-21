import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { translations as staticTranslations } from '../utils/translations';
import { getTranslations } from '../api/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en'); // default to 'en'
    const [translations, setTranslations] = useState(staticTranslations);
    const [isTranslationsLoaded, setIsTranslationsLoaded] = useState(false);

    const fetchTranslations = useCallback(async () => {
        try {
            const dbTranslations = await getTranslations();
            const mergedTranslations = JSON.parse(JSON.stringify(staticTranslations)); // Deep copy static translations

            // Loop through the overrides and apply them
            dbTranslations.forEach(({ language: lang, key, value }) => {
                if (!mergedTranslations[lang]) {
                    mergedTranslations[lang] = {};
                }
                const keys = key.split('.');
                let current = mergedTranslations[lang];
                for (let i = 0; i < keys.length - 1; i++) {
                    if (!current[keys[i]]) current[keys[i]] = {};
                    current = current[keys[i]];
                }
                current[keys[keys.length - 1]] = value;
            });

            setTranslations(mergedTranslations);
        } catch (error) {
            console.error("Failed to fetch translations from backend, using static translations", error);
        } finally {
            setIsTranslationsLoaded(true);
        }
    }, []);

    useEffect(() => {
        fetchTranslations();
    }, [fetchTranslations]);

    const t = (path) => {
        return path?.split('.').reduce((obj, key) => obj?.[key], translations[language]) || path;
    };

    const value = {
        language,
        setLanguage,
        t,
        translations, // provide the merged translations to edit
        fetchTranslations // allow admin component to trigger a refresh
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
