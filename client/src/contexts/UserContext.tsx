import React, { createContext, useContext, ReactNode } from 'react';
import { useUserStore } from '../store/userStore';

const UserContext = createContext(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const user = useUserStore((state) => state.user);

  return (
    <UserContext.Provider value={user}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
