import express from 'express'
import { verifyToken } from '../utils/isAuthenticated.js';
import { createComment, deleteComment, editComment, getAllComments, getComments, like } from '../controllers/commentController.js';
const router = express.Router();

router.post('/createcomment' ,verifyToken  , createComment );
router.get("/getcomment/:postId" , getComments);
router.put('/edit/:commentId' , verifyToken , editComment)
router.put('/like/:commentId' , verifyToken , like);
router.delete('/delete/:commentId' , verifyToken  , deleteComment);
router.get('/getcomments'  , getAllComments);


export default router;


