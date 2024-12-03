import bcrypt from 'bcrypt';
import { UserModel } from "../models/user/userModel.js";
import { bugReportEmail, sendNewPasswordToUser, sendPasswordToUser, transporter } from "../services/emailServices.js";
import { genereateRandomPassword } from "../utils/generateKey.js";
import { sendNotifcationAdmin } from '../sockets/index.js';

export class SupportController{
    static sendEmail(mailOptions){
        console.log(mailOptions);
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Error sending email:", error);
                throw new Error('Failed to send email');
            }
            console.log('Email sent:' );
        });
    }

    static bugReport(req, res){
        const { bugTitle, bugDescription } = req.body;
        const mailOptions = bugReportEmail({bugTitle, bugDescription});
        const result = SupportController.sendEmail(mailOptions);
        res.json(result);
    }

    static sendPasswordToUser({email}){
        try{
            const newPassword = genereateRandomPassword();
            const mailOptions = sendPasswordToUser({email, password: newPassword});
            SupportController.sendEmail(mailOptions);
            return newPassword;
        }catch(error){
            throw error
        }

    }

    static async recoverPassword (req, res){
        try{
            const { email } = req.body;
            const user = await UserModel.findOne({ where: { email } });
            console.log(user);
            if(!user) return res.status(404).json({ message: 'User not found' });
            const newPassword = genereateRandomPassword();
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await UserModel.update({ password: hashedPassword }, { where: { id: user.dataValues.id } });
            const mailOptions = sendNewPasswordToUser({email, password: newPassword});
            SupportController.sendEmail(mailOptions);
            const { password, ...userWithoutPassword } = user.dataValues
            sendNotifcationAdmin('update-user', userWithoutPassword);
            return res.json({ message: 'Email sent successfully' });
        }catch(error){
            console.error(error);
            return res.status(500).json({ message: 'Failed to send email' });
        }
    }
}