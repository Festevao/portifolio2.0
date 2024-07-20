const Footer = () => {
  const atualYear = (new Date()).getFullYear();
  return (
    <footer
      className={`\
        \ footer absolute bottom-0 flex flex-col justify-between items-center w-full bg-black min-h-[155px] min-w-[250px] text-white
      `}
      style={{
        backgroundColor: '#000000',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='409' height='49.1' viewBox='0 0 1000 120'%3E%3Cg fill='none' stroke='%23222' stroke-width='6.7' %3E%3Cpath d='M-500 75c0 0 125-30 250-30S0 75 0 75s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 45c0 0 125-30 250-30S0 45 0 45s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 105c0 0 125-30 250-30S0 105 0 105s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 15c0 0 125-30 250-30S0 15 0 15s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500-15c0 0 125-30 250-30S0-15 0-15s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 135c0 0 125-30 250-30S0 135 0 135s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3C/g%3E%3C/svg%3E")`
      }}
    >
      <div className='relative w-full lg:w-[80%] h-full flex flex-col lg:grid lg:grid-cols-2'>
        <div className='h-full flex flex-col justify-center pt-2 px-8 lg:pt-8 items-center'>
          <p>Festevão</p>
          <p>ForAllz</p>
        </div>
        <div className='h-full flex flex-col justify-center lg:pt-8 px-8 items-center'>
          <p>cadefm@hotmail.com</p>
          <p>(32)98468-0116</p>
        </div>
      </div>
      <div className='h-full w-full flex flex-col justify-center items-center'>
        <span className='text-lg pb-1 text-center'>
          © <></>
          <span className='text-xs'>
            {atualYear} - All Rights Reserved. Designed and Developed by Felipi Trindade
          </span>
        </span>
      </div>
    </footer>
  )
}

export default Footer;