import { Router } from "express";
// import auth from "./auth";
// import register from "./register";
import addCategory from "./addCategory"

const categoryRoute = Router();

categoryRoute.use("/", addCategory);


export default categoryRoute;