const ProfileHeader = () => {
  return (
    <div className='relative w-full flex flex-col mt-[1%] mb-[10%]'>
      <img
        src="https://placehold.co/415x100?text=Hello+3"
        alt=""
        className='w-full'
      />
      <img
        src="https://placehold.co/50x50?text=Hello+3"
        alt=""
        className='absolute rounded-full right-[15%] bottom-[-40%] w-[20%] border-4 border-white'
      />
    </div>
  );
}

export default ProfileHeader;