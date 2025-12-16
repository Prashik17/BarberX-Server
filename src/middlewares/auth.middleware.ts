import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { logger } from "../config/logger";
import { error } from "console";


export interface AuthRequest extends Request {
    user?: {id:string, role:string};
}

export const authenticateJWT = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({error: "Authorization header missing"});

    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            id: string,
            role: string
        };

        req.user = decoded;
        logger.info(`✅ Authenticated user ${decoded.id} (role: ${decoded.role})`);
        next();
    } catch (err:any) {
        logger.error(`❌ Invalid token: ${err.message}`);
        return res.status(403).json({error: "Invalid or expired token"})
    }

}