import { Router } from "express";
import auth from "./auth";
import register from "./register";

const authRoute = Router();

authRoute.use("/login", auth);
authRoute.use("/register", register);

export default authRoute;