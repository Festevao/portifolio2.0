import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../types/next'
import Layout from '../../components/Layout/LayoutTemp';

const Blog: NextPageWithLayout = () => {
  return <div>Blog Page</div>;
};

Blog.getLayout = function getLayout(page: ReactElement) {
  return <Layout pageName='Blog Pessoal'>{page}</Layout>;
};

export default Blog;