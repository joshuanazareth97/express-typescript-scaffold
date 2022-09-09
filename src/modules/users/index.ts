import * as express from "express";
import { validateUser } from "../authentication/authenticate";
const router = express.Router();
import * as usersController from "./user.handler";

router.get("", validateUser, usersController.getAll);
router.post("/register", usersController.register);
router.post("/login", usersController.login);
router.get("/verify", usersController.verifyUser);
router.get("/forget-password", usersController.forgetPassword);
router.post("/change-password", validateUser, usersController.changePassword);

export { router as usersRouter };
