import { Router } from "express";
import { getUser } from "../controllers/usersControllers.js";
import { tokenValidate } from "../middlewares/tokenValidate.js";

const router = Router();

router.get("/users/me", tokenValidate, getUser);

export default router;
