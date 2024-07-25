import React, { useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { RxCross2 } from 'react-icons/rx';
import { Link } from 'react-router-dom';

const DashSidebar = () => {
  const [sideBar, setSideBar] = useState(false);

  const handleSidebar = () => {
    setSideBar(!sideBar);
  };

  return (
    <div className="">
       <div className=''>
      {sideBar ? (
       
        <RxCross2 onClick={handleSidebar} className=" md:hidden cursor-pointer absolute top-40 left-40 z-50 text-2xl" />
      ) : (
        <GiHamburgerMenu onClick={handleSidebar} className=" md:hidden cursor-pointer  text-3xl" />

      )
      }
</div>
      <div className={`fixed top-36 left-0 h-full bg-orange-300 shadow-2xl rounded-md
        transition-transform transform ${sideBar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:flex md:flex-col md:justify-start md:items-center md:min-h-screen`}
      >  
    
      <nav className='flex flex-col mt-12'>
     
        <Link to={'/dashboard?tab=user'} onClick={handleSidebar} className='p-4 w-48 font-bold text-[18px]'>Dashboard</Link>
        <Link to={'/dashboard?tab=post'} onClick={handleSidebar}className='p-4 w-48 font-bold text-[18px]'>Create Post</Link>
        <Link to={'/dashboard?tab=dashpost'} onClick={handleSidebar}className='p-4 w-48 font-bold text-[18px]'>Posts</Link>
        <Link to={'/dashboard?tab=dashuser'} onClick={handleSidebar}className='p-4 w-48 font-bold text-[18px]'>Users</Link>
        <Link to={'/dashboard?tab=comments'} onClick={handleSidebar}className='p-4 w-48 font-bold text-[18px]'>Comments</Link>
        </nav>
      </div>
    </div>
  );
}

export default DashSidebar;
