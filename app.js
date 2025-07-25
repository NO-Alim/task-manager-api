import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import errorHandler from "./middlewares/errorHandler.js";
import notFound from "./middlewares/not-found.js";
import taskRouter from "./routes/task.routes.js";
import authRoute from "./routes/auth.routes.js"
import userRoute from './routes/user.routes.js';
import helmet from "helmet";
import cors from 'cors';
import sanitizeRequest from "./middlewares/sanitizeRequest.js";
import protectRoute from "./middlewares/authMiddleware.js";
import rateLimit from 'express-rate-limit';
import cookieParser from "cookie-parser";
import authorizeRole from "./middlewares/authorizeRole.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cookieParser());
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            // You might need to add other directives like styleSrc, imgSrc, etc.
        },
    },
}));

const corsOptions = {
    origin: ['http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
}
app.use(cors(corsOptions));

// Parses incoming JSON payloads
app.use(express.json({limit: '10kb'}));
//Parses URL-encoded data 
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(sanitizeRequest)


// rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Max 100 requests per IP per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use('/api', limiter)


// ------------------ Front End
app.use(express.static(path.join(__dirname, "public")));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'))
})
// ----------------------------- BackEnd

app.use('/api/auth', authRoute);
// logedIn User Only
app.use("/api/tasks", protectRoute, taskRouter);
// admin Only
app.use('/api/user',protectRoute, authorizeRole('admin'), userRoute)
//404
app.use(notFound);

app.use(errorHandler);
export default app;
