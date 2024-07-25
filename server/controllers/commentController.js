import Comment from "../Models/commentModel.js";
import { ErrorHandler } from '../utils/error.js';

export const createComment = async (req, res, next) => {
  const { postId, content, userId } = req.body;
  try {
    if (userId !== req.user.id) {
      return next(ErrorHandler(401, "You are not allowed to post a comment"));
    }
    const comment = new Comment({
      postId,
      content,
      userId
    });
    await comment.save();
    res.status(200).json({
      message: "Comment created successfully",
      comment
    });
  } catch (error) {
    next(error);
  }
}

export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
}

export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(ErrorHandler(404, "Comment not found"));
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(ErrorHandler(401, "You are not allowed to edit this comment"));
    }
    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content
      }, { new: true }
    );
    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
}


export const like = async(req  , res , next)=>{
    try {
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return next(ErrorHandler(404, "Comment not found"));
        }
        const userIndex = comment.likes.indexOf(req.user.id);
        if(userIndex === -1){
            comment.noOfLikes += 1 ; 
            comment.likes.push(req.user.id)
        }else{
            comment.noOfLikes -= 1 ; 
            comment.likes.splice(userIndex  , 1)
        }
        await comment.save();
        res.status(200).json({ likes: comment.likes , message: "Like updated" });

    } catch (error) {
        next(error)
    }
}


export const deleteComment = async(req  , res , next)=>{
 
    try {
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return next(ErrorHandler(404, "Comment not found"));
        }
        if(req.params.userId !== req.user.id && !req.user.isAdmin){
            return next(ErrorHandler(401, "You are not allowed to delete this comment"));
        }
        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json({
            message : "Comment Deleted"
        })
        
    } catch (error) {
        next(error)
    }
}


export const getAllComments = async(req , res , next)=>{
  try {
    const startIndex = parseInt(req.query.startIndex) || 0 ;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort == 'desc' ? -1 : 1;
    const comments = await Comment.find().sort({createdAt:sortDirection}).skip(startIndex).limit(limit)
    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth()-1,
      now.getDate()
    )
    const oneMonthComments = await Comment.countDocuments({
      createdAt : {$gte : oneMonthAgo}
    });
    res.status(200).json({
     comments ,totalComments , oneMonthComments 
  })
  } catch (error) {
    next(error)
  }
}