import { createContext, useEffect, useState } from 'react';

export const CsrfContext = createContext();

// Provider component to wrap your entire application
export function CsrfContextProvider({ children }) {
    const [csrfToken, setCsrfToken] = useState(null);

    useEffect(() => {
        // Fetch the CSRF token when the component mounts
        fetch('/api/get-csrf-token')
            .then(response => response.json())
            .then(data => {
                setCsrfToken(data.csrfToken);
            })
            .catch(error => {
                console.error('Failed to fetch CSRF token', error);
            });
    }, []);

    return (
        <CsrfContext.Provider value={{ csrfToken, setCsrfToken }}>
            {children}
        </CsrfContext.Provider>
    );
}