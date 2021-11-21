import React from "react";
import { NavLink } from "react-router-dom";

import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        <li className={styles.li}>
          <NavLink to="/user">Profil</NavLink>
        </li>
        <li className={styles.li}>
          <NavLink to="/form">Sikteskjema</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
