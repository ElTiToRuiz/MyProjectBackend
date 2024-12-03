import { UserModel } from "../models/user/userModel.js";
import { verifyAccessToken } from "../utils/token.js";

export const verifyAccessMiddleware = async (req, res, next) => {
    const accessToken = req.cookies.access_token
    if (!accessToken) throw new Error("Access token not provided");
    // Verify the access token
    try{
        const decoded = verifyAccessToken(accessToken);
        const user = await UserModel.findByPk(decoded.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        // if (user.role === 'pending') return res.status(403).json({ message: "Forbidden: Account not activated" });
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: "Invalid or expired access token" });
    }
};

