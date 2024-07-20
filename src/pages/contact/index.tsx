import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../types/next'
import Layout from '../../components/Layout/layout';

const Contact: NextPageWithLayout = () => {
  return <div>Contact Page</div>;
};

Contact.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Contact;