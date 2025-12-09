import express, { Response } from "express";
import routes from "./routes/routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
// import addSlide from "./routes/slides/addSlide";
import { multerErrorHandler } from "./errorHandler/multerError";
import path from "path/win32";

const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, "docs-openapi.yaml"));


const allowedOrigins = [
  "http://localhost:3001",
  "http://localhost:3000",
  "http://192.168.1.13:3000", // local dev
  /^http:\/\/192\.168\.1\.\d{1,3}:3000$/, // all IPs in 192.168.236.x:3000 range
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow non-browser tools like Postman

      // Match string or RegExp patterns
      const isAllowed = allowedOrigins.some((o) =>
        typeof o === "string" ? o === origin : o.test(origin)
      );

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
  })
);
// app.use("/slides", addSlide);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/", routes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(multerErrorHandler);

export default app;
