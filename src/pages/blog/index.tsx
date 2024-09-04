import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../types/next'
import Layout from '../../components/Layout/Layout';
import PageBanner from '@/components/PageBanner/PageBanner';

const bannerInfos = {
  title: 'Blog',
  description: 'Nesta seção, compartilho minhas reflexões sobre as rápidas mudanças e inovações que moldam o mundo da tecnologia. Desde tendências emergentes até debates éticos, ofereço minha visão sobre os desafios e oportunidades que surgem nesse campo. Espero que goste :D.',
  imageUrl: '/img/banners/blog.jpg',
  bgColor: '#000000',
  textColor: '#F7CAC9',
  titleColor: '#E0F7FA',
  reverse: true,
}

const Blog: NextPageWithLayout = () => {
  return (
    <>
      <PageBanner {...bannerInfos}/>
      <div className='w-[95%] md:w-[80%] mt-4 pb-4 md:pb-6 flex flex-col justify-center items-center gap-5'>
        <h1 className='text-xl lg:text-2xl font-bold underline mb-5 text-center'>Postagens</h1>
        <p>Ainda não existem publicações...</p>
      </div>
    </>
  );
};

Blog.getLayout = function getLayout(page: ReactElement) {
  return <Layout pageName='Blog Pessoal'>{page}</Layout>;
};

export default Blog;