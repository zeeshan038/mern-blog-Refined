import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const DashPosts = () => {
    const [posts, setUserPosts] = useState([]);
    const { currentUser } = useSelector((state) => state.user);
    const [showMore, setShowMore] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            if (currentUser?._id) {
                try {
                    const res = await fetch(`/api/v1/post/getposts?userId=${currentUser._id}`);
                    const data = await res.json();
                    if (res.ok) {
                        setUserPosts(data.post);
                        setShowMore(data.post.length >= 9);
                    }
                } catch (error) {
                    console.log(error.message);
                }
            }
        };
        fetchPosts();
    }, [currentUser?._id]);

    const handleShowMore = async () => {
        const startIndex = posts.length;
        try {
            const res = await fetch(`/api/v1/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setUserPosts((prev) => [...prev, ...data.post]);
                setShowMore(data.post.length >= 9);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/v1/post/delete/${postIdToDelete}/${currentUser._id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
                setShowModal(false);
            } else {
                console.log('Failed to delete post');
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDeleteModal = (postId) => {
        setPostIdToDelete(postId);
        setShowModal(true);
    };

    return (
        <div className="p-4">
            {posts.length > 0 ? (
                <div className="overflow-x-auto w-[230%]">
                    <table className="w-full min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date Updated
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Post Image
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Post Title
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Delete
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Edit
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {posts.map((post) => (
                                <tr key={post._id} className="hover:bg-gray-200">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(post.updatedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link to={`/post/${post.slug}`}>
                                            <img src={post.image} alt="post" className="w-20 rounded-md h-12 object-cover" />
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap line-clamp-1 w-40">
                                        <Link to={`/post/${post.slug}`} className="text-sm text-gray-900">
                                            {post.title}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {post.category}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span onClick={() => handleDeleteModal(post._id)} className="text-red-600 cursor-pointer">
                                            Delete
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <Link to={`/update-post/${post._id}`} className="text-indigo-600 hover:text-indigo-900">
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {showMore && (
                        <p onClick={handleShowMore} className="cursor-pointer text-teal-500 text-sm text-center mt-10 w-full">
                            show more
                        </p>
                    )}
                </div>
            ) : (
                <h1 className="text-center text-xl">You have no posts yet</h1>
            )}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-md text-center">
                        <p>Are you sure you want to delete?</p>
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

export default DashPosts;
