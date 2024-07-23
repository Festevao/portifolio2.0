import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../types/next'
import Layout from '../../components/Layout/Layout';

const Contact: NextPageWithLayout = () => {
  return (
    <div>
      <p>Redes sociais</p>
      <p>Informações de contato pessoais</p>
    </div>
  );
};

Contact.getLayout = function getLayout(page: ReactElement) {
  return <Layout pageName='Contato'>{page}</Layout>;
};

export default Contact;