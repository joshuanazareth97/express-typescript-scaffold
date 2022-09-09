import { Router } from "express";
import { usersRouter } from "./users";

const router = Router();

router.use("/v1/users", usersRouter);

export { router as rootRouter };
