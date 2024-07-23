const ProfileHeader = () => {
  return (
    <div className='relative w-full flex flex-col mt-[1%] mb-[10%]'>
      <img
        src="https://placehold.co/415x100?text=Hello+3"
        alt=""
        className='w-full'
      />
      <img
        src="/img/profile.png"
        alt=""
        className='absolute rounded-full aspect-square right-[36.5%] lg:right-[15%] bottom-[-60%] lg:bottom-[-40%] w-[25%] lg:w-[20%] border-4 border-white'
      />
    </div>
  );
}

export default ProfileHeader;