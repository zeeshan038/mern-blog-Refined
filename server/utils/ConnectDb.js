import mongoose from 'mongoose';
const uri= 'mongodb+srv://zeeshan:zeeshan@mernblog.vtqsrtv.mongodb.net/mern-blog?retryWrites=true&w=majority&appName=mernblog'

const mongoUri = "mongodb://localhost:27017"
const connectDb = async () => {
  try {
    await mongoose.connect(uri, {
      dbName: "MernBlog(refined)N"
    });
    console.log("Db connected");
  } catch (e) {
    console.error("Failed to connect to DB", e);
  }
};

export default connectDb;
