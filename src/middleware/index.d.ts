import type { JwtPayload } from "jsonwebtoken";
import type { IUser } from "../module/users/user.interface";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}