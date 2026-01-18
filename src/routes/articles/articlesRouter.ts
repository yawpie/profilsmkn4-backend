import { Router } from "express";
import add from "./addArticles";
import update from "./editArticle";
import remove from "./deleteArticle";
import addCategory from "../tags/addTags";
import get from "./publicArticles";

const articlesRouter = Router();

articlesRouter.use("/", add);
articlesRouter.use("/", update);
articlesRouter.use("/", remove);
articlesRouter.use("/", addCategory);
articlesRouter.use("/", get);

export default articlesRouter;
