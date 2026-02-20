import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject } from '../api/projects';
import { FaGithub, FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await getProject(id);
                setProject(data);
            } catch (error) {
                console.error("Failed to fetch project details", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProject();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">{t('projects.notFound')}</h2>
                <button
                    onClick={() => navigate('/projects')}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                >
                    <FaArrowLeft /> {t('projects.backToProjects')}
                </button>
            </div>
        );
    }

    const images = project.images && project.images.length > 0 ? project.images : [project.image_url];
    const validImages = images.filter(img => img);
    const displayImages = validImages.length > 0 ? validImages : ["https://placehold.co/600x400/e2e8f0/475569?text=No+Image"];

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => navigate('/projects')}
                    className="mb-8 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200"
                >
                    <FaArrowLeft /> {t('projects.backToProjects')}
                </button>

                <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 flex flex-col lg:flex-row lg:h-[700px]">
                    {/* Image Section - Main / Carousel */}
                    <div className="lg:w-1/2 relative bg-gray-50 flex items-center justify-center h-[400px] lg:h-full overflow-hidden border-r border-slate-100">
                        <img
                            src={displayImages[currentImageIndex]}
                            alt={project.title}
                            className="w-full h-full object-contain p-8"
                        />

                        {displayImages.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white hover:bg-slate-50 text-slate-800 rounded-full transition-all shadow-md border border-slate-200"
                                >
                                    <FaChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white hover:bg-slate-50 text-slate-800 rounded-full transition-all shadow-md border border-slate-200"
                                >
                                    <FaChevronRight size={20} />
                                </button>

                                {/* Thumbnails / Dots */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                                    {displayImages.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`w-3 h-3 rounded-full transition-all shadow-sm border border-slate-300 ${idx === currentImageIndex ? 'bg-blue-600 scale-125 border-blue-600' : 'bg-white hover:bg-slate-100'}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col bg-white lg:h-full overflow-y-auto custom-scrollbar">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                            {project.title}
                        </h1>

                        <div className="flex flex-wrap gap-2 mb-8">
                            {project.tags && project.tags.map(tag => (
                                <span key={tag} className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold tracking-wide border border-blue-100 shadow-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="prose prose-slate prose-lg mb-10">
                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {project.description}
                            </p>
                        </div>

                        <div className="mt-auto pt-8 border-t border-slate-100">
                            <h3 className="text-sm uppercase font-bold text-slate-400 mb-4 tracking-wider">Links</h3>
                            <a
                                href={project.github_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex justify-center items-center gap-3 bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-all shadow-lg hover:shadow-slate-500/30 transform active:scale-[0.98] duration-200"
                            >
                                <FaGithub size={24} />
                                <span>{t('projects.sourceCode')}</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
