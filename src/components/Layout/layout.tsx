import React, { ReactNode } from 'react';

const Layout = (props: { children: ReactNode }) => {
  return (
    <div className="layout">
      <header className="header">
        {/* Seu header aqui */}
      </header>
      <main className="main-content">
        {props.children}
      </main>
      <footer className="footer">
        {/* Seu footer aqui */}
      </footer>
    </div>
  );
};

export default Layout;