import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../types/next'
import Layout from '../../components/Layout/Layout';
import CompanySection from '@/components/CompanySection/CompanySection';
import { companies } from '@/constants/companies';

const bannerInfos = {
  title: '',
  description: '',
  imageUrl: '',
  bgColor: '#000000',
  textColor: '#F7CAC9',
  titleColor: '#E0F7FA',
  reverse: true,
}

const Experience: NextPageWithLayout = () => {
  const RenderCompanies = () => {
    return companies.map((company, index) => {
      return <CompanySection {...company} key={`company-${index}`}/>
    });
  };
  return (
    <div className='w-[80%] flex flex-col justify-center items-center gap-5'>
      <h1 className='text-lg underline font-bold text-center mt-5'>Experiência profissional</h1>
      <p className='text-center w-full mb-5'>Aqui eu falo um pouquinho de empresas e projetos que ja trabalhei.</p>
      <RenderCompanies />
    </div>
  );
};

Experience.getLayout = function getLayout(page: ReactElement) {
  return <Layout pageName='Experiência profissional'>{page}</Layout>;
};

export default Experience;