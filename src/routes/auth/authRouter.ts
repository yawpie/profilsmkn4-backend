import { Router } from "express";
import auth from "./auth";
import register from "./register";
import refresh from "./refresh";
import logout from "./logout";

const authRoute = Router();

authRoute.use("/login", auth);
authRoute.use("/register", register);
authRoute.use("/refresh", refresh);
authRoute.use("/logout", logout);

export default authRoute;