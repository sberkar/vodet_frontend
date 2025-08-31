"use client";

import React, { useState, useEffect } from "react";

export default function ResultsDetailPage( { params } ) {
    const { id } = params;
    const [results, setResults] = useState([]);

    useEffect(() => {
        // Fetch the detailed results for the job ID
        const fetchResults = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/results/${id}_processed_results`);
                const data = await response.json();
                setResults(data.results);
            } catch (error) {
                console.error('Error fetching job results:', error);
            }
        };

        fetchResults();
    }, [id]);

    return (
        <div className="py-16 px-32">
            <h1>Results for Job ID: {id}</h1>
            {results ? (
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="font-normal">
                            <th>Source IP</th>
                            <th>Destination IP</th>
                            <th>Flow Duration</th>
                            <th>Jitter</th>
                            <th>Source Port</th>
                            <th>Destination Port</th>
                            <th>VoIP</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {results.map((result, index) => (
                            <tr key={index} className={`${result.is_voip ? 'text-green-600' : 'text-red-600'} font-medium`}>
                                <td>{result.src_ip}</td>
                                <td>{result.dst_ip}</td>
                                <td>{result.flow_duration.toFixed(2)}s</td>
                                <td>{result.jitter.toFixed(3)}s</td>
                                <td>{result.src_port}</td>
                                <td>{result.dst_port}</td>
                                <td>{result.is_voip ? "Yes" : "No"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
