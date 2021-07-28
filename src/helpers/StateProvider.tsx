import React, { useState, createContext } from 'react'
import { User } from '../types/User';
import { UserContextState } from '../types/UserContext';

interface IState {
  children: React.ReactNode;
}

const contextDefaultValues: UserContextState = {
  user: {displayName: '', email: '', photoURL: ''},
  updateUser: () => {}
};

export const UserContext = createContext<UserContextState>(contextDefaultValues);

const StateProvider = ({ children }: IState) => {

  const [user, setUser] = useState<User>(contextDefaultValues.user);

  const updateUser = (user: any) => setUser((prevState) => ({ ...prevState, user}));

  return (
    <UserContext.Provider value={{ user, updateUser }}>
     {children} 
    </UserContext.Provider>
  )
}

export default StateProvider
