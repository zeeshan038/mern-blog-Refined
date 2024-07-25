import Post from "../Models/postModel.js"
import { ErrorHandler } from "../utils/error.js"

export const createPost = async(req , res , next)=>{
    const {title , content , category } = req.body
    if(!req.user.isAdmin){
        return next(ErrorHandler(401 , "You are not an admin"))
    }
    if(!title || !content || !category){
        return next(ErrorHandler(401 , "All fields are required"))
    }

    const slug =req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-z0-9-]/g,'-');

    const newPost = new Post({
        ...req.body , slug , userId: req.user.id 
    });

    try {
        const savePost = await newPost.save();
        res.status(200).json(savePost);
    } catch (error) {
        next(error);
    }
    
}

export const getPosts = async(req , res , next)=>{
 
    try {
        const startIndex = parseInt(req.query.startIndex) || 0 ; 
        const limit = parseInt(req.query.limit) || 9 ; 
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        const post = await  Post.find({
            ...(req.query.userId && {userId : req.query.userId}),
            ...(req.query.category && {category : req.query.category}), 
            ...(req.query.slug && {slug : req.query.slug}),
            ...(req.query.postId && {_id : req.query.postId}),
            ...(req.query.searchItems && {
                $or : [
                    {title : {$regex : req.query.searchItems , $options : 'i'}},
                    {content : {$regex : req.query.searchItems , $options : "i"}}
                ]
            })
        }).sort({updatedAt : sortDirection}).skip(startIndex).limit(limit);
        const totalPosts = await Post.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth()-1,
            now.getDate(),
        );
        const lastMonthposts = await Post.countDocuments({
            createdAt : {$gte : oneMonthAgo},
        });
        res.status(200).json({
            post , 
            totalPosts , 
            lastMonthposts
        })
    } catch (error) {
         next(error)
    }

}

export const updatePost = async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            return next(ErrorHandler(401, "You are not an admin"));
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            {
                $set: {
                    title: req.body.title,
                    content: req.body.content,
                    category: req.body.category,
                    image: req.body.image
                }
            },
            { new: true }
        );  

        res.status(200).json(updatedPost);
    } catch (error) {
        next(error);
    }
};


export const deletePost = async (req, res, next) => {
    try {
        if (!req.user.id || req.user.id !== req.params.userId) {
            return next(ErrorHandler(401, "You are not allowed to delete post"));
        }
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json({
            message: "Post deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};




export const trendingBlog = async(req , res , next)=>{
    const limit = parseInt(req.query.limit) || 3;
    try {
        
        const trendingPosts = await Post.find().sort({views : -1}).limit(limit);

        res.status(200).json(trendingPosts)
    } catch (error) {
        next(error)
    }
}


export const search = async(req , res , next)=>{
    const {query} = req.query;
    try {
        const  posts = await Post.find({
            title : {$regex : query , $options : 'i'}, 

        });
        res.json(posts)

    } catch (error) {
          res.status(500).json({ error: 'Failed to fetch posts' });
    }
}