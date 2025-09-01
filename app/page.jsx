"use client";

import React, { useState, useEffect} from 'react';
import FileUploadProgressBar from '../components/FileUploadProgress';
import axios from 'axios';

export default function Home() {
    const API_HOST = process.env.NEXT_PUBLIC_API_HOST || 'http://127.0.0.1:5000';
    const API_ACCESS_KEY = process.env.NEXT_PUBLIC_API_ACCESS_KEY;
    const [isUploading, setIsUploading] = useState(false);
    const [uploadResponse, setUploadResponse] = useState(null);
    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState(null);
    const [identifier, setIdentifier] = useState('');
    const [status, setStatus] = useState('');
    const [jobStatus, setJobStatus] = useState('');
    const [jobId, setJobId] = useState(null);
    const [error, setError] = useState('');


    // Poll job status after upload
    useEffect(() => {
        let interval;
        if (uploadResponse && uploadResponse.jobid) {
            setJobId(uploadResponse.jobid);
            setStatus('Processing file...');
            interval = setInterval(async () => {
                try {
                    const response = await fetch(`${API_HOST}/job_status/${uploadResponse.jobid}`, {
                        headers: {
                            'Authorization': `Bearer ${API_ACCESS_KEY}`
                        }
                    });
                    const data = await response.json();
                    const apiStatus = data.job_status.status;
                    setJobStatus(apiStatus);
                    if (apiStatus === 'processing') {
                        setStatus('File is being processed...');
                    } else if (apiStatus === 'pc') {
                        setStatus('File processing completed. Ready for classification.');
                        clearInterval(interval);
                    } else if (apiStatus === 'classifying') {
                        setStatus('Classification in progress...');
                    } else if (apiStatus === 'error') {
                        setStatus('Processing failed. Please try again.');
                        clearInterval(interval);
                    }
                } catch (err) {
                    setError('Error checking job status.');
                    clearInterval(interval);
                }
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [uploadResponse]);

    // Start classification
    const handleStartClassification = async () => {
        if (!jobId) return;
        setStatus('Starting classification...');
        try {
            const response = await fetch(`${API_HOST}/classify/${jobId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_ACCESS_KEY}`
                }
            });
            if (!response.ok) throw new Error('Failed to start classification');
            setStatus('Classification started.');
            // Poll for classification status
            const pollClassification = setInterval(async () => {
                try {
                    const res = await fetch(`${API_HOST}/job_status/${jobId}`, {
                        headers: {
                            'Authorization': `Bearer ${API_ACCESS_KEY}`
                        }
                    });
                    const data = await res.json();
                    const apiStatus = data.job_status.status;
                    setJobStatus(apiStatus);
                    if (apiStatus === 'classifying') {
                        setStatus('Classification in progress...');
                    } else if (apiStatus == 'cc') {
                        setStatus('Classification completed. You can now view results.');
                        clearInterval(pollClassification);
                    } else if (apiStatus === 'error') {
                        setStatus('Classification failed.');
                        clearInterval(pollClassification);
                    }
                } catch (err) {
                    setError('Error checking classification status.');
                    clearInterval(pollClassification);
                }
            }, 3000);
        } catch (err) {
            setError('Error starting classification.');
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setError('');
        if (!file) {
            alert("Please select a file to upload.");
            return;
        }
        setIsUploading(true);
        setProgress(0);
        setStatus('Uploading...');
        const formData = new FormData();
        formData.append('file', file);
        if (identifier) {
            formData.append('identifier', identifier);
        }
        try {
            const response = await axios.post(`${API_HOST}/upload`, formData, {
                headers: {
                    'Content-Type': "multipart/form-data",
                    'Authorization': `Bearer ${API_ACCESS_KEY}`
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                }
            });
            const responseData = response.data;
            setUploadResponse(responseData);
            const localStorageLength = localStorage.length;
            localStorage.setItem('jobid_'+localStorageLength, JSON.stringify({
                jobid: responseData.jobid,
                identifier: identifier
            }));
            setFile(null);
            setIdentifier('');
        } catch (e) {
            setError('Error uploading file.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 font-sans">
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-white shadow-2xl rounded-2xl p-10 md:p-16 w-full max-w-xl mx-auto">
                    <div className="text-center mb-10">
                        <svg className="mx-auto h-14 w-auto text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                        </svg>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 mt-4 tracking-tight">VoIP Traffic Classifier</h1>
                        <p className="text-gray-500 mt-2 text-lg">Upload a network metadata file to classify its traffic.</p>
                    </div>

                    <form id="upload-form" className="space-y-8">
                        <div>
                            <label htmlFor="file-upload" className="block text-md font-semibold text-gray-700 mb-2">Network Data File</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-indigo-300 rounded-xl bg-indigo-50">
                                <div className="space-y-1 text-center">
                                    <svg className="mx-auto h-12 w-12 text-indigo-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div className="flex text-md text-gray-600 justify-center items-center gap-2">
                                        <label htmlFor="file-input" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 px-4 py-2 shadow">
                                            <span>Upload a file</span>
                                            <input id="file-input" name="file" type="file" className="sr-only" onChange={e => {
                                                setFile(e.target.files[0]);
                                                setProgress(0);
                                            }}/>
                                        </label>
                                        <span className="pl-1">or drag and drop</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="identifier" className="block text-md font-semibold text-gray-700 mb-2">Identifier (optional)</label>
                            <input
                                id="identifier"
                                name="identifier"
                                type="text"
                                className="w-full px-4 py-3 border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                                value={identifier}
                                onChange={e => setIdentifier(e.target.value)}
                                placeholder="Enter a job identifier (e.g. MyJob123)"
                            />
                        </div>

                        <button type="submit" id="submit-button" className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 transition-all duration-200"
                            onClick={handleUpload}
                            disabled={isUploading}
                        >
                            Upload & Process
                        </button>
                    </form>

                    <div>
                        <p className="mt-6 text-center text-gray-700 text-lg font-medium">{status}</p>
                        {error && <p className="mt-2 text-center text-red-600 text-md">{error}</p>}
                    </div>

                    <div className={`${isUploading || progress !== 0 ? 'block' : 'hidden'} mt-8`}>
                        <FileUploadProgressBar isUploading={isUploading} progress={progress} />
                    </div>

                    {/* Show Start Classification button if job is processed */}
                    {jobStatus === 'pc' && (
                        <button
                            className="w-full mt-8 py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
                            onClick={handleStartClassification}
                        >
                            Start Classification
                        </button>
                    )}

                    {/* Show View Results button if classification is done */}
                    {jobStatus === 'cc' && (
                        <a
                            href={`/results/${jobId}`}
                            className="w-full block mt-4 py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-center transition-all duration-200"
                        >
                            View Results
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
