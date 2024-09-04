import { ReactElement, useEffect } from 'react';
import { NextPageWithLayout } from '../../types/next'
import Layout from '../../components/Layout/Layout';
import ContactCard from '@/components/ContactCard/ContactCard';

const Contact: NextPageWithLayout = () => {
  useEffect(() => {
    const allCards = document.querySelectorAll('.contact-card');
    const maxWidth = Math.max(...Array.from(allCards).map(card => card.clientWidth));
    allCards.forEach(card => {
      (card as HTMLElement).style.width = `${maxWidth}px`;
    });
  }, []);

  return (
    <div className='w-[80%] flex flex-col justify-around min-h-[60vh]'>
      <div>
        <h1 className='text-xl lg:text-2xl font-bold underline mb-5 mt-10 text-center'>Contato</h1>
        <p className='text-center mb-10'>
          Sinta-se a vontade para me contatar por qualquer um desses meios:
        </p>
      </div>
      <div className='w-full flex flex-wrap gap-5 items-center justify-center lg:justify-center mb-10'>
        <ContactCard href='https://www.linkedin.com/in/felipi-trindade-365a34143/' imgUrl='/img/contact/linkedin.png' title='Linkedin' contactString='Ver pefil'/>
        <ContactCard href='https://github.com/Festevao' imgUrl='/img/contact/github.png' title='Github' contactString='Ver pefil'/>
        <ContactCard href='https://www.instagram.com/felipeestevaofm' imgUrl='/img/contact/instagram.png' title='Instagram' contactString='Ver pefil'/>
        <ContactCard href='https:wa.me/5532984680116' imgUrl='/img/contact/whatsapp.webp' title='Whatsapp' contactString='Enviar mensagem'/>
        <ContactCard href='mailto:cadefm@hotmail.com' imgUrl='/img/contact/email.webp' title='cadefm@hotmail.com' contactString='Eviar e-mail'/>
        <ContactCard href='tel:+5532984680116' imgUrl='/img/contact/telefone.webp' title='Telefone' contactString='Ligar'/>
      </div>
    </div>
  );
};

Contact.getLayout = function getLayout(page: ReactElement) {
  return <Layout pageName='Contato'>{page}</Layout>;
};

export default Contact;