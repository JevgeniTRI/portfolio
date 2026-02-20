import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaTrash } from 'react-icons/fa';

const ImageUpload = ({ value = [], onChange }) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const maxUploadBytes = Number(import.meta.env.VITE_MAX_UPLOAD_BYTES) || 5 * 1024 * 1024;
    const maxUploadMb = Math.round(maxUploadBytes / (1024 * 1024));

    const onDrop = useCallback(async (acceptedFiles) => {
        if (!acceptedFiles || acceptedFiles.length === 0) return;

        const oversizedFile = acceptedFiles.find((file) => file.size > maxUploadBytes);
        if (oversizedFile) {
            alert(`"${oversizedFile.name}" exceeds ${maxUploadMb}MB per-file limit.`);
            return;
        }

        setUploading(true);
        const newImages = [];
        let completed = 0;

        try {
            const token = localStorage.getItem('token');

            // Upload files sequentially
            for (const file of acceptedFiles) {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/upload`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        ...(token && { 'Authorization': `Bearer ${token}` })
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    newImages.push(data.url);
                } else {
                    console.error(`Failed to upload ${file.name}`);
                }

                completed++;
                setProgress(Math.round((completed / acceptedFiles.length) * 100));
            }

            if (newImages.length > 0) {
                onChange([...(value || []), ...newImages]);
            }
        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Error uploading images');
        } finally {
            setUploading(false);
            setProgress(0);
        }
    }, [onChange, value]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
        },
        multiple: true
    });

    const handleRemove = (indexToRemove) => {
        const newImages = value.filter((_, index) => index !== indexToRemove);
        onChange(newImages);
    };

    return (
        <div className="w-full space-y-4">
            <label className="block text-sm font-semibold text-slate-700">Project Images</label>

            {/* Image Grid */}
            {value && value.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {value.map((url, index) => (
                        <div key={index} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-50">
                            <img
                                src={url}
                                alt={`Project ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => handleRemove(index)}
                                    className="bg-white text-red-600 p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors"
                                    title="Remove Image"
                                >
                                    <FaTrash size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={`
                    border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ease-in-out relative overflow-hidden
                    ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}
                `}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-3 relative z-10">
                    {uploading ? (
                        <>
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
                            <p className="text-sm text-slate-600 font-medium">Uploading... {progress}%</p>
                        </>
                    ) : (
                        <>
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                                <FaCloudUploadAlt size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-700">
                                    {isDragActive ? 'Drop images here...' : 'Click or drag images here'}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    Support JPG, PNG, WEBP, GIF (Max {maxUploadMb}MB per file)
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;
