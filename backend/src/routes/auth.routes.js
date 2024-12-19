import express from "express";

import {
  signup,
  login,
  logout,
  verifyEmail,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/check", protectRoute, checkAuth);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
// TODO: FORGOTPASSWORD
// TODO: RESETPASSWORD

router.put("/update-profile", protectRoute, updateProfile);

export default router;
