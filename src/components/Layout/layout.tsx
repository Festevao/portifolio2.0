import React, { ReactNode } from 'react';
import Head from 'next/head';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const Layout = (props: { children: ReactNode, pageName: string }) => {
  return (
    <div className="layout w-full h-full flex flex-col items-center justify-center">
      <Head>
        <title>Felipi | {props.pageName}</title>
      </Head>
      <Header />
      <main className="main-content">
        {props.children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
