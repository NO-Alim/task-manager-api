import app from "./app.js";
import { dbConnect } from "./config/db.js";

const port = process.env.PORT || 3000;

dbConnect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
