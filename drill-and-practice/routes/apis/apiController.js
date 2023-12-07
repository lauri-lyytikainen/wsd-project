import { getRandomQuestion } from "../../services/questionService.js";
import { checkAnswer } from "../../services/optionService.js";

const returnRandomQuestion = async ({ response }) => {
    const dbResponse = await getRandomQuestion();

    if (dbResponse.question === undefined) {
        response.body = {};
        return;
    }

    const options = [];
    dbResponse.answerOptions.forEach((option) => {
        options.push({
            optionId: option.id,
            optionText: option.option_text,
        });
    });

    const body = {
        questionId: dbResponse.question.id,
        questionText: dbResponse.question.question_text,
        answerOptions: options,
    }

    response.body = body;   
};

const returnAnswer = async ({ request, response }) => {
    const body = request.body({ type: "json" });
    const params = await body.value;

    if (!params) {
        response.body = {
            "correct": false
        };
        return;
    }

    const qId = params.questionId;
    const oId = params.optionId;

    if (!qId || !oId) {
        response.body = {
            "correct": false
        };
        return;
    }

    const correct = await checkAnswer(qId, oId);

    response.body = {
        "correct": correct
    };
};

export { returnRandomQuestion, returnAnswer };