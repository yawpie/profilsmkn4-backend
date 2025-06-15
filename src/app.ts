import express from 'express';
import routes from './routes/routes';
// import prismaErrorHandler from "./middleware/prismaErrorHandler";
import cookieParser from "cookie-parser";



const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", routes);
// app.use(prismaErrorHandler);



export default app;