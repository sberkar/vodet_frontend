"use client";

export default function FileUploadProgressBar({ isUploading, progress }) {
    return (
        <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
            <div className={`h-4 rounded-full transition-all duration-500 ease-in-out ${isUploading ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${progress}%` }}></div>
        </div>
    );
}
