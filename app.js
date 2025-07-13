import express from "express";
import notFound from "./middlewares/not-found.js";
import errorHandler from "./middlewares/errorHandler.js";
import taskRouter from "./routes/task.route.js";

const app = express();

app.use(express.json());

app.use("/api/tasks", taskRouter);

//404
app.use(notFound);

app.use(errorHandler);
export default app;
