"use client";

import React, { useEffect } from "react";

const AppContext = React.createContext();

export const AppProvider = ({ children }) => {
    const [jobId, setJobId] = React.useState([]);

    useEffect(() => {
        const numberOfItems = localStorage.length
        for (let i = 0; i < numberOfItems; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('jobid')) {
                const storedJobId = localStorage.getItem(key);
                setJobId(prevJobIds => [...prevJobIds, storedJobId]);
            }
        }
    }, []);

    return (
        <AppContext.Provider value={{ jobId, setJobId }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return React.useContext(AppContext);
};
