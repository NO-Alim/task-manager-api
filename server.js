import app from "./app.js";
import { dbConnect } from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 3000;

dbConnect()
  .then(() => {
    app.listen(port, () => {
    });
  })
  .catch((error) => {
  });
