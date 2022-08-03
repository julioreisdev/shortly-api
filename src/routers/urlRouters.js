import { Router } from "express";
import { shortUrl } from "../controllers/urlControllers.js";
import { tokenValidate } from "../middlewares/tokenValidate.js";

const router = Router();

router.post("/urls/shorten", tokenValidate, shortUrl);

export default router;
