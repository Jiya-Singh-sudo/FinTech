'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const FraudContext = createContext({});

export const FraudProvider = ({ children }) => {
  const [results, setResults] = useState(null);

  // Persistence (optional for hackathon reliability)
  useEffect(() => {
    const saved = localStorage.getItem('fraud_results');
    if (saved) {
      setResults(JSON.parse(saved));
    }
  }, []);

  const updateResults = (data) => {
    setResults(data);
    localStorage.setItem('fraud_results', JSON.stringify(data));
  };

  const clearResults = () => {
    setResults(null);
    localStorage.removeItem('fraud_results');
  };

  return (
    <FraudContext.Provider value={{ results, updateResults, clearResults }}>
      {children}
    </FraudContext.Provider>
  );
};

export const useFraud = () => useContext(FraudContext);
