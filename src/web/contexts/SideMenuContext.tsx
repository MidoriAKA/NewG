import { createContext, useContext, useState } from 'react';

const SideMenuContext = createContext({} as any);
export const useSideMenuContext = () => {
  return useContext(SideMenuContext);
}

export const SideMenuContextProvider: React.FC<TAppProps> = ({ children }) => {
  const [state, setState] = useState<Active>("allTickets");
  return (
    <SideMenuContext.Provider
      value={{
        state,
        setState
      }}>
      {children}
    </SideMenuContext.Provider>
  );
}
