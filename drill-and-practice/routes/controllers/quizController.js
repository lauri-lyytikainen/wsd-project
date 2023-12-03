import { getAllQuestions, getQuestion } from "../../services/questionService.js";
import { getTopics } from "../../services/topicService.js";
import { getQuestionOptions, saveAnswer, checkAnswer } from "../../services/optionService.js";

const showQuizPage = async ({ render }) => {
    const data = {
        title: "Quiz",
        topics: await getTopics(),
    };

    render("quiz.eta", data);
};

const selectRandomQuestion = async ({ request, response }) => {
    const tId = request.url.pathname.split("/")[2];
    const questions = await getAllQuestions(tId);
    const randomQuestionId = questions.length > 0 ? questions[Math.floor(Math.random() * questions.length)].id : -1;

    response.redirect("/quiz/" + tId + "/questions/" + randomQuestionId);
};

const showQuizQuestion = async ({ render, request }) => {
    const tId = request.url.pathname.split("/")[2];
    const qId = request.url.pathname.split("/")[4];

    const question = qId != -1 ? await getQuestion(qId) : null;
    const answerOptions = await getQuestionOptions(qId);

    const data = {
        title: "Quiz",
        question: question,
        answerOptions: answerOptions,
        topicId: tId,
        questionId: qId,
    };

    render("quizQuestion.eta", data);
};

const answerQuestion = async ({ request, response, state }) => {

    const user = await state.session.get("user");

    const tId = request.url.pathname.split("/")[2];
    const qId = request.url.pathname.split("/")[4];
    const oId = request.url.pathname.split("/")[6];

    await saveAnswer(qId, oId, user.id);
    
    const answer = await checkAnswer(qId, oId);
    const path = answer ? "/correct" : "/incorrect";

    response.redirect("/quiz/" + tId + "/questions/" + qId + path);

};

const showAnswer = async ({ render, request }) => {
    const tId = request.url.pathname.split("/")[2];
    const qId = request.url.pathname.split("/")[4];
    const answer = request.url.pathname.split("/")[5];

    const answerOptions = await getQuestionOptions(qId);
    const correctAnswer = answerOptions.filter(o => o.is_correct)[0];
    

    const data = {
        title: "Answer",
        topicId: tId,
        questionId: qId,
        answerWasTrue: answer == "correct" ? true : false, 
        correctAnswer: correctAnswer.option_text,
    };

    render("answer.eta", data);
};

export { showQuizPage, showQuizQuestion, selectRandomQuestion, answerQuestion, showAnswer };