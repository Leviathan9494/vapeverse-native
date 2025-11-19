import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PointsContextType {
  userPoints: number;
  setUserPoints: (points: number) => void;
  addPoints: (points: number) => void;
  subtractPoints: (points: number) => void;
  updatePoints: (points: number) => void;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

export function PointsProvider({ children }: { children: ReactNode }) {
  const [userPoints, setUserPoints] = useState(850);

  const addPoints = (points: number) => {
    setUserPoints(prev => prev + points);
  };

  const subtractPoints = (points: number) => {
    setUserPoints(prev => Math.max(0, prev - points));
  };

  const updatePoints = (points: number) => {
    setUserPoints(points);
  };

  return (
    <PointsContext.Provider 
      value={{ 
        userPoints, 
        setUserPoints,
        addPoints,
        subtractPoints,
        updatePoints
      }}
    >
      {children}
    </PointsContext.Provider>
  );
}

export function usePoints() {
  const context = useContext(PointsContext);
  if (context === undefined) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
}
