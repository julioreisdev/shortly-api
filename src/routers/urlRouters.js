import { Router } from "express";
import { shortUrl } from "../controllers/urlControllers.js";

const router = Router();

router.post("/urls/shorten", shortUrl);

export default router;
