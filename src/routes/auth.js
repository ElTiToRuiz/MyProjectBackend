import express from 'express';
import { UserController } from "../controllers/user/userController.js";
import {authentication} from "../middlewares/authentication.js";

export const authRouter = express.Router();

// Auth user
authRouter.get('/me', authentication(), UserController.auth);

//this only on developmente else the above one
authRouter.post('/register',  UserController.register);

// login user
authRouter.post('/login', UserController.login);

// logout user
authRouter.post('/logout', authentication(), UserController.logout);