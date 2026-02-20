import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ project }) => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 shadow-lg group flex flex-col h-full"
        >
            <div className="h-48 overflow-hidden bg-gray-200">
                <img
                    src={(project.images && project.images.length > 0 ? project.images[0] : project.image_url) || "https://placehold.co/600x400/e2e8f0/475569?text=Project+Preview"}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
            </div>
            <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed flex-grow">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags && project.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold tracking-wide">
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                    <a
                        href={project.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <FaGithub size={20} /> <span className="text-sm font-medium">{t('projects.sourceCode')}</span>
                    </a>
                    <button
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="px-5 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-black transition-colors shadow-md hover:shadow-lg transform active:scale-95 duration-200"
                    >
                        {t('projects.viewDetails')}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectCard;
