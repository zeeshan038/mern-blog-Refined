import React, { useEffect, useState } from 'react';
import DashSidebar from './DashSidebar';
import { useLocation } from 'react-router';
import CreatePost from './CreatePost';
import DashPosts from './DashPosts';
import UpdatePage from './UpdatePage';
import DashUser from './DashUser';
import UserDash from './UserDash';
import { FaComment } from 'react-icons/fa';
import Comments from './Comments';

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className='flex min-h-screen'>
      {/* Sidebar */}
      <div className='w-62'>
        <DashSidebar />
      </div>
      {/* Main Content */}
      <div className='flex flex-grow p-4'>
        {tab=== 'user' && <UserDash/>}
        {tab === 'post' && <CreatePost />}
        {tab === 'dashpost' && <DashPosts />}
        {tab === 'dashuser' && <DashUser/>}
        {tab === 'comments' && <Comments/>}
       
      </div>
    </div>
  );
};

export default Dashboard;
