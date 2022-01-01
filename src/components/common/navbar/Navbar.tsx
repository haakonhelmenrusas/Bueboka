import React from "react";
import {getAuth} from "firebase/auth";
import { Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";

import firebaseApp, { logOut } from "../../../auth";
import { ProfileImage } from "../index";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const auth = getAuth(firebaseApp);

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
          <div className={styles.profileNav}>
            <ProfileImage photoURL={auth.currentUser ? auth.currentUser.photoURL ? auth.currentUser.photoURL : "" : ""} />
            <Button variant="secondary" onClick={logOut}>Logg ut</Button>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
