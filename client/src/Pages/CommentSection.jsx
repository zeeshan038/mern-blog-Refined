import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
const navigate = useNavigate();

  const handleEdit = (updatedComment, editedContent) => {
    setComments(comments.map((comment) =>
      comment._id === updatedComment._id ? { ...comment, content: editedContent } : comment
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newComment.length > 200) {
      return;
    }
  
    try {
      const res = await fetch(`/api/v1/comment/createcomment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment, postId, userId: currentUser._id }),
      });
  
      const data = await res.json();
      if (res.ok) {
        setNewComment('');
        setComments([data.comment, ...comments]); 
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/v1/comment/getcomment/${postId}`);
        const data = await res.json();
        if (res.ok) {
          setComments(data);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    try {
      const res = await fetch(`/api/v1/comment/like/${commentId}`, {
        method: 'PUT',
      });
      if (res.ok) {
        const data = await res.json();
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === commentId
              ? { ...comment, likes: data.likes, noOfLikes: data.likes.length }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDelete = async(commentId)=>{
    if(!currentUser){
        navigate('/login');
        return;
    }
    try {
        const res = await fetch(`/api/v1/comment/delete/${commentId}`,
        {
            method : "DELETE"
        });
        const data = await res.json();
        setComments(comments.filter((comment)=>comment._id !== commentId));
    } catch (error) {
        console.log(error)
    }
  }
  
  return (
    <div className='mx-auto w-full max-w-2xl mt-5'>
      {currentUser ? (
        <div className='flex w-full max-w-2xl mt-5'>
          <p>Signed in as:</p>
          <img src={currentUser.profilePicture} alt="user" className='w-5 h-6 object-cover rounded-full' />
          <p>@{currentUser.username}</p>
        </div>
      ) : (
        <div>
          Sign in first!
          <Link to={'/login'}>Sign In</Link>
        </div>
      )}
      {currentUser && (
        <form onSubmit={handleSubmit} className='mt-3 border-2 border-teal-500 rounded-tl-xl flex flex-col p-5'>
          <textarea
            cols='30'
            rows='4'
            maxLength='200'
            className='w-full sm:w-auto px-4 py-2 sm:px-0 resize-none border-2 border-gray-300'
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <div className='flex sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4'>
            <h1 className='text-sm'>{200 - newComment.length} characters remaining</h1>
            <button className='bg-gray-600 text-white p-2 rounded-md cursor-pointer' type='submit'>
              Submit
            </button>
          </div>
        </form>
      )}
      {comments.length === 0 ? (
        <div>
          <h1>No comments found yet</h1>
        </div>
      ) : (
        <>
          <div className='mt-3 flex justify-start items-center'>
            <p>comments <span className='border-2 p-[1px] px-1 border-gray-500 rounded-md'>{comments.length}</span></p>
          </div>
          {comments.map((com) =>
  com && com._id ? (
    <Comment key={com._id} comment={com} onEdit={handleEdit} onLike={handleLike} onDelete={handleDelete}/>
  ) : null
)}


        </>
      )}
    </div>
  );
};

export default CommentSection;
