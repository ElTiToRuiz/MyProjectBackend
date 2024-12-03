import express from 'express'; 
import { UserController } from '../controllers/user/userController.js';

export const usersRouter = express.Router();

// create a user
usersRouter.post('/create', UserController.createProfile);

// get a user profile
usersRouter.get('/profile', UserController.getProfile);

// update a user profile
usersRouter.put('/profile', UserController.updateProfile);

// delete a user
usersRouter.delete('/delete', UserController.deleteUser);

// get all users
usersRouter.get('/', UserController.getAllUsers);

// update a user from admin
usersRouter.put('/admin', UserController.updateProfileFromAdmin);
