import { UserModel } from "../models/user/userModel.js"

export const createFirstUser = async () => {
    try{
        const userExists = await UserModel.findOne({
            where: { role: 'superadmin', email: 'superadmin@example.com' }
        });
        if(userExists) return;
        await UserModel.create({
            username: 'Superadmin',
            email: 'superadmin@example.com',
            password: 'superadmin',
            role: 'superadmin',
        })
        console.log('Superadmin created:');
    }catch(error){
        console.error('Error creating superadmin:', error);
    }
}