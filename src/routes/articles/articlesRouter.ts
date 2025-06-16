import { Router } from "express";
import add from "./addArticles";
import update from "./editArticle";
import remove from "./deleteArticle";
import addCategory from "./addCategory";
import get from "./publicArticles";

const articlesRouter = Router();

articlesRouter.use("/add", add);
articlesRouter.use("/edit", update);
articlesRouter.use("/delete", remove);
articlesRouter.use("/add-category", addCategory);
articlesRouter.use("/get", get);


export default articlesRouter;
