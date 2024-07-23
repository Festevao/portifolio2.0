import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../types/next'
import Layout from '../../components/Layout/Layout';

const Knowledge: NextPageWithLayout = () => {
  return (
    <div>
      <p>Linguagens</p>
      <p>Tecnologias</p>
      <p>Serviços contratáveis</p>
    </div>
  );
};

Knowledge.getLayout = function getLayout(page: ReactElement) {
  return <Layout pageName='Base de conhecimento'>{page}</Layout>;
};

export default Knowledge;