import bcrypt from 'bcrypt';
import { UserModel } from '../../models/user/userModel.js';
import { generateAccessToken, generateRefreshToken, saveHttpOnlyCookie } from '../../utils/token.js';
import { RefreshTokenModel } from '../../models/user/refreshModel.js';
import sequelize from '../../config/database.js';
import { Sequelize } from 'sequelize';
import { sendNotifcationAdmin } from '../../sockets/index.js';
import { SupportController } from '../supportController.js';


export class UserController {
    
    static async auth(req, res){
        try{
            const user = await UserModel.findByPk(req.user.id);
            if(!user){
                return res.status(404).json({ message: "User not found" });
            }
            const {password: userPassword, ...userWithoutPassword} = user.dataValues 
            res.status(200).json(userWithoutPassword);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error fetching user" });
        }
    }

    static async getAllUsers(req, res){
        try {
            const users = await UserModel.findAll({
                attributes: { exclude: ['password'] },
            });
            console.log(users)
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: "Error fetching users" });
        }
    }
    
   // Register Function
    static async register(req, res) {
        const { username, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 1) 
        const t = await sequelize.transaction({
            isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
            autocommit: false
        });

        try {
            const userExists = await UserModel.findOne({ where: { email } });
            if (userExists) return res.status(409).json({ message: "User already exists" });
            
            // Create user in the database
            const user = await UserModel.create(
                { username, email, password: hashedPassword, role: role || 'pending' },
                { transaction: t }
            );

            const {password: userPassword, ...userWithoutPassword} = user.toJSON();
            
            // Generarate the tokens  
            const accessToken = generateAccessToken(userWithoutPassword);
            const refreshToken = generateRefreshToken(userWithoutPassword);  

            await RefreshTokenModel.create({
                userId: user.id,
                refresh_token: refreshToken,
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            },{ transaction: t });
            
            // Save tokens on HttpOnly Cookies
            saveHttpOnlyCookie(res, accessToken, refreshToken);

            await t.commit();
            // Send notification to admin an superadmin about new user to aprove
            sendNotifcationAdmin('new-user-to-aprove', userWithoutPassword);

            res.status(201).json({
                user: userWithoutPassword,

                message: "User registered successfully"
            });
        } catch (error) {
            await t.rollback();
            console.log(error);
            res.status(500).json({ message: "Error registering user" });
        }
    }

    // Login Function
    static async login(req, res) {
        const { email, password } = req.body;
        console.log(req.body)
        try {
    
            const user = await UserModel.findOne({ where: { email } });
            if (!user) return res.status(404).json({ message: "User not found" });
            const { password: userPassword, ...userWithoutPassword } = user.dataValues; // Exclude password from user object
            const isPasswordValid = await bcrypt.compare(password, userPassword);
            if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });
            
            // Generarate the tokens            
            const accessToken = generateAccessToken(userWithoutPassword);
            const refreshToken = generateRefreshToken(userWithoutPassword);  
            await RefreshTokenModel.create({    
                userId: user.id,
                refresh_token: refreshToken,
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            })

            // Save tokens on HttpOnly Cookies
            saveHttpOnlyCookie(res, accessToken, refreshToken);
            
            res.status(200).json({
                user: userWithoutPassword,
                message: "Login successful"
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error logging in" });
        }
    }


    // Get User Profile
    static async getProfile(req, res) {
        try {
            const userId = req.user_id;  // user_id comes from JWT middleware
            const user = await UserModel.findByPk(userId, {
                attributes: { exclude: ['password'] } // Exclude password from response
            });
            if (!user) return res.status(404).json({ message: "User not found" });
            
            res.status(200).json(user);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error retrieving profile" });
        }
    }

    // Create User Profile only for admin or superadmin in development
    static async createProfile (req, res) {
        try {
            const { username, email, role } = req.body;
            console.log(req.body)
            const newPassword = SupportController.sendPasswordToUser({email});
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const user = await UserModel.create({ username, email, password: hashedPassword, role });
            const { password: userPassword, ...userWithoutPassword } = user.toJSON();
            sendNotifcationAdmin('new-user', userWithoutPassword);
            res.status(201).json({user: userWithoutPassword, message: "Profile created successfully"});
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error creating profile" });
        }
    }
    
    // Update User Profile
    static async updateProfile(req, res) {
        try {
            // const userId = req.user.id; // user_id comes from JWT middleware
            const { id, username, email, password } = req.body;
            const user = await UserModel.findByPk(id);
            if (!user) return res.status(404).json({ message: "User not found" });
            const updates = { username, email };
            // Hash new password if provided
            if (password) updates.password = await bcrypt.hash(password, 10);
            await UserModel.update(updates, { where: { id }});
            const newUser = await UserModel.findByPk(id);
            const { password: userPassword, ...userWithoutPassword } =  newUser.dataValues;
            sendNotifcationAdmin('update-user', userWithoutPassword);
            res.status(200).json({ message: "Profile updated successfully"});
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error updating profile" });
        }
    }

    static async updateProfileFromAdmin(req, res) {
        try {
            const { id, username, email, role } = req.body;
            const [updatedRows, updateUser] = await UserModel.update({ username, email, role }, { where: { id } });
            if (updatedRows === 0) return res.status(404).json({ message: "User not found" });
            sendNotifcationAdmin('update-user', req.body);
            res.status(200).json({ message: "Profile updated successfully"});
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error updating profile" });
        }
    }

    // delete user
    static async deleteUser(req, res) {
        try {
            const {userId, role} = req.body
            const user = await UserModel.findByPk(userId);
            if (!user) return res.status(404).json({ message: "User not found" });
            const deletedRows = await UserModel.destroy({ where: { id: userId} });
            if (deletedRows === 0) return res.status(404).json({ message: "User not found" });
            if (role!=='pending') await RefreshTokenModel.destroy({ where: { userId } });
            sendNotifcationAdmin('delete-user', user);
            res.status(204).json({ message: "User deleted successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error deleting user" });
        }
    }

    static async getRefreshToken(userId){
        try{
            const refreshToken = await RefreshTokenModel.findByPk(userId);
            return refreshToken; 
        }catch (error){
            throw new Error(error);
        }
    }

    static async logout(req, res) {
        try {
            await RefreshTokenModel.destroy({ where: { userId: req.user.id } });
            res.clearCookie('access_token', { httpOnly: true, secure: true, path: '/' });
            res.clearCookie('refresh_token', { httpOnly: true, secure: true, path: '/' });
            res.status(204).json({ message: "Logout successful" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error logging out" });
        }
    }
}