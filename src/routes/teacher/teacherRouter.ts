// Todo last: tambahkan teacher router

import { Router } from "express";
import addTeacher from "./addTeacher";
import editTeacher from "./editTeacher";
import getTeacher from "./getTeacher";
import removeTeacher from "./removeTeacher";


const teacherRouter = Router();
teacherRouter.use(getTeacher);
teacherRouter.use(addTeacher);
teacherRouter.use(editTeacher);
teacherRouter.use(removeTeacher)


export default teacherRouter;