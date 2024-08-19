import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../types/next'
import Layout from '../../components/Layout/Layout';

const Blog: NextPageWithLayout = () => {
  return (
    <div className='flex flex-col justify-center items-center h-full w-full min-h-[70vh]'>
      <p>Ainda não existem publicações...</p>
    </div>
  );
};

Blog.getLayout = function getLayout(page: ReactElement) {
  return <Layout pageName='Blog Pessoal'>{page}</Layout>;
};

export default Blog;