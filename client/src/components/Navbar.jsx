import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaFacebookF, FaLinkedin } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { signOutStart, signOutSuccess, signOutFailure } from "../redux/reducers/userReducer";
import toast from "react-hot-toast";


const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [nav, setNav] = useState(false);
  const [userData, setUserData] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [result, setResults] = useState([]);
  const [loading, setLoading] = useState(false);


  const handleNav = () => {
    setNav(!nav);
  };

  const closeNav = () => {
    setNav(false);
  };

  const handleUser = () => {
    setUserData(!userData);
  };

  const handleSignout = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch('/api/v1/user/signout', {
        method: "POST"
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(signOutFailure(data.message));
      } else {
        dispatch(signOutSuccess());
        toast.success("User logged out successfully");
        navigate('/login');
      }
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };

  useEffect(() => {
    const handleSearch = async () => {
      if (!query) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/v1/post/search?query=${query}`);
        const data = await res.json();
        if (res.ok) {
          setResults(data);
        
        }
      } catch (error) {
        console.error('Error searching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    handleSearch();
  }, [query]);

  
  return (
    <header className="md:flex max-w-[1700px] mx-auto md:justify-evenly items-center md:border-b-2 md:h-20">
    
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        type="search"
        placeholder="search here"
        className="hidden md:block border-2 rounded-full border-gray-300 py-1 px-8"
      />

      <h1 className="font-bold font-serif text-center mt-6 md:hidden">
        MAGDESIGN
      </h1>
      <h1 className="font-bold font-serif hidden md:block">MAGDESIGN</h1>

      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center gap-4">
          <FaFacebookF className="hover:text-blue-500 md:hidden" />
          <FaLinkedin className="hover:text-blue-500 md:hidden" />
        </div>
        <nav className="flex justify-center items-center">
          <ul
            className={`flex flex-col items-start justify-start mt-20 fixed top-0 left-0 h-full bg-white z-50 transition-transform transform ${
              nav ? "translate-x-48" : "-translate-x-full"
            } w-[70%] transition-all duration-300 shadow-lg rounded-md md:hidden`}
          >
            <Link to="/" className="p-4 hover:text-orange-300" onClick={handleNav}>
              Home
            </Link>
            <Link to="/about" className="p-4 hover:text-orange-300" onClick={handleNav}>
              About
            </Link>
            <Link to="/blogs" className="p-4 hover:text-orange-300" onClick={handleNav}>
              Blogs
            </Link>
            {!currentUser && (
              <Link to="/login" className="p-4 hover:text-orange-300 " onClick={handleNav}>
                Login
              </Link>
            )}
          </ul>

          <ul className="space-x-6 hidden md:block">
            <Link to="/" className="hover:text-orange-300">
              Home
            </Link>
            <Link to="/about" className="hover:text-orange-300">
              About
            </Link>
            <Link to="/blogs" className="hover:text-orange-300">
              Blogs
            </Link>
          </ul>
        </nav>
        {currentUser ? (
          <div className="flex items-center cursor-pointer">
            <img
              src={currentUser.ProfilePicture}
              alt="user"
              className="h-7 absolute right-10"
              onClick={handleUser}
            />
          </div>
        ) : (
          <div>
            <Link to="/login" className="hover:text-orange-300 absolute top-[33px] right-14 ">
              Login
            </Link>
          </div>
        )}

        {userData && currentUser && (
          <div className="bg-white shadow-md fixed right-10 flex flex-col justify-start gap-2 items-start top-24 rounded-md md:w-64 md:top-16">
            <p className="font-semibold p-2 hover:bg-orange-200 hover:w-full text-sm">
              {currentUser.username}
            </p>
            <p className="font-semibold p-1 hover:bg-orange-200 hover:w-full text-sm">
              {currentUser.email}
            </p>
            {currentUser.isAdmin && (
              <Link to={"/dashboard?tab=user"} onClick={handleUser} className="font-semibold p-1 hover:bg-orange-200 hover:w-full">
                Dashboard
              </Link>
            )}
            <button onClick={handleSignout} className="font-semibold text-orange-600 p-1 hover:bg-orange-200 w-full">
              Signout
            </button>
          </div>
        )}

        {nav ? (
          <RxCross2 onClick={handleNav} className="text-2xl md:hidden" />
        ) : (
          <GiHamburgerMenu onClick={handleNav} className="text-2xl md:hidden" />
        )}
      </div>
      {result.length > 0 && (
  <div className="fixed top-36 left-0 w-full bg-white shadow-lg p-4">
    {result.map((post) => (
      <div key={post.slug} className="z-50">
        <Link
          to={`/post/${post.slug}`}
          onClick={() => setResults([])} // Clear results on click
        >
          {post.title}
        </Link>
      </div>
    ))}
  </div>
)}


      <div className="flex items-center justify-center mt-6 md:hidden">
        <input
          type="search"
          className="border text-center w-full rounded-full p-1 border-gray-500"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </header>
  );
};

export default Navbar;
