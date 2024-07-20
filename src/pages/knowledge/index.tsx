import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../types/next'
import Layout from '../../components/Layout/layout';

const Knowledge: NextPageWithLayout = () => {
  return <div>Knowledge Page</div>;
};

Knowledge.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Knowledge;