import { RefreshTokenModel } from "../models/user/refreshModel.js";
import { generateAccessToken, saveAccessToken, verifyRefreshToken } from "../utils/token.js";

export const refreshAccessMiddleware = async (req, res, next) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken)  return res.status(401).json({ message: "No refresh token provided" });
    // Verify the refresh token
    try {
        const decodedRefresh = verifyRefreshToken(refreshToken);

        if (decodedRefresh.role !== 'pending'){
            const refreshTokenInDb = await RefreshTokenModel.findOne({
                where: { userId: decodedRefresh.user.id, refresh_token: refreshToken }
            });
            if (!refreshTokenInDb) return res.status(401).json({ message: "Invalid refresh token" });
            
            const newAccessToken = generateAccessToken(decodedRefresh.user);
            saveAccessToken(res, newAccessToken);
        }
        // Set the user info on the request after refreshing the token
        req.user = decodedRefresh.user;

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: "Invalid or expired refresh token" });
    }
};
