import React from 'react';

interface Props {
  companyName: string;
  jobs: string[];
  jobsDescription: string;
  description: string;
  imgUrl: string;
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
          - {job}
        </li>
      );
    });
  };

  return (
    <div className='w-full flex flex-col shadow-lg items-center justify-center p-5 rounded-lg gap-5'>
      <h1 className='text-lg underline font-bold'>{companyName}</h1>
      <span>{description}</span>
      <div className='w-full flex flex-row justify-center items-start'>
        <img className='w-[40%]' src={imgUrl} alt={companyName}/>
        <div className='flex flex-col w-full gap-3 mt-10'>
          <span>Cargo: <span className='underline'>{jobsDescription}</span></span>
          <hr className='w-full'/>
          <ul>
            {RenderJobs()}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CompanySection;