import type { Request, Response } from "express";
import { authService } from "./auth.service";



const loginUser = async (req: Request, res: Response) => {

  try {

    const result = authService.loginUserFromDB(req.body)
    res.status(200).json({
      success: true,
      message: "User login successfully",
      data: result,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
      error: error,
    });
  }
};

export const authController = {
  loginUser,
};
