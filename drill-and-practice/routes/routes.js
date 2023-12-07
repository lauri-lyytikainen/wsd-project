import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as authController from "./controllers/authController.js";
import * as topicController from "./controllers/topicController.js";
import * as questionController from "./controllers/questionController.js";
import * as optionController from "./controllers/optionController.js";
import * as quizController from "./controllers/quizController.js";

const router = new Router();

router.get("/", mainController.showMain);

router.get("/auth/login", authController.showLoginForm);
router.post("/auth/login", authController.postLoginForm);
router.get("/auth/register", authController.showRegistrationForm);
router.post("/auth/register", authController.postRegistrationForm);
router.get("/auth/logout", authController.logout);

router.get("/topics", topicController.showTopics);
router.post("/topics", topicController.postNewTopic);
router.get("/topics/:id", topicController.showTopic);
router.post("/topics/:id/delete", topicController.removeTopic);
router.post("/topics/:id/questions", questionController.postNewQuestion);
router.get("/topics/:id/questions/:qId", questionController.showQuestion);
router.post("/topics/:id/questions/:qId/options", optionController.postNewOption);
router.post("/topics/:id/questions/:qId/options/:oId/delete", optionController.removeOption);
router.post("/topics/:id/questions/:qId/delete", questionController.removeQuestion);

router.get("/quiz", quizController.showQuizPage);
router.get("/quiz/:tId", quizController.selectRandomQuestion);
router.get("/quiz/:tId/questions/:qId", quizController.showQuizQuestion);
router.get("/quiz/:tId/questions/:qId/:answer", quizController.showAnswer);
router.post("/quiz/:tId/questions/:qId/options/:oId", quizController.answerQuestion);

export { router };
