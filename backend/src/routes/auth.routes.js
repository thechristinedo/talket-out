import express from "express";

import {
  signup,
  login,
  logout,
  verifyEmail,
  updateProfile,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
// TODO: FORGOTPASSWORD
// TODO: RESETPASSWORD

router.put("/update-profile", updateProfile);

export default router;
