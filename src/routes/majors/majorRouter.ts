import {Router} from "express";
import add from "./addMajors";
import get from "./getMajors";
import remove from "./deleteMajors";
import update from "./updateMajors";
import updateImage from "./updateMajorImage";
import addImage from "./addMajorImageGallery";
import removeImage from "./deleteMajorsImage";

const router = Router();

router.use(add)
router.use(get)
router.use(remove)
router.use(update)
router.use(updateImage)
router.use(addImage)
router.use(removeImage)

export default router;