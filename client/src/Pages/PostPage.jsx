import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import CommentSection from './CommentSection';
import PostCard from './PostCard';
import Footer from '../components/Footer';

const PostPage = () => {
    const { postSlug } = useParams();
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState(null);
    const [recentArticles, setRecentArticles] = useState([]);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/v1/post/getposts?slug=${postSlug}`);
                const data = await res.json();
                if (!res.ok || data.post.length === 0) {
                    setError(true);
                } else {
                    setPost(data.post[0]);
                    setError(false);
                }
            } catch (error) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postSlug]);

    useEffect(() => {
        const fetchRecentArticles = async () => {
            try {
                const res = await fetch(`/api/v1/post/getposts?limit=3`);
                const data = await res.json();

                if (res.ok) {
                    setRecentArticles(data.post);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchRecentArticles();
    }, [post]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading post.</div>;
    }

    return (
        <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
            <h1 className='text-3xl mt-16 text-center font-serif mx-auto lg:text-4xl'>{post && post.title}</h1>
            
            <Link to={`/search?category=${post && post.category}`} className='self-center mt-5'>
                <button className='bg-orange-300 text-white p-1 rounded-md mt-5'>{post && post.category}</button>
            </Link>
            <img src={post && post.image} alt="" className='mt-10 p-3 max-h-[600px] w-full object-cover' />
            <div className='flex justify-between mt-1 items-center'>
                <span className='text-gray-500'>{post && new Date(post.createdAt).toLocaleDateString()}</span>
                <span className='text-gray-500'>{post && (post.content.length / 1000).toFixed(0)} mins read</span>
            </div>
            <div className='max-w-4xl mt-5 mx-auto w-full post-content' dangerouslySetInnerHTML={{ __html: post && post.content }} />

            <div>
                <CommentSection postId={post && post._id} />
            </div>

            <div className='flex flex-col justify-center items-center mt-8 border-b-2'>
                <div>
                    <h1 className='flex flex-wrap justify-center gap-5 mt-5 text-3xl font-sans'>Recent Articles</h1>
                </div>
                <div className='flex flex-wrap justify-center gap-6 mt-6'>
                    {recentArticles && recentArticles.map((recentPost) => (
                        <PostCard key={recentPost._id} post={recentPost} />
                    ))}
                </div>
            </div>
            <Footer/>
        </main>
    );
};

export default PostPage;
