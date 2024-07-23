import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../types/next'
import Layout from '../../components/Layout/LayoutTemp';

const Experience: NextPageWithLayout = () => {
  return <div>Experience Page</div>;
};

Experience.getLayout = function getLayout(page: ReactElement) {
  return <Layout pageName='Experiência profissional'>{page}</Layout>;
};

export default Experience;