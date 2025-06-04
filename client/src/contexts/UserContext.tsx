'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useUserStore } from '../store/userStore';

// Define the user type based on the store's user type
type User = ReturnType<typeof useUserStore>['user'];
const UserContext = createContext<User>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const user = useUserStore((state) => state.user);

  return (
    <UserContext.Provider value={user}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
