import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaFileAlt, FaTrash } from 'react-icons/fa';

const FileUpload = ({ value, onChange, accept = { 'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'] }, label = 'Upload File', className = "" }) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const maxUploadBytes = Number(import.meta.env.VITE_MAX_UPLOAD_BYTES) || 5 * 1024 * 1024;
    const maxUploadMb = Math.round(maxUploadBytes / (1024 * 1024));

    const onDrop = useCallback(async (acceptedFiles) => {
        if (!acceptedFiles || acceptedFiles.length === 0) return;

        const file = acceptedFiles[0]; // Only handle single file upload here
        if (file.size > maxUploadBytes) {
            alert(`"${file.name}" exceeds ${maxUploadMb}MB limit.`);
            return;
        }

        setUploading(true);

        try {
            const token = sessionStorage.getItem('token');
            const formData = new FormData();
            formData.append('file', file);

            // Simulation of progress for better UX on reasonably fast connections
            let fakeProgress = 0;
            const progressInterval = setInterval(() => {
                fakeProgress += 15;
                if (fakeProgress > 90) fakeProgress = 90;
                setProgress(fakeProgress);
            }, 100);

            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/upload`, {
                method: 'POST',
                body: formData,
                headers: {
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            });

            clearInterval(progressInterval);
            setProgress(100);

            if (response.ok) {
                const data = await response.json();
                onChange(data.url);
            } else {
                console.error(`Failed to upload ${file.name}`);
                alert(`Failed to upload ${file.name}`);
            }

        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file');
        } finally {
            setUploading(false);
            setProgress(0);
        }
    }, [onChange, maxUploadBytes, maxUploadMb]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: accept,
        multiple: false
    });

    const isImage = value && value.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i);

    return (
        <div className={`w-full space-y-2 ${className}`}>
            {label && <label className="block text-sm font-semibold text-slate-700">{label}</label>}

            {/* Display File */}
            {value && (
                <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 w-full mb-4">
                    {isImage ? (
                        <img src={value} alt="Uploaded file" className="w-full h-auto max-h-48 object-contain" />
                    ) : (
                        <div className="flex items-center justify-center p-6 space-x-3">
                            <FaFileAlt className="text-blue-500 text-3xl" />
                            <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium truncate hover:underline">
                                View Document
                            </a>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); onChange(''); }}
                            className="bg-white text-red-600 p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors"
                            title="Remove File"
                        >
                            <FaTrash size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Dropzone */}
            {!value && (
                <div
                    {...getRootProps()}
                    className={`
                        border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ease-in-out relative overflow-hidden
                        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}
                    `}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center space-y-3 relative z-10">
                        {uploading ? (
                            <>
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                                <p className="text-sm text-slate-600 font-medium">Uploading... {progress}%</p>
                            </>
                        ) : (
                            <>
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                                    <FaCloudUploadAlt size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-700">
                                        {isDragActive ? "Drop here" : "Click or drag file"}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
