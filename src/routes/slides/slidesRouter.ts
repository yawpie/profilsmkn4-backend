import { Router } from "express";
import addSlide from "./addSlide";
import getSlides from "./getSlides";
import editSlide from "./editSlide";
import deleteSlide from "./deleteSlide";

const slidesRouter = Router();

slidesRouter.use("/", getSlides);
slidesRouter.use("/", addSlide);
slidesRouter.use("/", editSlide);
slidesRouter.use("/", deleteSlide);

export default slidesRouter;
