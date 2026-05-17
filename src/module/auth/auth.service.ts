import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import { userService } from "../users/user.service";
import config from "../../config";

const loginUserFromDB = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  const userdata = await pool.query(
    `
        SELECT * FROM users WHERE email=$1
        `,
    [email],
  );

  if (userdata.rows.length === 0) {
    throw new Error("Invalid credentials!");
  }

  const user = userdata.rows[0];

  const matchpassword = await bcrypt.compare(password, user.password);
  if (!matchpassword) {
    throw new Error("Invalid credentials!");
  }

  const jtwpayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    is_active: user.is_active,
  };
  const accessToken = jwt.sign(jtwpayload, config.secret as string, {expiresIn: "1d"} );

  return {accessToken}
};

export const authService = {
  loginUserFromDB,
};
