import React, { useState } from 'react';

interface Project {
  imgUrl?: string;
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
  projects
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const RenderJobs = () => {
    return jobs.map((job) => {
      return (
        <li key={`${companyName}-job-${job}`}>
          - {job}.
        </li>
      );
    });
  };

  const RenderProjects = () => {
    if (!projects) return null; 
    return projects.map(({ description, imgUrl, name }, index) => {
      return (
        <div className='w-full h-full flex justify-center items-center' key={`${companyName}-job-${index}`}>
          <div className='flex flex-col text-[0.7rem] md:text-base justify-start p-2 m-2 items-center w-[90%] border border-gray-400 rounded-lg'>
            <h1 className='font-bold underline decoration-dotted'>{name}</h1>
            <div className='flex flex-row justify-center items-center gap-3'>
              <img
                src={imgUrl ?? '/img/no-image.jpg'}
                alt='project-pic'
                className='w-[50px] h-[50px] md:w-[100px] md:h-[100px] rounded-lg'
              />
              <span className='text-[0.5rem] md:text-sm'>{description}</span>
            </div>
          </div>
        </div>
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
      {Array.isArray(projects) && projects.length > 0 && (
        <>
          <hr className='w-full'/>
          <h1 className='text-lg underline font-bold text-center'>Projetos</h1>
          <div
            className={`transition-all duration-1000 overflow-hidden ${
              isExpanded ? 'max-h-full' : 'max-h-[70px] blur-sm'
            }`}
          >
            <div className='flex flex-col flex-wrap md:grid md:grid-cols-2'>
              {RenderProjects()}
            </div>
          </div>
          {!isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className='px-4 py-2 bg-[#222222] text-white rounded-lg'
            >
              Expandir
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default CompanySection;