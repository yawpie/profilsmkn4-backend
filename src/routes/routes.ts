import { Router } from "express";
import GeneralResponse from "../utils/generalResponse";

import auth from "./auth/auth";
import testApi from "./testApi";
import register from "./auth/register"
import publicArticle from "./articles/publicArticles"
import addArticles from "./articles/addArticles";
import addCategory from "./articles/addCategory";

const routes = Router();

routes.use("/login", auth);
routes.use("/test", testApi);
routes.use("/register", register);
// articles route
routes.use("/articles", publicArticle);
routes.use("/add-article", addArticles);
routes.use("/add-category", addCategory);

routes.get("/", (req, res) => {
    res.send(GeneralResponse.defaultResponse()).status(200);
});


export default routes;