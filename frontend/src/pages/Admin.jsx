import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, createProject, deleteProject, updateProject } from '../api/projects';
import { useLanguage } from '../context/LanguageContext';
import ImageUpload from '../components/ImageUpload';

const Admin = () => {
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        github_link: '',
        images: [],
        tags: ''
    });
    const [editingId, setEditingId] = useState(null);
    const navigate = useNavigate();
    const { t } = useLanguage();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchProjects();
    }, [navigate]);

    const fetchProjects = async () => {
        try {
            const data = await getProjects();
            setProjects(data);
        } catch (error) {
            console.error("Failed to fetch projects", error);
        }
    };

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
        </div>
    );
};

export default Admin;
