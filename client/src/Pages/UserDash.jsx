import React, { useEffect, useState } from 'react';
import { FaArrowUp } from "react-icons/fa";
import { HiOutlineUserGroup, HiAnnotation } from "react-icons/hi";
import { Link } from 'react-router-dom';
import { FaComment } from 'react-icons/fa';

const UserDash = () => {
  const [user, setUser] = useState([]);
  const [totalUser, setTotalUser] = useState(0);
  const [lastMonthUser, setLastMonthUser] = useState(0);
  const [post, setPost] = useState([]);
  const [totalPost, setTotalPost] = useState(0);
  const [lastMonthPost, setLastMonthPost] = useState(0);
  const [comment, setComment] = useState([]);
  const [totalComment, setTotalComment] = useState(0);
  const [lastMonthComment, setLastMonthComment] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`/api/v1/user/getuser?limit=5`);
      const data = await res.json();
      if (res.ok) {
        setUser(data.getUser);
        setTotalUser(data.totalUser);
        setLastMonthUser(data.lastMonthUser);
      }
    };
    fetchUser();

    const fetchPost = async () => {
      const res = await fetch(`/api/v1/post/getposts?limit=5`);
      const data = await res.json();
      if (res.ok) {
        setPost(data.post);
        setTotalPost(data.totalPosts);
        setLastMonthPost(data.lastMonthPosts);
      }
    };
    fetchPost();

    const fetchComment = async () => {
      try {
        const res = await fetch(`/api/v1/comment/getcomments?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setComment(data.comments);
          setTotalComment(data.totalComments);
          setLastMonthComment(data.oneMonthComments);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    fetchComment();
  }, []);

  return (
    <div className="mx-auto p-4">
      <h1 className="font-bold text-2xl text-center md:text-start">Admin Dashboard</h1>

      <div className="w-full flex flex-wrap justify-center gap-6 items-center mt-8">
        <div className="flex shadow-md justify-between items-center w-full md:w-96 p-5 h-36 bg-white rounded-md">
          <div className="space-y-2">
            <h1 className="font-bold text-[18px]">Total User</h1>
            <p>{totalUser}</p>
            <div className="flex items-center gap-1">
              <span>Last Month: {lastMonthUser}</span>
              <FaArrowUp className="text-green-600" />
            </div>
          </div>
          <HiOutlineUserGroup className="bg-teal-600 text-white text-5xl rounded-full p-3" />
        </div>

        <div className="flex shadow-md justify-between items-center w-full md:w-96 p-5 h-36 bg-white rounded-md">
          <div className="space-y-2">
            <h1 className="font-bold text-[18px]">Total Posts</h1>
            <p>{totalPost}</p>
            <div className="flex items-center gap-1">
              <span>Last Month: {lastMonthPost}</span>
              <FaArrowUp className="text-green-600" />
            </div>
          </div>
          <HiAnnotation className="bg-indigo-500 text-white text-5xl rounded-full p-3" />
        </div>

        <div className="flex shadow-md justify-between items-center w-full md:w-96 p-5 h-36 bg-white rounded-md">
          <div className="space-y-2">
            <h1 className="font-bold text-[18px]">Total Comments</h1>
            <p>{totalComment}</p>
            <div className="flex items-center gap-1">
              <span>Last Month: {lastMonthComment}</span>
              <FaArrowUp className="text-green-600" />
            </div>
          </div>
          <FaComment className="bg-lime-700 text-white text-5xl rounded-full p-3" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div className="bg-white shadow-lg rounded-md">
          <div className="flex justify-between items-center p-3">
            <h1 className="font-bold">Recent Comments</h1>
            <Link to={'/dashboard?tab=comments'}>
              <button className="border-2 border-orange-500 rounded-md p-1 px-3 hover:bg-orange-600 hover:text-white">See all</button>
            </Link>
          </div>
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Likes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {comment.map((comment) => (
                <tr key={comment._id} className="hover:bg-gray-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 line-clamp-2">
                    {comment.content}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {comment.noOfLikes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white shadow-lg rounded-md">
          <div className="flex justify-between items-center p-3">
            <h1 className="font-bold">Recent Users</h1>
            <Link to={'/dashboard?tab=dashuser'}>
              <button className="border-2 border-orange-500 rounded-md p-1 px-3 hover:bg-orange-600 hover:text-white">See all</button>
            </Link>
          </div>
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {user.map((user) => (
                <tr key={user._id} className="hover:bg-gray-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <img src={user.ProfilePicture} alt="user" className="w-8 h-8 object-cover rounded-full" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.username}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-20 shadow-2xl bg-white rounded-md">
        <div className="flex justify-between items-center p-3">
          <h1 className="font-bold">Recent Posts</h1>
          <Link to={'/dashboard?tab=dashpost'}>
            <button className="border-2 border-orange-500 rounded-md p-1 px-3 hover:bg-orange-600 hover:text-white">See all</button>
          </Link>
        </div>
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {post.map((post) => (
              <tr key={post._id} className="hover:bg-gray-200">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {post.title}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserDash;
