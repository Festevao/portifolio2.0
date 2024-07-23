import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../types/next'
import Layout from '../../components/Layout/LayoutTemp';

const Knowledge: NextPageWithLayout = () => {
  return <div>Knowledge Page</div>;
};

Knowledge.getLayout = function getLayout(page: ReactElement) {
  return <Layout pageName='Base de conhecimento'>{page}</Layout>;
};

export default Knowledge;