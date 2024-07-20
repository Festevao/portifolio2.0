import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../types/next'
import Layout from '../../components/Layout/layout';

const Experience: NextPageWithLayout = () => {
  return <div>Experience Page</div>;
};

Experience.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Experience;