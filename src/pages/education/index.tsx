import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../types/next'
import Layout from '../../components/Layout/Layout';

const Education: NextPageWithLayout = () => {
  return <div>Education Page</div>;
};

Education.getLayout = function getLayout(page: ReactElement) {
  return <Layout pageName='Formação'>{page}</Layout>;
};

export default Education;