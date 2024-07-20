import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../types/next'
import Layout from '../../components/Layout/layout';

const Education: NextPageWithLayout = () => {
  return <div>Education Page</div>;
};

Education.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Education;