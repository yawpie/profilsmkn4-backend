import {Router} from "express";
import add from "./addMajors";
import get from "./getMajors";
import remove from "./deleteMajors";
import update from "./updateMajors";


const router = Router();

router.use(add)
router.use(get)
router.use(remove)
router.use(update)


export default router;