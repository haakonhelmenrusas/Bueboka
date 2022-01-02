import React, {useState} from "react";
import {getAuth} from "firebase/auth";
import { Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";

import firebaseApp, { logOut } from "../../../auth";
import { ProfileImage } from "../index";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const auth = getAuth(firebaseApp);

  const [ profileMenu, setProfileMenu ] = useState(false);

  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        <li className={styles.li}>
          <NavLink to="/user">Profil</NavLink>
        </li>
        <li className={styles.li}>
          <NavLink to="/form">Sikteskjema</NavLink>
        </li>
        <li className={styles.li}>
          <ProfileImage onClick={() => setProfileMenu((prevState => !prevState ))}
                        photoURL={auth.currentUser ? auth.currentUser.photoURL ? auth.currentUser.photoURL : "" : ""} />
          {profileMenu && (
            <div className={styles.profileNav}>
              <Button variant="secondary" onClick={logOut}>Logg ut</Button>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
