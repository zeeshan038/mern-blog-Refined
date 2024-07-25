import express from "express";
import connectDb from "./utils/ConnectDb.js";
import cookieParser from "cookie-parser";
import UserRoutes from "./Routes/userRoute.js";
import PostRoutes from "./Routes/postRoute.js";
import commentRoutes from "./Routes/commentRoute.js";
import cors from "cors";

const app = express();

// Connect to MongoDB
connectDb();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Routes
app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/post", PostRoutes);
app.use("/api/v1/comment", commentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal error";

    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
