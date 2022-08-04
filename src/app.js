import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import signRouters from "./routers/signRouters.js";
import urlRouters from "./routers/urlRouters.js";
import usersRouters from "./routers/usersRouters.js";

dotenv.config();
const app = express();

app.use(cors(), express.json());

app.use(signRouters);
app.use(urlRouters);
app.use(usersRouters);

app.listen(process.env.PORT, () => {
  console.log("Server Running!!!");
});
