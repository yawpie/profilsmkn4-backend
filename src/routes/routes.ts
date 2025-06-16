import { Router } from "express";
import GeneralResponse from "../utils/generalResponse";


import testApi from "./testApi";
import authRoute from "./auth/authRouter";
import publicArticle from "./articles/publicArticles";
import articlesRouter from "./articles/articlesRouter";

const routes = Router();

routes.use("/", authRoute);
routes.use("/test", testApi);
// articles route
// routes.use("/articles", publicArticle);
routes.use("/articles", articlesRouter);


// routes.use("/add-article", addArticles);
// routes.use("/add-category", addCategory);

routes.get("/", (req, res) => {
    res.send(GeneralResponse.defaultResponse()).status(200);
});


export default routes;