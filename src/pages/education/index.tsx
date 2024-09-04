import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../types/next'
import Layout from '../../components/Layout/Layout';
import PageBanner from '@/components/PageBanner/PageBanner';
import EducationCard from '@/components/EducationCard/EducationCard';
import SkillRating from '@/components/SkillRating/SkillRating';

const bannerInfos = {
  title: 'Formação',
  description: 'Um panorama das minhas formações, cursos, certificações e competências linguísticas.',
  imageUrl: '/img/banners/formacao.jpg',
  bgColor: '#000000',
  textColor: '#F7CAC9',
  titleColor: '#E0F7FA',
  reverse: false,
}

const Education: NextPageWithLayout = () => {
  return (
    <>
      <PageBanner {...bannerInfos}/>
      <div className='w-[95%] md:w-[80%] mt-4 pb-4 md:pb-6  flex flex-col justify-center items-center gap-5'>
        <h1 className='text-xl lg:text-2xl font-bold underline mb-5 text-center'>Faculdade</h1>
        <EducationCard title='Universidade Federal de São João Del Rei' subTitle='Ciência da computação - Bacharelado' imgUrl='/img/education/ufsj.png' description='Iniciei meu estudos em Agosto de 2017, logo após formar o ensino médio. Acabei interrompendo meus estudos na instituição durante a pandemia em março de 2020.'/>
        <EducationCard title='Centro universitário Newton Paiva' subTitle='Ciência da computação - Bacharelado' imgUrl='/img/education/newton.jpeg' description='Ainda ansioso pela formação na área, retomei os estudos após me estabilizar na universidade Newton Paiva, iniciando em agosto de 2023 e com previsão de formação em dezembro de 2025.'/>
        <h1 className='text-xl lg:text-2xl font-bold underline mb-5 text-center'>Cursos</h1>
        <EducationCard
          title='Udemy'
          subTitle='Curso de JavaScript e TypeScript do básico ao avançado JS/TS'
          imgUrl='/img/education/curso1.jpg'
          description='Duração de 146 horas, abordando um conteúdo abrangente sobre Javascript/Typescript, NodeJS, ReactJS, Design Patterns, S.O.L.I.D e outros frameworks relacionados à Javascript. É um curso muito completo e me preparou muito bem para trabalhar com a linguagem.'
          subTitleHref='https://www.udemy.com/course/curso-de-javascript-moderno-do-basico-ao-avancado'
        />
        <EducationCard
          title='Udemy'
          subTitle='Go (Golang): Explorando a Linguagem do Google'
          imgUrl='/img/education/curso2.jpg'
          description='Duração de 11,5 horas, abordando um conteúdo básico sobre a linguagem GO. Explora os conceitos da linguagem, tipos e estruturas de dados, concorrência e testes. É um bom conteúdo pra quem quer começar a aprender a linguagem.'
          subTitleHref='https://www.udemy.com/course/curso-go'
        />
        <EducationCard
          title='Udemy'
          subTitle='NestJS Fundamentos'
          imgUrl='/img/education/curso3.jpg'
          description='Duração de 15 horas, abordando um conteúdo intermediário sobre um dos melhores frameworks para a produção de REST APIs com Javascript/Typescript. Fala sobre os conceitos do framwork, integrações com bancos de dados, DTOs e testes com o framework. É um ótimo conteúdo que agrega muito na produção de APIs usando NodeJS.'
          subTitleHref='https://www.udemy.com/course/curso-nest-js'
        />
        <EducationCard
          title='Udemy'
          subTitle='Next.js e React - Curso Completo - Aprenda com Projetos'
          imgUrl='/img/education/curso4.jpg'
          description='Duração de 28,5 horas, abordando um conteúdo intermediário sobre um dos frameworks mais famosos para produção de frontend em Javascript/Typescript. É um curso repleto de projetos que exemplificam os conceitos de Next e React, entrando em tópicos como SSR, pré renderização, autenticação. É um conteudo limpo e completo.'
          subTitleHref='https://www.udemy.com/course/nextjs-e-react'
        />
        <EducationCard
          title='Udemy'
          subTitle='Web Scraping in Nodejs & JavaScript'
          imgUrl='/img/education/curso5.jpg'
          description='Duração de 11,5 horas, abordando um conteúdo sobre Web Scraping (extração de dados de sites) em Javascript. É um curso bem completo sobre o assunto e passa insights importanticimos como descobrir APIs dos sites, DOM e seletores, Graphql, tokens de autenticação. É um curso detalhado sobre o assunto e realmente cumpre o ensinamento com qualidade.'
          subTitleHref='https://www.udemy.com/course/web-scraping-in-nodejs'
        />
        <EducationCard
          title='Escola de linguas Helena Kemper (Formiga-MG)'
          subTitle='Curso de inglês'
          imgUrl='/img/education/curso0.jpg'
          description='Curso de inglês realizado no mesmo período do meu ensino médio.'
        />
        <h1 className='text-xl lg:text-2xl font-bold underline mb-5 text-center'>Linguagens</h1>
        <div className='w-full grid grid-cols-2'>
          <SkillRating
            logoUrl='/img/education/lenguage1.png'
            rate={5}
            name='Português BR'
            showRateText
            lenguageRate
          />
          <SkillRating
            logoUrl='/img/education/lenguage2.png'
            rate={3}
            name='Inglês'
            showRateText
            lenguageRate
          />
        </div>
      </div>
    </> 
  );
};

Education.getLayout = function getLayout(page: ReactElement) {
  return <Layout pageName='Base de conhecimento'>{page}</Layout>;
};

export default Education;