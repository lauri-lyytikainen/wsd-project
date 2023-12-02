import { addOption, getAllOptions, deleteOption } from "../../services/optionService.js";
import { getQuestion } from "../../services/questionService.js";


const postNewOption = async ({ request, state, response, render }) => {
    const user = await state.session.get("user");
    if (!user) {
      response.redirect("/topics");
      return;
    }
  
    const topicId = request.url.pathname.split("/")[2];
    const questionId = request.url.pathname.split("/")[4];
  
    const question = await getQuestion(questionId);

    const body = request.body({ type: "form"});
    const params = await body.value;
    const option = params.get("option_text");
    const isCorrect = params.get("is_correct") != undefined ? true : false;
  
    const databaseResponse = await addOption(questionId, option, isCorrect);
  
    if (!databaseResponse.success) {
        const data = {
            title: question.question_text,
            errors: databaseResponse.errors,
            topicId: topicId,
            questionId: questionId,
            isCorrect: isCorrect,
            options: await getAllOptions(questionId),
        };    
        render("question.eta", data);
        return;
    } else {
        response.redirect("/topics/" + topicId +"/questions/" + questionId);
        return;
    }
};

const removeOption = async ({ request, state, response }) => {
    const user = await state.session.get("user");
    if (!user) {
      response.redirect("/topics");
      return;
    }
  
    const topicId = request.url.pathname.split("/")[2];
    const questionId = request.url.pathname.split("/")[4];
    const optionId = request.url.pathname.split("/")[6];
  
    // Remove the topic from the database
    await deleteOption(optionId);
  
    response.redirect("/topics/" + topicId + "/questions/" + questionId);
    return;
  };

export { postNewOption, removeOption }