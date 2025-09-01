"use client";

import React, { useState, useEffect } from "react";

export default function ResultsDetailPage( { params } ) {
    const { id } = React.use(params);
    const [results, setResults] = useState([]);
    const [identifier, setIdentifier] = useState('');
    const [page, setPage] = useState(1);
    const [perPage] = useState(25);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const API_HOST = process.env.NEXT_PUBLIC_API_HOST || 'http://127.0.0.1:5000';
    const API_ACCESS_KEY = process.env.NEXT_PUBLIC_API_ACCESS_KEY;

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_HOST}/results/${id}?page=${page}&per_page=${perPage}`, {
                    headers: {
                        'Authorization': `Bearer ${API_ACCESS_KEY}`
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch results');
                const data = await response.json();
                setResults(Array.isArray(data.results.results) ? data.results.results : []);
                setIdentifier(data.identifier || '');
            } catch (err) {
                setError('Error fetching job results');
                setResults([]);
                setIdentifier('');
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [id, page, perPage]);

    return (
        <div className="py-8 px-4 md:px-32 font-sans">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
                <h1 className="text-4xl font-extrabold text-center mb-4 text-indigo-700 tracking-tight">Results for Job ID: <span className="text-gray-900">{id}</span></h1>
                {identifier && (
                    <h2 className="text-xl text-center mb-6 text-gray-500">Identifier: <span className="font-semibold text-indigo-600">{identifier}</span></h2>
                )}
                {error && <p className="text-red-600 text-center mb-4">{error}</p>}
                {loading ? (
                    <p className="text-lg text-center text-gray-500">Loading...</p>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto rounded-xl overflow-hidden shadow-md">
                                <thead className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                                    <tr className="font-semibold text-lg">
                                        <th className="px-4 py-3">Source IP</th>
                                        <th className="px-4 py-3">Destination IP</th>
                                        <th className="px-4 py-3">Flow Duration</th>
                                        <th className="px-4 py-3">Jitter</th>
                                        <th className="px-4 py-3">Source Port</th>
                                        <th className="px-4 py-3">Destination Port</th>
                                        <th className="px-4 py-3">VoIP</th>
                                    </tr>
                                </thead>
                                <tbody className="text-center">
                                    {results.map((result, index) => (
                                        <tr
                                            key={index}
                                            className={`transition-colors duration-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-indigo-50 ${result.is_voip ? 'text-green-600' : 'text-red-600'} font-medium`}
                                        >
                                            <td className="px-4 py-2">{result.src_ip}</td>
                                            <td className="px-4 py-2">{result.dst_ip}</td>
                                            <td className="px-4 py-2">{Number(result.flow_duration).toFixed(2)}s</td>
                                            <td className="px-4 py-2">{Number(result.jitter).toFixed(3)}s</td>
                                            <td className="px-4 py-2">{result.src_port}</td>
                                            <td className="px-4 py-2">{result.dst_port}</td>
                                            <td className="px-4 py-2 font-bold">{result.is_voip ? "Yes" : "No"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-center mt-8 gap-4">
                            <button
                                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold px-6 py-2 rounded-xl shadow transition-colors duration-200 disabled:opacity-50"
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                            >
                                Previous
                            </button>
                            <span className="text-lg font-semibold text-gray-700">Page {page}</span>
                            <button
                                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold px-6 py-2 rounded-xl shadow transition-colors duration-200 disabled:opacity-50"
                                onClick={() => setPage(page + 1)}
                                disabled={results.length < perPage}
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
