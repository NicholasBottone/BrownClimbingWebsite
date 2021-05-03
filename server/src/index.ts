import express from "express";
import session from "express-session";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

// main function
const main = () => {
  const app = express();

  // express session setup
  app.use(
    session({
      name: "default cookie",
      secret: "random secret",
      saveUninitialized: false,
      resave: false,
    })
  );

  app.listen(process.env.PORT || 8080, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
};
main();
