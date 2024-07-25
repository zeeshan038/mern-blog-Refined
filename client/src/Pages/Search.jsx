import React, { useEffect, useState } from 'react';
import PostCard from './PostCard';

const Search = () => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [query, setQuery] = useState('');
  const [result, setResults] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/v1/post/getposts');
        const data = await res.json();
        if (res.ok) {
          setPosts(data.post || []);
          setShowMore(data.post.length >= 9);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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

  const handleShowMore = async () => {
    const startIndex = posts.length;
    try {
      const res = await fetch(`/api/v1/post/getposts?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setPosts((prev) => [...prev, ...data.post]);
        setShowMore(data.post.length >= 9);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    }
  };

  return (
    <div className='max-w-6xl mx-auto'>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        type="search"
        className='border-2 w-full mt-6 p-2 rounded-lg'
        placeholder='Search here'
      />
      {loading ? (
        <p>Loading...</p>
      ) : result.length > 0 ? (
        <div className='flex gap-8 items-center justify-start flex-wrap mt-16'>
          {result.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className='flex gap-8 items-center justify-start flex-wrap mt-16'>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p>No posts found.</p>
      )}
      {showMore && (
        <p onClick={handleShowMore} className="cursor-pointer text-teal-500 text-sm text-center mt-10 w-full">
          Show more
        </p>
      )}
    </div>
  );
};

export default Search;
