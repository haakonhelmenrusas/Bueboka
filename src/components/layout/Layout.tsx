import React from 'react';

import styles from './Layout.module.css';

interface ILayout {
  children: React.ReactNode;
}

const Layout = ({ children }: ILayout) => {
  return (
    <div className={styles.layout}>
      <header className="App-header">
        <h1>Bueskytterens assistent</h1>
      </header>
      <main>
        {children}
      </main>
    </div>
  )
}

export default Layout
