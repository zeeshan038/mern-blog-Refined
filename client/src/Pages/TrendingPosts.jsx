import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const TrendingPostsCarousel = () => {
  const [trending, setTrending] = useState([]);
  const [trending2, setTrending2] = useState([]);
  const{currentUser} = useSelector((state)=>state.user)
  useEffect(() => {
    const fetchTrendingPosts = async () => {
      const res = await fetch("/api/v1/post/trending");
      const data = await res.json();
      if (res.ok) {
        setTrending(data);
      }
    };
    fetchTrendingPosts();
  }, []);
  useEffect(() => {
    const fetchTrendingPosts = async () => {
      const res = await fetch("/api/v1/post/trending?limit=1");
      const data = await res.json();
      if (res.ok) {
        setTrending2(data);
      }
    };
    fetchTrendingPosts();
  }, []);
 
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000, // 3 seconds
  };

  return (
    
    <div className="">
        <div className="hidden md:block">
 <Slider {...settings}>
      {trending.map((data) => (
    <div className="hidden">
        <div key={data._id} className="flex gap-4">
          <div>
            <Link to={`/post/${data.slug}`} className="flex flex-1 justify-center items-center">
              <img
                src={data.image}
                alt="post image"
                className="h-96 w-full object-cover rounded-md"
              />
            </Link>
          </div>
          <div className="flex flex-col w-3/4 justify-center items-start h-62">
            <div className="flex mt-5">
              <p className="font-bold">{data.category}</p>
              <p className="text-gray-400 flex items-center">
                <span className="px-2">--</span>
                {new Date(data.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Link to={`/post/${data.slug}`} className="cursor-pointer">
              <p className="font font-bold">{data.title}</p>
            </Link>
            <p
              className="line-clamp-2 post-content mt-3 text-sm"
              dangerouslySetInnerHTML={{ __html: data.content }}
            ></p>
                 <div className='flex items-center justify-start mt-2'>
           <img src={currentUser?.ProfilePicture || "user"} alt="user" className='w-8 h-8 object-cover' />
           <div className='mx-3 my-1 flex justify-center items-start flex-col'>
           {currentUser?.isAdmin.username || "Zeeshan" }
              <p className='text-gray-400 text-xs'>CEO and Founder</p>
           </div>
      </div>
          </div>
        </div>
        </div>
      ))}
    </Slider>
    </div>

     <div className="block md:hidden">
    {trending2.map((data) => (
        <div>
      <div key={data._id} className="flex  flex-col gap-10 justify-center items-center md:flex-row lg:flex-row">
        <div>
          <Link to={`/post/${data.slug}`} className="flex flex-1 justify-center items-center">
            <img
              src={data.image}
              alt="post image"
              className=" w-[350px] md:w-[500px]  md:h-80 object-cover rounded-md"
            />
          </Link>
        </div>
        <div className="flex flex-col w-3/4 justify-center items-start h-62">
          <div className="flex mt-5">
            <p className="font-bold">{data.category}</p>
            <p className="text-gray-400 flex items-center">
              <span className="px-2">--</span>
              {new Date(data.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Link to={`/post/${data.slug}`} className="cursor-pointer">
            <p className="font font-bold">{data.title}</p>
          </Link>
          <p
            className="line-clamp-2 post-content mt-3 text-sm"
            dangerouslySetInnerHTML={{ __html: data.content }}
          ></p>
            <div className='flex items-center justify-start mt-2'>
           <img src={currentUser?.ProfilePicture || "user"} alt="user" className='w-8 h-8 object-cover' />
           <div className='mx-3 my-1 flex justify-center items-start flex-col'>
           {currentUser?.isAdmin.username || "Zeeshan" }
              <p className='text-gray-400 text-xs'>CEO and Founder</p>
           </div>
      </div>
        </div>
      </div>
      </div>
    ))}
    </div>
    </div>
  );
};

export default TrendingPostsCarousel;
