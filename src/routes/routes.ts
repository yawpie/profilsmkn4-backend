import { Router } from "express";
import authRoute from "./auth/authRouter";
import articlesRouter from "./articles/articlesRouter";
import teacherRouter from "./teacher/teacherRouter";
import tagsRouter from "./tags/tagsRouter";
import facilitiesRouter from "./facilities/facilityRouter";
import announcementRouter from "./announcements/announcementsRouter";
import majorsRouter from "./majors/majorRouter";
import extraRouter from "./extracurriculars/eskulRouter";
import slidesRouter from "./slides/slidesRouter";
import achievementsRouter from "./achievements/achievementsRouter";
import totalsRouter from "./stats/totals";
import { sendData } from "../utils/send";

const routes = Router();

routes.use("/", authRoute);
routes.use("/tags", tagsRouter);
routes.use("/articles", articlesRouter);
routes.use("/teachers", teacherRouter);
routes.use("/facilities", facilitiesRouter);
routes.use("/extracurriculars", extraRouter);
routes.use("/announcement", announcementRouter);
routes.use("/majors", majorsRouter);
routes.use("/slides", slidesRouter);
routes.use("/achievements", achievementsRouter);
routes.use("/stats", totalsRouter);

routes.get("/", (req, res) => {
  sendData(res);
});

export default routes;
