
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username  : {
          type : String , 
          required : true  ,
          unique : true
    } , 
    email  : {
        type : String , 
        required : true  ,
        unique :true 

  } , 
  password : {
    type : String , 
    required : true  ,
 
  } ,
  ProfilePicture : {
    type : String , 
    default : "https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png"
  },
  isAdmin : {
    type : Boolean , 
    default : false ,
  }

}, {timestamps : true});


const User = mongoose.model('User' , userSchema);

export default User;