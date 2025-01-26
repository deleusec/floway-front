import { createContext, useContext, useState } from 'react';

const StudioContext = createContext<any>(null);

export const StudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [studioData, setStudioData] = useState(null);

  return (
    <StudioContext.Provider
      value={{
        studioData,
        setStudioData,
      }}>
      {children}
    </StudioContext.Provider>
  );
};

export const useStudioContext = () => useContext(StudioContext);
