
import express from "express";
import { deleteUser, getAllUsers, getUsers, google, login, register, signOut, test } from "../controllers/userController.js";
import {verifyToken} from '../utils/isAuthenticated.js'




const router = express.Router();


router.get('/test' , test);
router.post('/register' , register);
router.post('/login' , login);
router.post('/google' , google);
router.post('/signout' , signOut);
router.get('/getuser'  , verifyToken, getAllUsers);
router.delete('/delete/:id' , verifyToken , deleteUser);
router.get('/:userId' , getUsers);





export default router;