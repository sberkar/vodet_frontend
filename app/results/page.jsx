"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function ResultsPage() {
    const API_HOST = process.env.NEXT_PUBLIC_API_HOST || 'http://127.0.0.1:5000';
    const API_ACCESS_KEY = process.env.NEXT_PUBLIC_API_ACCESS_KEY;
    const [jobs, setJobs] = useState([]);
    const [jobStatuses, setJobStatuses] = useState({});

    // Read jobs from localStorage on mount
    useEffect(() => {
        const jobsArr = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('jobid_')) {
                try {
                    const jobObj = JSON.parse(localStorage.getItem(key));
                    if (jobObj && jobObj.jobid) {
                        jobsArr.push(jobObj);
                    }
                } catch (e) {}
            }
        }
        setJobs(jobsArr);
    }, []);

    // Fetch job status from API
    const getStatusForJobId = (id) => {
    fetch(`${API_HOST}/job_status/${id}`,{
        headers: {
            'Authorization': `Bearer ${API_ACCESS_KEY}`
        }
    })
            .then(response => response.json())
            .then(data => setJobStatuses((prevStatuses) => ({ ...prevStatuses, [id]: data.job_status.status })))
            .catch(error => {
                console.error('Error fetching job status:', error);
                setJobStatuses((prevStatuses) => ({ ...prevStatuses, [id]: 'error' }));
            });
    };

    // Start classification for a job
    const handleStartClassification = async (id) => {
        try {
            const response = await fetch(`${API_HOST}/classify/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_ACCESS_KEY}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            getStatusForJobId(id);
            console.log(data);
        } catch (error) {
            console.error('Error starting classification:', error);
        }
    };

    // Periodically check status for each job
    useEffect(() => {
        if (jobs.length === 0) return;
        const interval = setInterval(() => {
            jobs.forEach(job => getStatusForJobId(job.jobid));
        }, 3000);
        // Initial fetch
        jobs.forEach(job => getStatusForJobId(job.jobid));
        return () => clearInterval(interval);
    }, [jobs]);

    // Helper to display status text
    const getStatusText = (status) => {
        switch (status) {
            case 'processing':
                return 'File is being processed';
            case 'pc':
                return 'Processing done';
            case 'classifying':
                return 'Classification in progress';
            case 'cc':
                return 'Classification done';
            case 'error':
                return 'Error occurred';
            default:
                return 'Loading...';
        }
    };

    return (
        <div className="my-8 font-sans">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
                <h1 className="text-4xl font-extrabold text-center mb-8 text-indigo-700 tracking-tight">Your Jobs</h1>
                <ul className="space-y-6">
                    {jobs.length === 0 && (
                        <p className="text-center text-gray-500 text-lg">No jobs found. Upload a file to get started!</p>
                    )}
                    {jobs.map((job, index) => {
                        const status = jobStatuses[job.jobid];
                        return (
                            <li key={index} className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl shadow p-6 transition-all duration-200 hover:shadow-lg">
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-800">Job ID: <span className="text-indigo-600">{job.jobid}</span></h2>
                                        <p className="text-md text-gray-500">Identifier: <span className="font-semibold text-blue-600">{job.identifier || <span className="text-gray-400">(none)</span>}</span></p>
                                    </div>
                                    <div className="md:ml-8">
                                        <span className="inline-block px-4 py-2 rounded-full font-semibold text-sm bg-indigo-100 text-indigo-700 shadow">{getStatusText(status)}</span>
                                    </div>
                                </div>
                                <div className="flex gap-4 mt-4 md:mt-0">
                                    {status === 'pc' && (
                                        <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-xl shadow transition-colors duration-200"
                                            onClick={() => handleStartClassification(job.jobid)}>
                                            Start Classification
                                        </button>
                                    )}
                                    {status === 'cc' && (
                                        <Link href={`/results/${job.jobid}`}>
                                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold px-5 py-2 rounded-xl shadow transition-colors duration-200">
                                                View Results
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
