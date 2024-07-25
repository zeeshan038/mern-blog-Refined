import mongoose from "mongoose";


const postSchema = new mongoose.Schema({
    userId : {
        type : String , 
         requred : true ,
    }  ,
    title : {
        type : String , 
        unique : true , 
        requred : true ,
    } , 
    content : {
        type : String , 

        requred : true ,
    } , 
    image: {
        type: String,
        default: "https://www.elegantthemes.com/blog/wp-content/uploads/2021/03/featured-default-themes.png"
    },
    category : {
        type : String , 
        requred : true ,
    } , 
    slug : {
        type : String , 
        unique : true , 
        requred : true
    }
} , 
{timestamps : true});


const  Post = mongoose.model("Post" , postSchema)

export default Post;