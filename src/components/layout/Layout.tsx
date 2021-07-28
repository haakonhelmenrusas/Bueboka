import React from 'react';
import Header from '../header/Header';

import styles from './Layout.module.css';

interface ILayout {
  children: React.ReactNode;
}

const Layout = ({ children }: ILayout) => {
  return (
  <>
    <Header />
    <div className={styles.layout}>
      <main>
        {children}
      </main>
    </div>
  </>
  )
}

export default Layout
