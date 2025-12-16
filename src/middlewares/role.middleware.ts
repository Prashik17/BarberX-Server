import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./auth.middleware";
import { error } from "console";

export const authorizeRoles = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if(!req.user){
            return res.status(401).json({error: "Not authenticated"});
        }

        if(!roles.includes(req.user.role)){
            return res.status(403).json({error: "Access denied: insufficient role"})
        }

        next();
    }
}