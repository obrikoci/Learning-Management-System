import express from "express";
import { refreshAccessToken } from "../controllers/authController";

const router = express.Router();

router.post("/refresh-token", refreshAccessToken);

export default router;

