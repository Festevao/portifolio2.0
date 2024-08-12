import React from 'react';

interface Project {
  imgUrl: string;
  name: string;
  description: string;
}

interface Props {
  companyName: string;
  jobs: string[];
  jobsDescription: string;
  description: string;
  imgUrl: string;
  projects?: Project[];
}

const CompanySection: React.FC<Props> = ({
  companyName,
  jobs,
  jobsDescription,
  description,
  imgUrl,
}) => {
  const RenderJobs = () => {
    return jobs.map((job) => {
      return (
        <li key={`${companyName}-job-${job}`}>
          - {job}.
        </li>
      );
    });
  };

  return (
    <div className='w-full flex flex-col text-xs md:text-base shadow-lg items-center justify-center p-5 rounded-lg gap-5 border border-gray-200'>
      <h1 className='text-lg underline font-bold text-center'>{companyName}</h1>
      <div className='flex justify-center items-center w-[80%] sm:hidden'>
        <img className='w-full rounded-3xl shadow-lg' src={imgUrl} alt={companyName}/>
      </div>
      <span className='text-center'>{description}.</span>
      <div className='w-full flex flex-row justify-center items-start flex-wrap sm:flex-nowrap'>
        <div className='hidden justify-center items-center max-w-[20%] w-full min-h-[142px] min-w-[142px] sm:flex'>
          <img className='w-full rounded-3xl shadow-lg' src={imgUrl} alt={companyName}/>
        </div>
        <div className='h-full w-[20px] hidden sm:block'/>
        <div className='flex flex-col justify-start w-full gap-3 sm:mt-10'>
          <span><span className='underline font-bold'>Cargo:</span> <span>{jobsDescription}</span></span>
          <hr className='w-full'/>
          <ul>
            <li>Atividades exercidas:</li>
            <li> </li>
            {RenderJobs()}
          </ul>
        </div>
      </div>
      <hr className='w-full'/>
      <h1 className='text-lg underline font-bold text-center'>Projetos</h1>
    </div>
  );
}

export default CompanySection;