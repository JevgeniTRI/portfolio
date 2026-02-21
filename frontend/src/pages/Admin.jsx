import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, createProject, deleteProject, updateProject } from '../api/projects';
import { useLanguage } from '../context/LanguageContext';
import ImageUpload from '../components/ImageUpload';
import FileUpload from '../components/FileUpload';
import { getCV, updateCV } from '../api/cv';
import { updateTranslations } from '../api/translations';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('projects'); // 'projects', 'cv', or 'pages'
    const [selectedLang, setSelectedLang] = useState('en');
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        github_link: '',
        images: [],
        tags: ''
    });
    const [cvData, setCvData] = useState({
        about: '',
        experience: '',
        education: '',
        photo_url: '',
        skills: []
    });

    // State for translations editing
    const [pageTranslations, setPageTranslations] = useState({});

    const [editingId, setEditingId] = useState(null);
    const navigate = useNavigate();
    const { t, translations, fetchTranslations } = useLanguage();

    useEffect(() => {
        // Initialize page translations when context or lang changes
        if (translations && translations[selectedLang]) {
            setPageTranslations({
                'hero.badge': translations[selectedLang]?.hero?.badge || '',
                'hero.titleStart': translations[selectedLang]?.hero?.titleStart || '',
                'hero.titleEnd': translations[selectedLang]?.hero?.titleEnd || '',
                'hero.description': translations[selectedLang]?.hero?.description || '',
                'hero.viewWork': translations[selectedLang]?.hero?.viewWork || '',
                'hero.contactMe': translations[selectedLang]?.hero?.contactMe || '',
                'contact.title': translations[selectedLang]?.contact?.title || '',
                'contact.subtitle': translations[selectedLang]?.contact?.subtitle || '',
            });
        }
    }, [translations, selectedLang]);

    const fetchCV = async () => {
        try {
            const data = await getCV();
            setCvData(data);
        } catch (error) {
            console.error("Failed to fetch CV", error);
        }
    };

    const fetchProjects = async () => {
        try {
            const data = await getProjects();
            setProjects(data);
        } catch (error) {
            console.error("Failed to fetch projects", error);
        }
    };

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchProjects();
        fetchCV();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const tagsList = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            const projectData = { ...formData, tags: tagsList };

            if (editingId) {
                await updateProject(editingId, projectData);
                setEditingId(null);
            } else {
                await createProject(projectData);
            }

            setFormData({ title: '', description: '', github_link: '', images: [], tags: '' });
            fetchProjects();
        } catch (error) {
            console.error("Failed to save project", error);
            alert("Failed to save project");
        }
    };

    const handleEdit = (project) => {
        setEditingId(project.id);
        setFormData({
            title: project.title,
            description: project.description,
            github_link: project.github_link || '',
            images: project.images || [],
            tags: project.tags ? project.tags.join(', ') : ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ title: '', description: '', github_link: '', images: [], tags: '' });
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('admin.confirmDelete'))) {
            try {
                await deleteProject(id);
                fetchProjects();
            } catch (error) {
                console.error("Failed to delete project", error);
                alert("Failed to delete project");
            }
        }
    };

    const handleCVSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateCV(cvData);
            alert("CV updated successfully!");
        } catch (error) {
            console.error("Failed to update CV", error);
            alert("Failed to update CV");
        }
    };

    const addSkill = () => {
        setCvData({
            ...cvData,
            skills: [...cvData.skills, { name: '', level: 'Beginner', certificate_url: '', description: '' }]
        });
    };

    const updateSkill = (index, field, value) => {
        const newSkills = [...cvData.skills];
        newSkills[index][field] = value;
        setCvData({ ...cvData, skills: newSkills });
    };

    const removeSkill = (index) => {
        const newSkills = cvData.skills.filter((_, i) => i !== index);
        setCvData({ ...cvData, skills: newSkills });
    };

    const handleTranslationsSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateTranslations(selectedLang, pageTranslations);
            alert("Translations updated successfully!");
            await fetchTranslations(); // Refresh context
        } catch (error) {
            console.error("Failed to update translations", error);
            alert("Failed to update translations");
        }
    };

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900">{t('admin.dashboard')}</h1>
                    <p className="text-slate-500 mt-1">{t('admin.manage')}</p>
                </div>
                <button
                    onClick={() => {
                        sessionStorage.removeItem('token');
                        navigate('/login');
                    }}
                    className="bg-white text-slate-600 hover:text-red-600 hover:bg-red-50 px-5 py-2.5 rounded-lg border border-slate-200 transition-colors font-medium shadow-sm"
                >
                    {t('admin.signOut')}
                </button>
            </div>

            {/* Tabs */}
            <div className="mb-8 border-b border-slate-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('projects')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'projects' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                    >
                        {t('nav.projects')}
                    </button>
                    <button
                        onClick={() => setActiveTab('cv')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'cv' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                    >
                        CV
                    </button>
                    <button
                        onClick={() => setActiveTab('pages')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'pages' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                    >
                        Page Management
                    </button>
                </nav>
            </div>

            {activeTab === 'projects' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Create/Edit Project Form */}
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl h-fit">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                            <h2 className="text-2xl font-bold text-slate-900">
                                {editingId ? t('admin.editProject') : t('admin.addProject')}
                            </h2>
                            {editingId && (
                                <button
                                    onClick={handleCancelEdit}
                                    className="text-sm text-slate-500 hover:text-slate-700 underline"
                                >
                                    {t('admin.cancel')}
                                </button>
                            )}
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">{t('admin.form.title')}</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder={t('admin.form.title')}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">{t('admin.form.description')}</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                    placeholder={t('admin.form.description')}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">{t('admin.form.github')}</label>
                                    <input
                                        type="url"
                                        value={formData.github_link}
                                        onChange={e => setFormData({ ...formData, github_link: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                                <div className="col-span-2">
                                    <ImageUpload
                                        value={formData.images}
                                        onChange={(images) => setFormData({ ...formData, images: images })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">{t('admin.form.tags')}</label>
                                <input
                                    type="text"
                                    value={formData.tags}
                                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                    placeholder="React, Python, FastAPI"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                className={`w-full font-bold py-3 rounded-xl transition-all shadow-lg transform active:scale-95 mt-4 ${editingId ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'}`}
                            >
                                {editingId ? t('admin.updateProject') : t('admin.form.create')}
                            </button>
                        </form>
                    </div>

                    {/* Existing Projects List */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-slate-900 border-b border-slate-100 pb-4">{t('admin.manageProjects')}</h2>
                        <div className="space-y-4">
                            {projects.map(project => (
                                <div key={project.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group hover:shadow-md transition-shadow">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-lg text-slate-900 truncate">{project.title}</h3>
                                        <p className="text-slate-500 text-sm truncate">{project.description}</p>
                                    </div>
                                    <div className="flex space-x-3 shrink-0">
                                        <button
                                            onClick={() => handleEdit(project)}
                                            className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                                        >
                                            {t('admin.edit')}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project.id)}
                                            className="bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                                        >
                                            {t('projects.delete')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {projects.length === 0 && (
                                <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    <p className="text-slate-400">{t('projects.noProjects')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : activeTab === 'cv' ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl max-w-4xl">
                    <h2 className="text-2xl font-bold mb-8 text-slate-900 border-b border-slate-100 pb-4">Edit CV</h2>
                    <form onSubmit={handleCVSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-1">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Profile Photo</label>
                                <FileUpload
                                    value={cvData.photo_url}
                                    onChange={(url) => setCvData({ ...cvData, photo_url: url })}
                                    accept={{ 'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'] }}
                                    label=""
                                />
                            </div>
                            <div className="md:col-span-2 space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">About</label>
                                    <textarea
                                        value={cvData.about}
                                        onChange={e => setCvData({ ...cvData, about: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Experience</label>
                            <textarea
                                value={cvData.experience}
                                onChange={e => setCvData({ ...cvData, experience: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 h-40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Education</label>
                            <textarea
                                value={cvData.education}
                                onChange={e => setCvData({ ...cvData, education: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>

                        {/* Dynamic Skills Section */}
                        <div className="border border-slate-200 rounded-xl p-6 bg-slate-50">
                            <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
                                <label className="block text-lg font-bold text-slate-900">Skills & Certificates</label>
                                <button
                                    type="button"
                                    onClick={addSkill}
                                    className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-4 py-2 rounded-lg transition-colors text-sm font-bold"
                                >
                                    + Add Skill
                                </button>
                            </div>

                            <div className="space-y-6">
                                {Array.isArray(cvData.skills) && cvData.skills.map((skill, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative">
                                        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-4 items-end mb-2">
                                            <div className="md:col-span-4">
                                                <label className="block text-xs font-semibold text-slate-500 mb-1">Skill Name</label>
                                                <input
                                                    type="text"
                                                    value={skill.name}
                                                    onChange={e => updateSkill(index, 'name', e.target.value)}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="e.g. React.js"
                                                />
                                            </div>
                                            <div className="md:col-span-3">
                                                <label className="block text-xs font-semibold text-slate-500 mb-1">Level</label>
                                                <select
                                                    value={skill.level}
                                                    onChange={e => updateSkill(index, 'level', e.target.value)}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                                                >
                                                    <option value="Beginner">Beginner</option>
                                                    <option value="Intermediate">Intermediate</option>
                                                    <option value="Advanced">Advanced</option>
                                                    <option value="Expert">Expert</option>
                                                </select>
                                            </div>
                                            <div className="md:col-span-4">
                                                <FileUpload
                                                    value={skill.certificate_url}
                                                    onChange={(url) => updateSkill(index, 'certificate_url', url)}
                                                    accept={{ 'application/pdf': ['.pdf'], 'image/*': ['.jpeg', '.jpg', '.png'] }}
                                                    label="Certificate (PDF/Img)"
                                                />
                                            </div>
                                            <div className="md:col-span-1 flex justify-center pb-2">
                                                <button
                                                    type="button"
                                                    onClick={() => removeSkill(index)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                        <div className="md:col-span-12">
                                            <label className="block text-xs font-semibold text-slate-500 mb-1">Description (Optional)</label>
                                            <textarea
                                                value={skill.description || ''}
                                                onChange={e => updateSkill(index, 'description', e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 h-20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-y"
                                                placeholder="Brief description of your real-world experience with this skill..."
                                            />
                                        </div>
                                    </div>
                                ))}
                                {(!cvData.skills || cvData.skills.length === 0) && (
                                    <div className="text-center py-6 text-slate-400">
                                        No skills added yet. Click "+ Add Skill" to begin.
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-xl hover:shadow-2xl shadow-blue-500/30 w-full text-lg mt-6"
                        >
                            Save CV Changes
                        </button>
                    </form>
                </div>
            ) : activeTab === 'pages' ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl max-w-4xl">
                    <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                        <h2 className="text-2xl font-bold text-slate-900">Edit Page Texts</h2>
                        <div className="flex items-center space-x-3 bg-slate-50 p-2 rounded-lg border border-slate-200">
                            <span className="text-sm font-semibold text-slate-600">Language:</span>
                            <div className="flex space-x-2">
                                {['en', 'ru', 'et'].map(lang => (
                                    <button
                                        key={lang}
                                        type="button"
                                        onClick={() => setSelectedLang(lang)}
                                        className={`px-4 py-1.5 rounded-md text-sm font-bold uppercase transition-all ${selectedLang === lang ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'}`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleTranslationsSubmit} className="space-y-8">

                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200">Hero Section</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Badge Text</label>
                                    <input
                                        type="text"
                                        value={pageTranslations['hero.badge'] || ''}
                                        onChange={e => setPageTranslations({ ...pageTranslations, 'hero.badge': e.target.value })}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Title Start</label>
                                        <input
                                            type="text"
                                            value={pageTranslations['hero.titleStart'] || ''}
                                            onChange={e => setPageTranslations({ ...pageTranslations, 'hero.titleStart': e.target.value })}
                                            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Title End</label>
                                        <input
                                            type="text"
                                            value={pageTranslations['hero.titleEnd'] || ''}
                                            onChange={e => setPageTranslations({ ...pageTranslations, 'hero.titleEnd': e.target.value })}
                                            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                                    <textarea
                                        value={pageTranslations['hero.description'] || ''}
                                        onChange={e => setPageTranslations({ ...pageTranslations, 'hero.description': e.target.value })}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 h-24 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">View Work Button</label>
                                    <input
                                        type="text"
                                        value={pageTranslations['hero.viewWork'] || ''}
                                        onChange={e => setPageTranslations({ ...pageTranslations, 'hero.viewWork': e.target.value })}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Contact Me Button</label>
                                    <input
                                        type="text"
                                        value={pageTranslations['hero.contactMe'] || ''}
                                        onChange={e => setPageTranslations({ ...pageTranslations, 'hero.contactMe': e.target.value })}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200 mt-8">Contact Section</h3>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={pageTranslations['contact.title'] || ''}
                                        onChange={e => setPageTranslations({ ...pageTranslations, 'contact.title': e.target.value })}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Subtitle</label>
                                    <textarea
                                        value={pageTranslations['contact.subtitle'] || ''}
                                        onChange={e => setPageTranslations({ ...pageTranslations, 'contact.subtitle': e.target.value })}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 h-20 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-xl hover:shadow-2xl shadow-blue-500/30 w-full text-lg mt-8"
                        >
                            Save {selectedLang.toUpperCase()} Translations
                        </button>
                    </form>
                </div>
            ) : null}
        </div>
    );
};

export default Admin;
