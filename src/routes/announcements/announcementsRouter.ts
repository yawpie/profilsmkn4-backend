import {Router} from "express";
import add from "./addAnnouncements";
import get from "./getAnnouncements";
import remove from "./deleteAnnouncements";
import update from "./updateAnnouncements";


const router = Router();

router.use(add)
router.use(get)
router.use(remove)
router.use(update)


export default router;