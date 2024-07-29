import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../types/next'
import Layout from '../../components/Layout/Layout';
import SkillRating from '@/components/SkillRating/SkillRating';

const Knowledge: NextPageWithLayout = () => {
  return (
    <div className='w-[95%] lg:w-[80%] h-full flex flex-col justify-start items-center'>
      <h1 className='text-2xl lg:text-4xl font-bold underline mb-5 mt-10 text-center'>Base de conhecimento</h1>
      <section className='text-justify w-full lg:text-xl space-y-5'>
        <p>
          Bem-vindo à minha Base de Conhecimento! Nesta seção, compartilho tudo que aprendi ao longo da minha
          jornada como desenvolvedor e entusiasta de tecnologia. Aqui, você encontrará informações detalhadas
          sobre uma variedade de tópicos, incluindo linguagens de programação, conceitos de redes e as diversas
          tecnologias que já utilizei em meus projetos.
        </p>
      </section>
      <h1 className='text-2xl lg:text-4xl font-bold underline mb-5 mt-10 text-center'>Linguagens de programação</h1>
      <section className='text-justify w-full lg:text-xl space-y-5 mb-8'>
        <p>
          Nesta seção, apresento meu nível de conhecimento nas diversas linguagens de programação com as quais já
          trabalhei. Cada uma é exibida junto a uma classificação intuitiva que reflete minha experiência e proficiência.
          Essa classificação é baseada em projetos realizados, desafios enfrentados e o tempo dedicado ao aprimoramento
          dessas habilidades. Explore para conhecer mais sobre meu domínio em cada tecnologia.
        </p>
      </section>
      <div className='w-full grid grid-cols-2'>
        <SkillRating 
          logoUrl='/img/programming languages/javascript.png'
          rate={4}
          name='JavaScript'
          showRateText
        />
        <SkillRating 
          logoUrl='/img/programming languages/typescript.png'
          rate={4}
          name='TypeScript'
          showRateText
        />
        <SkillRating 
          logoUrl='/img/programming languages/c.png'
          rate={3}
          name='C'
          showRateText
        />
        <SkillRating 
          logoUrl='/img/programming languages/python.webp'
          rate={2}
          name='Python'
          showRateText
        />
        <SkillRating 
          logoUrl='/img/programming languages/golang.jpg'
          rate={2}
          name='Golang'
          showRateText
        />
        <SkillRating 
          logoUrl='/img/programming languages/java.png'
          rate={1}
          name='Java'
          showRateText
        />
        <SkillRating 
          logoUrl='/img/programming languages/php.png'
          rate={1}
          name='Php'
          showRateText
        />
      </div>
      <h1 className='text-2xl lg:text-4xl font-bold underline mb-5 mt-10 text-center'>Tecnologias (Desenvolvimento)</h1>
      <section className='text-justify w-full lg:text-xl space-y-5 mb-8'>
        <p>
          Explore minha expertise em várias tecnologias de desenvolvimento. Aqui, detalho as ferramentas e frameworks que
          utilizo para criar soluções inovadoras e eficientes, destacando minhas habilidades e experiências práticas.
        </p>
      </section>
      <h1 className='text-2xl lg:text-4xl font-bold underline mb-5 mt-10 text-center'>Redes & Servidores</h1>
      <section className='text-justify w-full lg:text-xl space-y-5 mb-8'>
        <p>
          Descubra meu conhecimento em redes e servidores. Nesta seção, compartilho minha experiência na configuração, manutenção
          e otimização de infraestruturas de rede e servidores, essenciais para garantir desempenho e segurança.
        </p>
      </section>
      <h1 className='text-2xl lg:text-4xl font-bold underline mb-5 mt-10 text-center'>Tecnologias (Redes & Servidores)</h1>
      <section className='text-justify w-full lg:text-xl space-y-5 mb-8'>
        <p>
          Aprofunde-se no meu domínio das tecnologias de redes e servidores. Aqui, apresento as ferramentas e sistemas que utilizo
          para gerenciar e proteger ambientes de TI complexos, mostrando meu comprometimento com a excelência e a segurança digital.
        </p>
      </section>
      <h1 className='text-2xl lg:text-4xl font-bold underline mb-5 mt-10 text-center'>Serviços contratáveis</h1>
      <section className='text-justify w-full lg:text-xl space-y-5 mb-8'>
        <p>
          Finalmente, se você está buscando por um profissional capacitado para transformar suas ideias em realidade,
          confira os serviços que ofereço. Seja para desenvolvimento de software, consultoria em redes ou implementação
          de novas tecnologias, estou à disposição para colaborar em projetos desafiadores e inovadores.
        </p>
      </section>
    </div>
  );
};

Knowledge.getLayout = function getLayout(page: ReactElement) {
  return <Layout pageName='Base de conhecimento'>{page}</Layout>;
};

export default Knowledge;