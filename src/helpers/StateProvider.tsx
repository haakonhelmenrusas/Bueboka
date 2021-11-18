import {getAuth, onAuthStateChanged} from 'firebase/auth';
import React, {createContext, useEffect, useState} from 'react'
import {IUser} from '../types/User';
import {UserContextState} from '../types/UserContext';
import firebaseApp from "../auth/FirebaseConfig";

interface IState {
  children: React.ReactNode;
}

const contextDefaultValues: UserContextState = {
  user: {displayName: '', email: '', photoURL: '', id: ''},
  updateUser: () => {
  }
};

export const UserContext = createContext<UserContextState>(contextDefaultValues);

const StateProvider = ({ children }: IState) => {
  const auth = getAuth(firebaseApp);
  const [user, setUser] = useState<IUser>(contextDefaultValues.user);

  const updateUser = (user: IUser) => setUser((prevState) => ({ ...prevState, displayName: user.displayName, email: user.email, photoURL: user.photoURL}));

  useEffect(() => {
    onAuthStateChanged(auth,(user => {
      if (user) {
        const userProfile: IUser = {
          displayName: user.displayName!,
          email: user.email!,
          photoURL: user.photoURL!,
          id: user.uid
        }
        updateUser(userProfile)
      }
    }))
  }, [user, auth])

  return (
    <UserContext.Provider value={{ user, updateUser }}>
     {children}
    </UserContext.Provider>
  )
}

export default StateProvider
