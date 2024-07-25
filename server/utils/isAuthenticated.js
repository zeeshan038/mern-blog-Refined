import { ErrorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    const token  = req.cookies.token;

    if (!token) {
        return next(ErrorHandler(401, "Login First"));
    }

    jwt.verify(token, "xzxzxzxzxzxzxxz" ,(err, user) => {
        if (err) {
            return next(ErrorHandler(401, "UnAuthorized"));
        }

        req.user = user;
        next();
    });
};
