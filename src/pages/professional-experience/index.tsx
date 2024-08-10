import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../types/next'
import Layout from '../../components/Layout/Layout';
import CompanySection from '@/components/CompanySection/CompanySection';
import { companies } from '@/constants/companies';

const Experience: NextPageWithLayout = () => {
  const RenderCompanies = () => {
    return companies.map((company, index) => {
      return <CompanySection {...company} key={`company-${index}`}/>
    });
  };
  return (
    <div className='w-[80%] flex flex-col justify-center items-start gap-5'>
      <RenderCompanies />
    </div>
  );
};

Experience.getLayout = function getLayout(page: ReactElement) {
  return <Layout pageName='Experiência profissional'>{page}</Layout>;
};

export default Experience;