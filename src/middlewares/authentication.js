import { verifyAccessMiddleware } from './verifyAccess.js'; 
import { refreshAccessMiddleware } from './refreshAccess.js';
import cookie from 'cookie';

export const authentication = (requiredRoles) => {
    const checkRole = (req, res, next) =>{
        // check the role again
        if (requiredRoles && !requiredRoles.includes(req.role)) {
            return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
        }
        next();
    }

    return async (req, res, next) => {
        req.cookies = cookie.parse(req.headers.cookie || '');
        try{
            // First, try verifying the access token
            await verifyAccessMiddleware(req, res, next);
        }catch(err){
            if (err.message === 'Access token not provided'){
                // If the access token is expired or invalid, try refreshing the access token
                try{
                    console.log("Access token expired or invalid. Attempting to refresh access token...");
                    await refreshAccessMiddleware(req, res, next); 
                }
                catch(err){
                    res.status(500).json({ message: "Failed to refresh token" });
                }   
            } else {
                res.status(401).json({ message: "Unauthorized" });
            }
        }
    };
};
