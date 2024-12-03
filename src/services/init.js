import { UserModel } from "../models/user/userModel.js"

export const createFirstUser = async () => {
    try{
        const userExists = await UserModel.findOne({ role: 'superadmin' });
        if(userExists) return;
        const user = await UserModel.create({
            name: 'Superadmin',
            email: 'superadmin@example.com',
            password: 'superadmin',
            role: 'superadmin',
        })
        console.log('Superadmin created:', user);
    }catch(error){
        console.error('Error creating superadmin:', error);
    }
}