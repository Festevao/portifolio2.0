import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../types/next'
import Layout from '../../components/Layout/Layout';
import ProfileHeader from '../../components/ProfileHeader/ProfileHeader';
import ImageFadeShow from '../../components/ImageFadeShow/ImageFadeShow';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

const About: NextPageWithLayout = () => {
  const calculateAge = (birthDateStr: string) => {
    const birthDate = new Date(birthDateStr);
    const today = new Date();
  
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
  
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    return age;
  }

  return (
    <div className='flex flex-col w-[80%] h-full items-center justify-start mb-[5vh]'>
      <ProfileHeader />
      <h1 className='text-3xl lg:text-5xl font-bold underline mb-16 mt-10'>Sobre mim</h1>
      <section className='text-justify w-full lg:text-xl space-y-5'>
        <p>
          Me chamo Felipi, tenho {calculateAge('1999-02-04')} anos e nasci em Formiga-MG (mineiro uai 🤠).
        </p>
        <p>
          Sou do tipo de pessoa que valoriza sonhos e paixões. Não me importa tanto o que você faz para ganhar a vida;
          estou mais interessado em saber o que realmente deseja e se tem a coragem de seguir seus verdadeiros anseios
          (e isso também vale pra mim). Mas não se engane, posso parecer uma pessoa emotiva, mas sempre valorizei o
          pensamento lógico e focado. 
        </p>
        <p>
          Prezo pelas amizades que conquisto e acredito que a forma com que cultivamos nossas relações contribuí diretamente
          para a formação de quem somos.
        </p>
      </section>
      <h1 className='text-3xl lg:text-5xl font-bold underline mb-16 mt-20'>Meus Hobbies</h1>
      <div className='w-full lg:text-xl grid grid-cols-2'>
        <div className='flex flex-row justify-center items-center md:p-6'>
          <ImageFadeShow 
            images={[
              {
                src: '/img/hobby-music-1.jpg'
              },
              {
                src: '/img/hobby-music-2.jpg'
              },
              {
                src: '/img/hobby-music-3.jpg'
              },
              {
                src: '/img/hobby-music-4.jpg'
              },
            ]}
          />
        </div>
        <div className='flex flex-col justify-center items-center text-xs md:text-base lg:text-lg'>
          <h1 className='text-2xl lg:text-4xl font-bold'>Música</h1>
          <p className='p-6 text-justify'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eget ligula eu lectus lobortis condimentum. Aliquam nonummy auctor massa. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla at risus. Quisque purus magna, auctor et, sagittis ac, posuere eu, lectus. Nam mattis, felis ut adipiscing.
          </p>
        </div>
        <div className='flex flex-col justify-center items-center text-xs md:text-base lg:text-lg'>
          <h1 className='text-2xl lg:text-4xl font-bold'>Viagens</h1>
          <p className='p-6 text-justify'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eget ligula eu lectus lobortis condimentum. Aliquam nonummy auctor massa. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla at risus. Quisque purus magna, auctor et, sagittis ac, posuere eu, lectus. Nam mattis, felis ut adipiscing.
          </p>
        </div>
        <div className='flex flex-row justify-center items-center md:p-6'>
        <ImageFadeShow 
            images={[
              {
                src: 'https://placehold.co/50x50?text=1'
              },
              {
                src: 'https://placehold.co/50x50?text=2'
              },
              {
                src: 'https://placehold.co/50x50?text=3'
              },
              {
                src: 'https://placehold.co/50x50?text=4'
              },
            ]}
          />
        </div>
        <div className='flex flex-row justify-center items-center md:p-6'>
        <ImageFadeShow 
            images={[
              {
                src: 'https://placehold.co/50x50?text=1'
              },
              {
                src: 'https://placehold.co/50x50?text=2'
              },
              {
                src: 'https://placehold.co/50x50?text=3'
              },
              {
                src: 'https://placehold.co/50x50?text=4'
              },
            ]}
          />
        </div>
        <div className='flex flex-col justify-center items-center text-xs md:text-base lg:text-lg'>
          <h1 className='text-2xl lg:text-4xl font-bold'>Jogos</h1>
          <p className='p-6 text-justify'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eget ligula eu lectus lobortis condimentum. Aliquam nonummy auctor massa. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla at risus. Quisque purus magna, auctor et, sagittis ac, posuere eu, lectus. Nam mattis, felis ut adipiscing.
          </p>
        </div>
      </div>
      <h1 className='text-3xl lg:text-5xl font-bold underline mb-16 mt-20'>Highlights</h1>
      <p className='text-justify w-full lg:text-xl mb-6'>
        Aqui fica um resumo em imagens dos momentos mais importantes que registrei até hoje:
      </p>
      <Carousel
        autoPlay
        showThumbs={false}
        infiniteLoop={true}
        className='w-full'
      >
        <div className='min-h-[20vh] h-full w-full flex justify-center items-center'>
          <img src="https://placehold.co/415x100?text=Hello+3" />
          <p className="legend">Legend 1</p>
        </div>
        <div className='min-h-[20vh] h-full w-full flex justify-center items-center'>
          <img src="https://placehold.co/415x100?text=Hello+3" />
          <p className="legend">Legend 2</p>
        </div>
        <div className='min-h-[20vh] h-full w-full flex justify-center items-center'>
          <img src="https://placehold.co/415x100?text=Hello+3" />
          <p className="legend">Legend 3</p>
        </div>
      </Carousel>
    </div>
  );
};

About.getLayout = function getLayout(page: ReactElement) {
  return <Layout pageName='Sobre mim'>{page}</Layout>;
};

export default About;