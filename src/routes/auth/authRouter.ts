import { Router } from "express";
import auth from "./auth";
import register from "./register";
import refresh from "./refresh";
import logout from "./logout";
import { checkAccessWithCookie } from "../../middleware/authMiddleware";
import { AuthRequest } from "../../types/auth";

const authRoute = Router();

authRoute.use("/login", auth);
authRoute.use("/register", register);
authRoute.use("/refresh", refresh);
authRoute.use("/logout", logout);
authRoute.get("/check-auth", checkAccessWithCookie, (req: AuthRequest, res) => {
  res.status(200).json({ message: "Authenticated" });
});
export default authRoute;