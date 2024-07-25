import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
const PostCard = ({post}) => {
    const {currentUser} = useSelector((state)=>state.user)
  return (
    <div className='w-[350px] '>
        <Link to={`/post/${post.slug}`}>
            <img src={post.image} alt={post.title   } className='h-[230px] w-full object-cover rounded-md'/>
        </Link>
        <div className='flex items-center mt-5'>
            <p className='font-bold '>{post.category}</p>
            <p className='text-gray-400 flex items-center'><span className='px-2'>--</span>     {new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
        <Link to={`/post/${post.slug}`}>
        <h1 className='font-bold mt-1 line-clamp-2'>{post.title}</h1>
        </Link>
      
        <p className='line-clamp-2 post-content mt-3 text-sm'  dangerouslySetInnerHTML={{ __html:post.content }} ></p>
        <div className='flex items-center justify-start mt-2'>
           <img src={currentUser?.ProfilePicture || "user"} alt="user" className='w-8 h-8 object-cover' />
             <div className='mx-3 my-1 flex justify-center items-start flex-col'>
                <h1 className='text-sm font-bold'>{currentUser?.username || "Zeeshan"}</h1>
                <p className='text-gray-400 text-xs'>CEO and Founder</p>
             </div>
        </div>
    </div>
  )
}

export default PostCard