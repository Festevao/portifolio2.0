import React, { ReactNode } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const Layout = (props: { children: ReactNode }) => {
  return (
    <div className="layout w-full h-full flex flex-col items-center justify-center">
      <Header />
      <main className="main-content">
        {props.children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;