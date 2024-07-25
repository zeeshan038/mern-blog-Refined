import React, { useEffect, useState } from 'react'

const Comments = () => {
  const [comment , setComment] = useState([]);
  const [showMore , setShowMore] = useState(true);
  const [showModel , setShowModel] = useState(false) 
  const [commentToDelete, setCommentToDelete] = useState('');
  useEffect(()=>{
    const fetchComment = async()=>{
      const res = await fetch(`/api/v1/comment/getcomments`)
      const data = await res.json();
      if(res.ok){
        setComment(data.comments)
      }
    }
    fetchComment();
  },[]);
 const handleShowMore = async()=>{
  const startIndex = comment.length;
  try {
     const res = await fetch(`/api/v1/comment/getcomments?startIndex=${startIndex}`);

     const data = await res.json();
     if(res.ok){
       setComment((prev)=>[...prev , ...data.comments]);
       if (data.comments.length < 9) {
        setShowMore(false);
      }
     }
  } catch (error) {
     console.log(error)
  }
 }
 const handleModel = async(commentID)=>{
   setCommentToDelete(commentID);
    setShowModel(true)
 };
 const handleDelete  = async()=>{
     try {
       const res = await fetch(`/api/v1/comment/delete/${commentToDelete}`,{
        method : 'DELETE'
       });
       const data = await res.json();
       if(res.ok){
        setComment((prev)=> prev.filter((comment)=>comment._id !== commentToDelete));
        setShowModel(false);
        if(comment.length < 9){
          setShowMore(false)
        }
       }
     } catch (error) {
        console.log(error)
     }
 }
  return (
    <div className="p-4 w-full">
    {comment.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="w-full min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Likes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delete</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {comment.map((comment) => (
              <tr key={comment._id} className="hover:bg-gray-200">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </td>
             
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {comment.content}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                   {comment.noOfLikes}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 cursor-pointer"
                onClick={()=>handleModel(comment._id)} >
                  Delete
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showMore && (
            <div className='flex justify-center items-center'>
              <button className='text-teal-500 text-sm py-5' onClick={handleShowMore}>
                Show More
              </button>
            </div>
          )}
      </div>
    ) : (
      <p className="text-center text-xl">No Comments</p>
    )}
      

      {showModel && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50'>
          <div className='bg-white p-6 rounded shadow-lg z-50'>
            <h1 className='mb-4'>Are you sure you want to delete this comment?</h1>
            <div className='flex justify-center'>
              <button
                className='bg-red-500 text-white px-4 py-2 mr-2 rounded'
                onClick={handleDelete}
              >
                Yes
              </button>
              <button
                className='bg-gray-500 text-white px-4 py-2 ml-2 rounded'
                onClick={() =>setShowModel(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
  </div>
  )
}

export default Comments