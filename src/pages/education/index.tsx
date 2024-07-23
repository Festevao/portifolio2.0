import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../types/next'
import Layout from '../../components/Layout/Layout';

const Education: NextPageWithLayout = () => {
  return (
    <div>
      <p>Faculdade</p>
      <p>Cursos</p>
      <p>Mentores</p>
    </div>
  );
};

Education.getLayout = function getLayout(page: ReactElement) {
  return <Layout pageName='Formação'>{page}</Layout>;
};

export default Education;