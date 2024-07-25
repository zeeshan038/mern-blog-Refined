import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TiTick } from "react-icons/ti"
import { RxCross2 } from "react-icons/rx";
import { FaComment } from 'react-icons/fa';
const DashUser = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/v1/user/getuser");
        const data = await res.json();
        if (res.ok) {
          setUsers(data.getUser);
          setShowMore(data.getUser.length > 9);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/v1/user/getuser?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.getUser]);
        setShowMore(data.getUser.length >= 9);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/v1/user/delete/${userIdToDelete}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setShowModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleModal = (userId) => {
    setUserIdToDelete(userId);
    setShowModal(!showModal);
  };

  return (
    <div className="p-4 w-full">
      {users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delete</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={user.ProfilePicture} alt="user" className="w-10 h-10 rounded-full" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.isAdmin ? <TiTick  className="text-green-700 text-2xl"/>  : <RxCross2 className="text-red-700 "/>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 cursor-pointer" onClick={() => toggleModal(user._id)}>
                    Delete
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showMore && (
            <p onClick={handleShowMore} className="cursor-pointer text-teal-500 text-sm text-center mt-10 w-full">
              Show more
            </p>
          )}
        </div>
      ) : (
        <p className="text-center text-xl">No users available</p>
      )}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-md text-center">
            <p>Are you sure you want to delete this user?</p>
            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 mt-2 rounded">
              Yes
            </button>
            <button onClick={() => setShowModal(false)} className="bg-gray-300 px-4 py-2 mt-2 ml-2 rounded">
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashUser;
