import User from "../Models/userModel.js";
import { ErrorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs'
export const test = async(req , res )=>{
    return res.json({
        message : "Api is working fine"
    })
}


export const register = async(req , res , next)=>{
       const {username , email , password} = req.body;
       
       if(!username || !email || !password){
        return next(ErrorHandler(401 , "All fields are required"));
       }
       try {

     const hashedPassword = bcryptjs.hashSync(password  , 10);
      const newUser = await User.create({
            username , 
            email , 
            password  : hashedPassword
        })

        newUser.save();
        res.status(200).json(newUser);
       } catch (error) {
          return next(error)
       }
}

 export const login = async(req  , res ,next) =>{
      const {email , password} = req.body;

     if(!email || !password) {
        return next(ErrorHandler(401 , "All fields are required"));
     }
     try {
        const validUser = await User.findOne({email});
        if(!validUser){
            return next(ErrorHandler(404 , "Email or password is not valid"));
        }
        const validPassword = bcryptjs.compareSync(password , validUser.password);
        if(!validPassword){
            return next(ErrorHandler(404 , "Email or password is not valid"));
        }
        const {validPasswordpassword , ...rest} = validUser._doc;
        const token  = jwt.sign({id : validUser._id ,isAdmin : validUser.isAdmin }, "xzxzxzxzxzxzxxz");
        res.status(200).cookie('token' , token , {
            httpOnly  : true
        }).json(validUser)

   
     } catch ( error) {
        return next(error)
     }
 }

 export const google = async(req , res , next)=>{
    const {name , email , googlePhotoUrl} = req.body;
    try {

        const user = await User.findOne({email});
        if(user){
            const token = jwt.sign({id : user._id , isAdmin : user.isAdmin} ,"xzxzxzxzxzxzxxz");
            const {password , ...rest} = user._doc;
            res.status(200).cookie("token" , token,{
                httpOnly : true
            }).json(rest);

        }
        else{
            const genratedPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(genratedPassword , 10);
            const newUser = await User.create({
                username : name, 
                email , 
                password : hashedPassword , 
                ProfilePicture : googlePhotoUrl
            })
            await newUser.save();
            const token = jwt.sign({id : newUser._id , isAdmin : newUser.isAdmin} , "xzxzxzxzxzxzxxz");
            const {password , ...rest} = newUser._doc;
            res.status(200).cookie("token" , token ,{httpOnly : true}).json(rest);
        }
    } catch (error) {
        next(error);
    }
 }

 export const signOut = async(req , res , next)=>{
    try {
        res.clearCookie('token').status(200).json("user signed out successfully");
    } catch (error) {
        next(error);
    }
 }

 export const getUsers = async(req , res , next)=>{
      
    try {
        const user = await User.findById(req.params.userId);
        if(!user){
            return next(ErrorHandler(401 , "User not Found"));
        }
        const {password , ...rest} = user._doc;
        res.status(200).json(user);
    } catch (error) {
        next(error)
    }
 }


 export const getAllUsers = async (req, res, next) => {
    try {
      if (!req.user.isAdmin) {
        return next(ErrorHandler(401, "You are not an admin"));
      }
  
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.order === 'asc' ? 1 : -1;
  
      const getUser = await User.find()
        .sort({ createdAt: sortDirection })
        .skip(startIndex)
        .limit(limit);
  
      const userWithoutPassword = getUser.map((user) => {
        const { password, ...rest } = user._doc;
        return rest;
      });
  
      const totalUser = await User.countDocuments();
  
      // Calculate users from the last month
      const now = new Date();
      const twoMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
  
      const lastMonthuser = await User.countDocuments({
        createdAt: { $gte: twoMonthAgo },
      });
  
      // Calculate users from the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
  
      const lastSevenDaysUser = await User.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
      });
  
      res.status(200).json({
        getUser: userWithoutPassword,
        totalUser,
        lastMonthuser,
        lastSevenDaysUser, // Add this line
      });
    } catch (error) {
      next(error);
    }
  };
  


 export const deleteUser = async(req , res , next)=>{

     try {
        if(!req.user.isAdmin){
            return next(ErrorHandler(401 , "You are not an admin"));

        }
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message : "User deleted successfully"
        })
     } catch (error) {
         next(error)
     }
 }