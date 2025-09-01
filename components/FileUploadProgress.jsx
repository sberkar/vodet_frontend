"use client";

export default function FileUploadProgressBar({ isUploading, progress }) {
    return (
        <div className="w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-6 mt-4 shadow-md relative">
            <div
                className={`h-6 rounded-full transition-all duration-500 ease-in-out ${isUploading ? 'bg-gradient-to-r from-green-400 via-blue-500 to-indigo-600 animate-pulse' : 'bg-gradient-to-r from-blue-400 to-indigo-600'}`}
                style={{ width: `${progress}%` }}
            >
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-semibold text-white drop-shadow">
                    {progress}%
                </div>
            </div>
        </div>
    );
}
