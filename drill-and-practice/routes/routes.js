import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as authController from "./controllers/authController.js";
import * as topicController from "./controllers/topicController.js";

const router = new Router();

router.get("/", mainController.showMain);
router.get("/auth/login", authController.showLoginForm);
router.post("/auth/login", authController.postLoginForm);
router.get("/auth/register", authController.showRegistrationForm);
router.post("/auth/register", authController.postRegistrationForm);
router.get("/auth/logout", authController.logout);
router.get("/topics", topicController.showTopics);

export { router };
