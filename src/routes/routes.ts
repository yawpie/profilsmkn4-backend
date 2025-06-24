import { Router } from "express";
// import GeneralResponse from "../utils/generalResponse";


// import testApi from "./testApi";
import authRoute from "./auth/authRouter";

import articlesRouter from "./articles/articlesRouter";
import teacherRouter from "./teacher/teacherRouter";
import { sendData } from "../utils/send";

const routes = Router();

routes.use("/", authRoute);
// routes.use("/test", testApi);

routes.use("/articles", articlesRouter);
routes.use("/teacher", teacherRouter);

routes.get("/", (req, res) => {
    sendData(res);
});


export default routes;