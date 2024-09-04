import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../types/next'
import Layout from '../../components/Layout/Layout';
import SkillRating from '@/components/SkillRating/SkillRating';
import TechSection from '@/components/TechSection/TechSection';
import { devTechsData, devTechsOptions } from '@/constants/devTechsData';
import { calculateAge } from '@/utils/calculateAge';
import PageBanner from '@/components/PageBanner/PageBanner';
import BrandsSection from '@/components/BrandsSection/BrandsSection';
import { infraBrands } from '@/constants/infraBrands';

const bannerInfos = {
  title: 'Base de conhecimento',
  description: 'Bem-vindo à minha Base de Conhecimento! Nesta seção, compartilho tudo que aprendi ao longo da minha jornada como desenvolvedor e entusiasta de tecnologia. Aqui, você encontrará informações detalhadas sobre uma variedade de tópicos, incluindo linguagens de programação, conceitos de redes e as diversas tecnologias que já utilizei em meus projetos.',
  imageUrl: '/img/banners/base_de_conhecimento.jpg',
  bgColor: '#000000',
  textColor: '#F7CAC9',
  titleColor: '#E0F7FA',
  reverse: false,
}

const Knowledge: NextPageWithLayout = () => {
  return (
    <>
      <PageBanner {...bannerInfos}/>
      <div className='w-[95%] md:w-[80%] mt-4 pb-4 md:pb-6 flex flex-col justify-center items-center gap-5'>
        <h1 className='text-xl lg:text-2xl font-bold underline mb-5 text-center'>Desenvolvimento de software</h1>
        <section className='text-justify w-full text-xs lg:text-sm space-y-5 mb-8'>
          <p>
            Já fazem {calculateAge('2021-06-02')} anos que trabalho como programador. Prezo pela aplicação das melhores práticas de desenvolvimento,
            documentando o necessário e utilizando ferramentas que garantem que todos os membros da equipe estejam alinhados e possam contribuir efetivamente
          </p>
          <p>
            Minhas experiências variam desde pequenas equipes, onde a comunicação e a colaboração direta são cruciais, até grandes times
            multidisciplinares com funções bem definidas e processos mais estruturados.
          </p>
          <p>
            Já trabalhei em todo o ciclo de vida do software, desde o desenvolvimento e testes até a implantação e escalabilidade
            em ambientes de produção, testes de software e por ai vai.
          </p>
          <p>
            E como seu sei que números e informações práticas podem me ajudar a ter sua atenção, aqui vai uma forma intuitiva de mostrar algumas linguagens
            de programação que já usei:
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
        <h1 className='text-xl lg:text-2xl font-bold underline mb-5 mt-10 text-center'>Redes & Servidores</h1>
        <section className='text-justify w-full text-xs lg:text-sm space-y-5 mb-8'>
          <p>
            No início, eu comecei a aplicar o que aprendi na faculdade, principalmente em gerenciamento de redes. Acabei aumentando
            bastante a segurança do lugar onde trabalhava, configurando VLANs, colocando failover/load balance nos roteadores,
            ajustando os APs WiFi, configurando todos os switches. Além disso, eu também cuidava de
            tudo que um estagiário de TI faz, como mexer em impressoras, tanto no cabo quanto na rede.
          </p>
          <p>
            Com o tempo, fui me aprofundando e cheguei ao ponto de implementar o Active Directory. Também evoluí na parte de hospedagem
            e em técnicas de rede, como VPN. O que trouxe resultados que eu nem esperava, como colocar um call center inteiro em home office
            (VPN, redirecionamento de portas, AD...). Sempre fui de meter a mão na massa e enxergo que infraestrutura tem o papel de servir
            as pessoas e trabalhos.
          </p>
          <p>
            Quando trabalho com infraestrutura, sigo um pensamento estruturado, sempre focado em protocolos e padrões organizacionais.
            Desde tabelas ARP e pacotes HTTP até regras de roteamento e controle de permissões de usuários, cada detalhe é abordado com precisão.
          </p>
          <p className='underline'>
            Aqui vão alguns serviços que já prestei:
          </p>
          <ul className='flex flex-col w-full gap-2'>
            <li className='w-full text-center rounded-md p-2 border border-dotted border-black font-bold bg-black-to-light'>Planejamento de redes físicas</li>
            <li className='w-full text-center rounded-md p-2 border border-dotted border-black font-bold bg-black-to-light'>Análise de segurança de redes</li>
            <li className='w-full text-center rounded-md p-2 border border-dotted border-black font-bold bg-black-to-light'>Monitoramento de redes (desempenho)</li>
            <li className='w-full text-center rounded-md p-2 border border-dotted border-black font-bold bg-black-to-light'>Manutenção de máquinas</li>
            <li className='w-full text-center rounded-md p-2 border border-dotted border-black font-bold bg-black-to-light'>Controle e consultoria de processos de TI</li>
            <li className='w-full text-center rounded-md p-2 border border-dotted border-black font-bold bg-black-to-light'>Gestão de servidores</li>
            <li className='w-full text-center rounded-md p-2 border border-dotted border-black font-bold bg-black-to-light'>Suporte a eventos com infraestrutura temporária</li>
          </ul>
          <p className='underline'>
            E algumas marcas com que já trabalhei:
          </p>
          <BrandsSection brands={infraBrands}/>
        </section>
        <h1 className='text-xl lg:text-2xl font-bold underline mb-5 mt-10 text-center'>Tecnologias</h1>
        <section className='text-justify w-full text-xs lg:text-sm space-y-5 mb-8'>
          <p>
            Explore algumas ferramentas de que já utilizei ao longo da minha carreira. Cada uma delas
            contribuiu de forma significativa para o meu aprendizado e crescimento profissional. Você pode explorar e filtrar essas
            tecnologias por tópicos, conforme sua preferência. Além disso, ao clicar no card de uma ferramenta, você poderá ver uma
            breve descrição sobre ela. Sinta-se à vontade para descobrir como cada ferramenta pode ser útil em diferentes cenários.
          </p>
        </section>
        <TechSection data={devTechsData} options={devTechsOptions}/>
        <h1 className='text-xl lg:text-2xl font-bold underline mb-5 mt-10 text-center'>Serviços contratáveis</h1>
        <section className='text-justify w-full text-xs lg:text-sm space-y-5 mb-8'>
          <p>
            Finalmente, se você está buscando por um profissional capacitado para transformar suas ideias em realidade,
            confira os serviços que ofereço e vagas que posso preencher em sua empresa:
          </p>
          <ul className='flex flex-col w-full gap-2'>
            <li className='w-full text-center shadow-md rounded-md p-2 border border-dotted border-black font-bold bg-light-to-black text-white'>Desenvolvedor de software</li>
            <li className='w-full text-center shadow-md rounded-md p-2 border border-dotted border-black font-bold bg-light-to-black text-white'>Analista de redes</li>
            <li className='w-full text-center shadow-md rounded-md p-2 border border-dotted border-black font-bold bg-light-to-black text-white'>Analista de TI</li>
            <li className='w-full text-center shadow-md rounded-md p-2 border border-dotted border-black font-bold bg-light-to-black text-white'>Suporte de TI a eventos</li>
          </ul>
        </section>
      </div>
    </>
  );
};

Knowledge.getLayout = function getLayout(page: ReactElement) {
  return <Layout pageName='Base de conhecimento'>{page}</Layout>;
};

export default Knowledge;