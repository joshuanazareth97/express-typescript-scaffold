import express from "express";
import helmet from "helmet";
import * as httpErrors from "http-errors";
import Config from "./config/config";
import { rootRouter } from "./modules";
import compression from "compression";
import cookieParser from "cookie-parser";
import dbConfig from "./config/dbConfig";
import { createConnection } from "typeorm";

const app = express();

app.use(cookieParser());
app.use(compression());
app.use(express.json());
app.use(helmet());

app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.setHeader(
      "Content-Security-Policy",
      "style-src 'unsafe-inline' 'self' 'unsafe-eval';"
    );
    res.setHeader(
      "X-Content-Security-Policy",
      "style-src 'unsafe-inline' 'self' 'unsafe-eval';"
    );
    next();
  }
);
app.disable("x-powered-by");

app.use("/api/", rootRouter);

// catch 404 and forward to error handler
// app.use(
//   (req: express.Request, res: express.Response, next: express.NextFunction) => {
//     next(httpErrors[404]);
//   }
// );

const startServer = (PORT: any) =>
  app
    .listen(PORT)
    .on("listening", () => {
      console.log("Server is listening ", PORT, app.get("env"));
    })
    .on("error", (e: any) => {
      if (e === "EADDRINUSE") {
        console.log(`The Port: ${PORT} is Already in Use`);
      }
    });

createConnection(dbConfig as any)
  .then(async (connection) => {
    console.log("Database connection successfull.");
    await connection.runMigrations();
    // await connection.queryResultCache.clear();
    startServer(Config.port || "8080");
  })
  .catch((error) => console.log("TypeORM Connection error: ", error));

app.get("/", (req, res) => {
  res.send("Server is running");
});
// app.listen(Config.port, () => {
//   console.log(`Express with Typescript! http://localhost:${Config.port}`);
// });
