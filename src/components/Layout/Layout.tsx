import React, { ReactNode } from 'react';
import Head from 'next/head';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const Layout = (props: { children: ReactNode, pageName: string }) => {
  return (
    <>
      <Head>
        <title>Felipi | {props.pageName}</title>
      </Head>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow w-full flex flex-col items-center justify-start">
          {props.children}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
