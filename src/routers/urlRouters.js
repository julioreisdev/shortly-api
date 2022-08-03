import { Router } from "express";
import { getUrlById, shortUrl } from "../controllers/urlControllers.js";
import { tokenValidate } from "../middlewares/tokenValidate.js";

const router = Router();

router.post("/urls/shorten", tokenValidate, shortUrl);
router.get("/urls/:id", getUrlById);

export default router;
