import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";

const auth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access!!",
        });
      }

      const decoded = jwt.verify(token, config.secret as string) as JwtPayload;
      const userData = await pool.query(
        `
      SELECT * FROM users where email=$1
      `,
        [decoded.email],
      );

      const user = userData.rows[0];

      if (userData.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found!!",
        });
      }

      if (user.is_active === false) {
        return res.status(403).json({
          success: false,
          message: "Forbidden!!",
        });
      }

      req.user = decoded;

      next();
    } catch (error) {
      console.log(error)
    }
  };
};

export default auth;
