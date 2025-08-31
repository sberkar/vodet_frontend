"use client";

import { useAppContext } from "@/contexts/AppContext";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function ResultsPage() {
    const { jobId } = useAppContext();
    const [jobStatuses, setJobStatuses] = useState({});

    const getStatusForJobId = (id) => {
        fetch(`http://127.0.0.1:5000/job_status/${id}`)
        
            .then(response => response.json())
            .then(data => setJobStatuses((prevStatuses) => ({ ...prevStatuses, [id]: data.job_status.status })))
            .catch(error => {
                console.error('Error fetching job status:', error);
                setJobStatuses((prevStatuses) => ({ ...prevStatuses, [id]: 'Unknown' }));
            });
    };

    const handleStartClassification = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/classify/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error starting classification:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            for (const id of jobId) {
                getStatusForJobId(id);
            }
        };

        fetchData();
    }, [jobId]);

    console.log(jobStatuses);

    return (
        <div>
            <h1>Results</h1>
            <ul>
                {jobId.map((id, index) => (
                        <div key={index} className="flex justify-around">
                            <h2>Job ID: {id}</h2>
                            <p>Status: {jobStatuses[id] === 'Unknown' ? 'Loading...' : jobStatuses[id] == 0 ? 'Processing Completed': jobStatuses[id] == 'processing' && 'Processing...'}{
                                jobStatuses[id] == 1 && "Classification Completed"
                            }</p>

                            {jobStatuses[id] == 0 &&
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => handleStartClassification(id)}>

                                        Start Classification
                                    </button>
                            }
                            {
                                jobStatuses[id] == 1 &&
                                <Link href={`/results/${id}`}>
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                        View Results
                                    </button>
                                </Link>
                            }
                        </div>
                ))}
            </ul>
        </div>
    );
}
