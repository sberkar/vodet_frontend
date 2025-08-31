"use client";

import React, { useState, useEffect} from 'react';
import FileUploadProgressBar from '../components/FileUploadProgress';
import axios from 'axios';

export default function Home() {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadResponse, setUploadResponse] = useState(null);
    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('');


    useEffect(() => {
        if (progress === 100 && !isUploading && uploadResponse !== null) {
            setStatus('Processing file...');
            setIsUploading(false);
            setProgress(100);

            // file status check
            const checkStatus = setInterval(async () => {
                try {
                    const response = await fetch(`http://127.0.0.1:5000/job_status/${uploadResponse.jobid}`);
                    const data = await response.json();
                    if (data.job_status.status === 0) {
                        setStatus('File processing completed');
                        setProgress(0);
                        clearInterval(checkStatus);
                    } else if (data.job_status.status === 2) {
                        setStatus('Processing failed. Please try again.');
                        setProgress(0);
                        clearInterval(checkStatus);
                    }
                } catch (error) {
                    console.error('Error fetching job status:', error);

                    setStatus('Error checking status. Please try again.');
                    clearInterval(checkStatus);
                }
            }, 3000); // check every 2 seconds

        }
    }, [progress, isUploading, uploadResponse]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please select a file to upload.");
            return;
        }

        setIsUploading(true);
        setProgress(0);
        setStatus('Uploading...');


        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
                headers: {
                    'Content-Type': "multipart/form-data"
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                }
            }
            )
            const responseData = await response.data;
            setUploadResponse(responseData);

            const jobid_key = 'jobid'+( localStorage.length + 1).toString();
            localStorage.setItem(jobid_key, responseData.jobid);
            setFile(null);
        }catch(e){
            console.log(e);
        }finally{
            setIsUploading(false);
            setStatus('Processing file...');
        }
    }

  return (
    <div className="w-full p-4">
        <div className='flex justify-center items-center'>
        <div className="bg-white shadow-2xl rounded-2xl p-8 md:p-12 w-fit">
            <div className="text-center mb-10">
                <svg className="mx-auto h-12 w-auto text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-4">VoIP Traffic Classifier</h1>
                <p className="text-gray-500 mt-2">Upload a network metadata file to classify its traffic.</p>
            </div>

            <form id="upload-form" className="space-y-6">
                <div>
                    <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">Network Data File</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="file-input" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                    <span>Upload a file</span>
                                    <input id="file-input" name="file" type="file" className="sr-only" onChange={e => {
                                        setFile(e.target.files[0]);
                                        setProgress(0);
                                    }}/>
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                        </div>
                    </div>
                </div>

                <button type="submit" id="submit-button" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                    onClick={handleUpload} 
                >
                    Classify Traffic
                </button>
            </form>

            <div>
                <p className="mt-4 text-center text-gray-600">{status}</p>
            </div>
            
            <div className={`${isUploading || progress != 0 ? 'block' : 'hidden'} mt-6`}>
                <FileUploadProgressBar isUploading={isUploading} progress={progress} />
            </div>

        </div>
        </div>
    </div>
  );
}
