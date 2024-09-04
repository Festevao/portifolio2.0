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
      <div className='flex flex-col justify-center items-center h-full w-full min-h-[70vh]'>
        <p>Ainda não existem publicações...</p>
      </div>
    </>
  );
};

Blog.getLayout = function getLayout(page: ReactElement) {
  return <Layout pageName='Blog Pessoal'>{page}</Layout>;
};

export default Blog;