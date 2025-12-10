import { Router } from "express";
import addAchievement from "./addAchievement";
import getAchievements from "./getAchievements";
import editAchievement from "./editAchievement";
import deleteAchievement from "./deleteAchievement";

const achievementsRouter = Router();

achievementsRouter.use("/", getAchievements);
achievementsRouter.use("/", addAchievement);
achievementsRouter.use("/", editAchievement);
achievementsRouter.use("/", deleteAchievement);

export default achievementsRouter;
