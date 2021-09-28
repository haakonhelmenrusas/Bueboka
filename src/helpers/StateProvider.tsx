import firebase from 'firebase/auth';
import React, { useState, createContext, useEffect } from 'react'
import { User } from '../types/User';
import { UserContextState } from '../types/UserContext';

interface IState {
  children: React.ReactNode;
}

const contextDefaultValues: UserContextState = {
  user: {displayName: '', email: '', photoURL: '', id: ''},
  updateUser: () => {}
};

export const UserContext = createContext<UserContextState>(contextDefaultValues);

const StateProvider = ({ children }: IState) => {

  const [user, setUser] = useState<User>(contextDefaultValues.user);

  const updateUser = (user: User) => setUser((prevState) => ({ ...prevState, displayName: user.displayName, email: user.email, photoURL: user.photoURL}));

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user => {
      if (user) {
        const userProfile: User = {
          displayName: user.displayName!,
          email: user.email!,
          photoURL: user.photoURL!,
          id: user.uid
        }
        updateUser(userProfile)
      }
    }))
  }, [user])

  return (
    <UserContext.Provider value={{ user, updateUser }}>
     {children}
    </UserContext.Provider>
  )
}

export default StateProvider
