import express from "express";
import { verifyToken } from "../utils/isAuthenticated.js";
import { createPost, deletePost, getPosts, search, trendingBlog, updatePost } from "../controllers/postcontroller.js";

const router = express.Router();


router.post('/create' , verifyToken , createPost);
router.get('/getposts' , getPosts);
router.put('/update/:postId/:userId' ,verifyToken ,  updatePost);
router.delete('/delete/:postId/:userId' ,verifyToken ,  deletePost);
router.get('/trending' , trendingBlog);
router.get('/search' , search)





export default router;