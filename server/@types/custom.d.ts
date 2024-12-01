import { IUser } from "../models/user.model";

declare global {
    namespace Express {
        interface Request {
            user?: IUser; 
            cookies: { [key: string]: string };
        }
    }
};
