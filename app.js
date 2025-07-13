import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import errorHandler from "./middlewares/errorHandler.js";
import notFound from "./middlewares/not-found.js";
import taskRouter from "./routes/task.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/tasks", taskRouter);

//404
app.use(notFound);

app.use(errorHandler);
export default app;
