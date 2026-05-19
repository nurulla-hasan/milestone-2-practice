import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { type JwtPayload } from "jsonwebtoken";
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
    role: user.role,
  };
  const accessToken = jwt.sign(jtwpayload, config.secret as string, {
    expiresIn: "1d",
  });

  const refreshToken = jwt.sign(jtwpayload, config.refresh_secret as string, {
    expiresIn: "10d",
  });

  return { accessToken, refreshToken };
};

const generateRefreshtoken = async (token: string) => {
  if (!token) {
    throw new Error("Unauthorized!");
  }

  const decoded = jwt.verify(
    token,
    config.refresh_secret as string,
  ) as JwtPayload;
  const userData = await pool.query(
    `
      SELECT * FROM users where email=$1
      `,
    [decoded.email],
  );

  const user = userData.rows[0];

  if (userData.rows.length === 0) {
    throw new Error("User not found!");
  }

  if (user.is_active === false) {
    throw new Error("Forbidden!");
  }

  const jtwpayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    is_active: user.is_active,
    role: user.role,
  };

  const accessToken = jwt.sign(jtwpayload, config.refresh_secret as string, {
    expiresIn: "1d",
  });

  return { accessToken };
};

export const authService = {
  loginUserFromDB,
  generateRefreshtoken,
};
