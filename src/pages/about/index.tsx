import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../types/next.d'
import Layout from '../../components/Layout/Layout';
import ImageFadeShow from '../../components/ImageFadeShow/ImageFadeShow';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { calculateAge } from '@/utils/calculateAge';
import PageBanner from '@/components/PageBanner/PageBanner';

const bannerInfos = {
  title: 'Sobre mim',
  description: `Me chamo Felipi, tenho ${calculateAge('1999-02-04')} anos e nasci em Formiga-MG (mineiro uai 🤠). Sou do tipo de pessoa que valoriza sonhos e paixões. Não me importa tanto o que você faz para ganhar a vida; estou mais interessado em saber o que realmente deseja e se tem a coragem de seguir seus verdadeiros anseios (e isso também vale pra mim). Mas não se engane, posso parecer uma pessoa emotiva, mas sempre valorizei o pensamento lógico e focado. `,
  imageUrl: '/img/profile.png',
  bgColor: '#000000',
  textColor: '#F7CAC9',
  titleColor: '#E0F7FA',
  reverse: false,
}

const About: NextPageWithLayout = () => {
  return (
    <>
      <PageBanner {...bannerInfos}/>
      <div className='w-[95%] md:w-[80%] mt-4 pb-4 md:pb-6 flex flex-col justify-center items-center gap-10'>
        <h1 className='text-xl lg:text-2xl font-bold underline mb-5 text-center'>Meus Hobbies</h1>
        <div className='w-full flex flex-col items-center md:flex-row-reverse md:justify-around'>
          <div className='flex flex-col md:max-w-[50%] justify-center items-center text-xs md:text-base lg:text-lg'>
            <h1 className='text-xl lg:text-xl font-bold underline mb-5 text-center'>Música</h1>
            <p className='text-justify w-full text-xs lg:text-sm space-y-5 mb-8'>
              Sou apaixonado por música e ela está sempre comigo, seja enquanto trabalho, estudo ou relaxo. Toco violão,
              guitarra, bateria e violino, a raiz disso foi ter participado do grupo de louvor da igreja, uma experiência
              que gera saudades até hoje. Adoro tocar e cantar com amigos, criando momentos inesquecíveis ao som das nossas músicas favoritas.
            </p>
          </div>
          <ImageFadeShow 
            images={[
              {
                src: '/img/hobbies/music/hobby-music-1.jpg'
              },
              {
                src: '/img/hobbies/music/hobby-music-2.jpg'
              },
              {
                src: '/img/hobbies/music/hobby-music-3.jpg'
              },
              {
                src: '/img/hobbies/music/hobby-music-4.jpg'
              },
            ]}
          />
        </div>
        <div className='w-full flex flex-col items-center md:flex-row md:justify-around'>
          <div className='flex flex-col md:max-w-[50%] justify-center items-center text-xs md:text-base lg:text-lg'>
            <h1 className='text-xl lg:text-xl font-bold underline mb-5 text-center'>Viagens</h1>
            <p className='text-justify w-full text-xs lg:text-sm space-y-5 mb-8'>
              Viajar é a melhor forma de descansar e renovar as energias. Adoro explorar novos lugares, seja perto ou longe. A companhia pode
              variar: amigos próximos, novas amizades ou até mesmo sozinho. Cada viagem é uma oportunidade de criar memórias incríveis,
              descobrir novas culturas e apreciar a beleza do mundo.
            </p>
          </div>
          <ImageFadeShow 
            images={[
              {
                src: '/img/hobbies/travels/travel-fl-1.jpg'
              },
              {
                src: '/img/hobbies/travels/travel-fl-2.jpg'
              },
              {
                src: '/img/hobbies/travels/travel-fl-3.jpg'
              },
              {
                src: '/img/hobbies/travels/travel-jf-1.jpg'
              },
              {
                src: '/img/hobbies/travels/travel-jf-2.jpg'
              },
              {
                src: '/img/hobbies/travels/travel-tr-1.jpg'
              },
              {
                src: '/img/hobbies/travels/travel-ub-1.jpg'
              },
            ]}
          />
        </div>
        <div className='w-full flex flex-col items-center md:flex-row-reverse md:justify-around'>
          <div className='flex flex-col md:max-w-[50%] justify-center items-center text-xs md:text-base lg:text-lg'>
            <h1 className='text-xl lg:text-xl font-bold underline mb-5 text-center'>Jogos</h1>
            <p className='text-justify w-full text-xs lg:text-sm space-y-5 mb-8'>
              Jogos são minha maneira favorita de relaxar e me divertir. Seja explorando mundos incríveis em Skyrim,
              enfrentando desafios emocionantes em Batman: Arkham Knight, ou mergulhando em aventuras mágicas em Kingdom Hearts,
              sempre encontro uma forma de me desligar e relaxar. Também adoro jogar com amigos, compartilhando risadas
              e estratégias enquanto nos divertimos juntos.
            </p>
          </div>
          <ImageFadeShow 
            images={[
              {
                src: '/img/hobbies/games/batman.jpeg'
              },
              {
                src: '/img/hobbies/games/kdh.jpeg'
              },
              {
                src: '/img/hobbies/games/skyrim.gif'
              },
            ]}
          />
        </div>
        <h1 className='text-xl lg:text-2xl font-bold underline text-center'>Highlights</h1>
        <p className='text-justify w-full text-xs lg:text-sm space-y-5 mb-8'>
          Aqui fica um resumo em imagens dos momentos mais importantes que registrei até hoje:
        </p>
        <Carousel
          autoPlay
          showThumbs={false}
          infiniteLoop={true}
          className='min-w-[310px] md:min-w-[500px]'
          showIndicators={false}
        >
          <div className='h-[20vh] md:h-[400px] flex justify-center items-center'>
            <div className='w-full h-full bg-contain bg-center bg-no-repeat md:bg-repeat'
              style={{
                backgroundImage: 'url(/img/hobbies/highlights/highlight1.jpg)',
              }}
            />
            <p 
              className="legend"
              style={{
                bottom: 0,
              }}
            >
              A compra do primeiro veículo
            </p>
          </div>
          <div className='h-[20vh] md:h-[400px] flex justify-center items-center'>
            <div className='w-full h-full bg-contain bg-center bg-no-repeat md:bg-repeat'
              style={{
                backgroundImage: 'url(/img/hobbies/highlights/highlight2.jpg)',
              }}
            />
            <p 
              className="legend"
              style={{
                bottom: 0,
              }}
            >
              A conquista de entrar na faculdade
            </p>
          </div>
          <div className='h-[20vh] md:h-[400px] flex justify-center items-center'>
            <div className='w-full h-full bg-contain bg-center bg-no-repeat md:bg-repeat'
              style={{
                backgroundImage: 'url(/img/hobbies/highlights/highlight3.jpg)',
              }}
            />
            <p 
              className="legend"
              style={{
                bottom: 0,
              }}
            >
              Primeira promoção
            </p>
          </div>
          <div className='h-[20vh] md:h-[400px] flex justify-center items-center'>
            <div className='w-full h-full bg-contain bg-center bg-no-repeat md:bg-repeat'
              style={{
                backgroundImage: 'url(/img/hobbies/highlights/highlight4.jpg)',
              }}
            />
            <p 
              className="legend"
              style={{
                bottom: 0,
              }}
            >
              A melhor viagem (Florianópolis)
            </p>
          </div>
        </Carousel>
      </div>
    </>
  );
};

About.getLayout = function getLayout(page: ReactElement) {
  return <Layout pageName='Sobre mim'>{page}</Layout>;
};

export default About;