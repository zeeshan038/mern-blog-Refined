import React, { useEffect, useState } from "react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import TrendingPostsCarousel from "./TrendingPosts";
import PostCard from "./PostCard";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
const Home = () => {
     const [posts , setPosts] = useState([]);
    useEffect(()=>{
      const fetchPost = async()=>{
        const res = await fetch('/api/v1/post/getposts');
        const data = await res.json();
        if(res.ok){
          setPosts(data.post)
        }
      }
      fetchPost();
    },[])
    
    
  return (
    
    <div className="mx-auto max-w-6xl">
      <div  className="mt-10">
        <h1 className="text-center text-4xl font-bold font-serif mt-10">Trending</h1>
        <div className="mt-12">
      <TrendingPostsCarousel />
      </div>
      </div>
      <div className="flex flex-col">
       <div className="flex gap-10 flex-wrap mt-24 justify-center md:justify-start  items-start">
         {
          posts && posts.length > 0 ? (
            posts.map((post)=>(
               <PostCard key={post._id} post={post}/>
            ))
          ) :(
            <h1>Not posts yet</h1>
          )
         }
       </div>

          <Link to={'/search'} className=' mt-10 text-lg text-teal-500 hover:underline text-center'>View all posts</Link>
       </div>
      
      <Footer/>
  </div>
  )
}

export default Home