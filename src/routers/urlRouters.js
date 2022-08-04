import { Router } from "express";
import {
  deleteUrl,
  getUrlById,
  openShortUrl,
  shortUrl,
} from "../controllers/urlControllers.js";
import { tokenValidate } from "../middlewares/tokenValidate.js";

const router = Router();

router.post("/urls/shorten", tokenValidate, shortUrl);
router.get("/urls/:id", getUrlById);
router.get("/urls/open/:shortUrl", openShortUrl);
router.delete("/urls/:id", tokenValidate, deleteUrl);

export default router;
