import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../types/next'
import Layout from '../../components/Layout/Layout';
import CompanySection from '@/components/CompanySection/CompanySection';
import { companies } from '@/constants/companies';
import PageBanner from '@/components/PageBanner/PageBanner';

const bannerInfos = {
  title: 'Experiência profissional',
  description: 'Aqui eu falo um pouquinho de empresas que já trabalhei e trabalhos que realizei. Também cito os alguns projetos realizados em cada experiência e projetos pessoais.',
  imageUrl: '/img/banners/experiencia_profissional.jpg',
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
    <>
      <PageBanner {...bannerInfos}/>
      <div className='w-[95%] md:w-[80%] mt-4 md:mt-6 pb-4 md:pb-6  flex flex-col justify-center items-center gap-5'>
        <RenderCompanies />
      </div>
    </>
  );
};

Experience.getLayout = function getLayout(page: ReactElement) {
  return <Layout pageName='Experiência profissional'>{page}</Layout>;
};

export default Experience;