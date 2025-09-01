"use client";

import Link from "next/link";

export default function NavBar() {
    return (
        <nav className="bg-white shadow-lg rounded-xl mx-4 my-6 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <img src="/globe.svg" alt="Logo" className="h-8 w-8" />
                <span className="text-2xl font-extrabold text-indigo-700 tracking-tight">VoDet</span>
            </div>
            <div className="flex items-center gap-6">
                <Link href="/">
                    <span className="text-lg font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-indigo-50">Classifier</span>
                </Link>
                <Link href="/results">
                    <span className="text-lg font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-indigo-50">Results</span>
                </Link>
            </div>
        </nav>
    );
}
