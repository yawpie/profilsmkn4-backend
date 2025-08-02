import {Router} from "express";
import addFacility from "./addFacility";
import getFacility from "./getFacility";
import deleteFacility from "./deleteFacility";
import updateFacility from "./updateFacility";


const router = Router();

router.use(addFacility)
router.use(getFacility)
router.use(deleteFacility)
router.use(updateFacility)


export default router;