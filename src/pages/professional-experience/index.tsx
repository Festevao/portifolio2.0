import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../types/next'
import Layout from '../../components/Layout/Layout';
import CompanySection from '@/components/CompanySection/CompanySection';
import { companies } from '@/constants/companies';

const Experience: NextPageWithLayout = () => {
  const RenderCompanies = () => {
    return companies.map((company) => {
      return <CompanySection {...company}/>
    });
  };
  return (
    <div className='w-[80%] felx flex-col justify-center items-start'>
      <RenderCompanies />
      <p>Projetos</p>
    </div>
  );
};

Experience.getLayout = function getLayout(page: ReactElement) {
  return <Layout pageName='Experiência profissional'>{page}</Layout>;
};

export default Experience;