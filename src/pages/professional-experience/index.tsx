import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../types/next'
import Layout from '../../components/Layout/Layout';

const Experience: NextPageWithLayout = () => {
  return (
    <div>
      <p>Empresas</p>
      <p>Projetos</p>
    </div>
  );
};

Experience.getLayout = function getLayout(page: ReactElement) {
  return <Layout pageName='Experiência profissional'>{page}</Layout>;
};

export default Experience;