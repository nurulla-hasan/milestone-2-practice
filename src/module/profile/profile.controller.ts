import type { Request, Response } from "express";
import { profileService } from "./profile.service";

const createProfile = async (req: Request, res: Response) => {
  try {
    const result = await profileService.createProfileIntoDb(req.body);

    res.status(200).json({
      success: true,
      message: "Profile created successfully.",
      data: result.rows[0],
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
      error: error,
    });
  }
};

export const profileController = {
  createProfile,
};
