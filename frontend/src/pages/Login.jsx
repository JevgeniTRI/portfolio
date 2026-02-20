import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { useLanguage } from '../context/LanguageContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { t } = useLanguage();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await login(username, password);
            sessionStorage.setItem('token', data.access_token);
            navigate('/admin');
        } catch (err) {
            setError(t('login.invalid'));
            console.error("Login failed", err);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center bg-slate-50">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-900">{t('login.welcome')}</h2>
                    <p className="text-slate-500 mt-2">{t('login.subtitle')}</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">{t('login.username')}</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-slate-50 text-slate-900 rounded-lg px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder={t('login.username')}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">{t('login.password')}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-50 text-slate-900 rounded-lg px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder={t('login.password')}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 transform active:scale-95"
                    >
                        {t('login.signIn')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
