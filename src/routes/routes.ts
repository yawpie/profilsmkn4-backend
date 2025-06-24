import { Router } from "express";
import authRoute from "./auth/authRouter";
import articlesRouter from "./articles/articlesRouter";
import teacherRouter from "./teacher/teacherRouter";
import categoryRoute from "./category/categoryRouter";
import { sendData } from "../utils/send";


const routes = Router();

routes.use("/", authRoute);
routes.use("/category", categoryRoute);
routes.use("/articles", articlesRouter);
routes.use("/teacher", teacherRouter);

routes.get("/", (req, res) => {
    sendData(res);
});


export default routes;