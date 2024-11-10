import { User } from "../database/models/user.model";
declare global {
  namespace Express {
    export interface Request {
      user?: User | JwtPayload | string;
    }
  }
}
