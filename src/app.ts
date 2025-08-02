import express, { Response } from 'express';
import routes from './routes/routes';
import cookieParser from "cookie-parser";
import cors from 'cors';
import { sendError } from './utils/send';
import { AuthRequest } from './types/auth';
import multer from 'multer';
import { multerErrorHandler } from './errorHandler/multerError';


const app = express();

const allowedOrigins = [
  'http://localhost:3001',
  'http://localhost:3000',
  'http://192.168.1.15:3000',             // local dev
  /^http:\/\/192\.168\.1\.\d{1,3}:3000$/, // all IPs in 192.168.236.x:3000 range
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser tools like Postman

    // Match string or RegExp patterns
    const isAllowed = allowedOrigins.some(o =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", routes);
app.use(multerErrorHandler);




export default app;