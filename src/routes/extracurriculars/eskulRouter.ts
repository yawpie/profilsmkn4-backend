import {Router} from "express";
import add from "./addEskul";
import get from "./getEskul";
import remove from "./deleteEskul";
import update from "./updateEskul";


const router = Router();

router.use(add)
router.use(get)
router.use(remove)
router.use(update)


export default router;