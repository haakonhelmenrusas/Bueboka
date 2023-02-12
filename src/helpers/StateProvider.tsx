import { browserLocalPersistence, getAuth, onAuthStateChanged } from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";

import { User, UserContextState } from "../models/";
import firebaseApp from "../auth/";

interface IState {
  children: React.ReactNode;
}

const contextDefaultValues: UserContextState = {} as UserContextState;

export const UserContext = createContext<UserContextState>(contextDefaultValues);

const StateProvider = ({ children }: IState) => {
  const auth = getAuth(firebaseApp);
  const [user, setUser] = useState<User>(contextDefaultValues.user);

  auth.setPersistence(browserLocalPersistence);

  const updateUser = (currentUser: User) =>
    setUser((prevState) => ({
      ...prevState,
      displayName: currentUser.displayName,
      email: currentUser.email,
      photoURL: currentUser.photoURL,
    }));

  useEffect(() => {
    onAuthStateChanged(auth, (changedUser) => {
      if (changedUser) {
        const userProfile: User = {
          displayName: changedUser.displayName,
          email: changedUser.email,
          photoURL: changedUser.photoURL,
          id: changedUser.uid,
        };
        updateUser(userProfile);
      }
    });
  }, []);

  return <UserContext.Provider value={{ user, updateUser }}>{children}</UserContext.Provider>;
};

export default StateProvider;
