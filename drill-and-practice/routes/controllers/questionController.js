import { addQuestion, getAllQuestions, getQuestion } from "../../services/questionService.js";
import { getTopic } from "../../services/topicService.js";

const postNewQuestion = async ({ request, state, response, render }) => {
    const user = await state.session.get("user");
    if (!user) {
      response.redirect("/topics");
      return;
    }
  
    const id = request.url.pathname.split("/")[2];
    const userId = user.id;
  
    const body = request.body({ type: "form"});
    const params = await body.value;
    const question = params.get("question_text");
    const questions = await getAllQuestions(id);

    const topic = await getTopic(id);

    const databaseResponse = await addQuestion(question, id, userId);
  
    if (!databaseResponse.success) {
        const data = {
            title: topic.name,
            topicId: id,
            question: question,
            questions: questions,
            errors: databaseResponse.errors,
        };    
        render("topic.eta", data);
        return;
    } else {
        response.redirect("/topics/" + id);
        return;
    }
};

const showQuestion = async ({ render, request, response, state }) => {
    const user = await state.session.get("user");
    if (!user) {
      response.redirect("/topics");
      return;
    }
  
    const qId = request.url.pathname.split("/")[4];
    const question = await getQuestion(qId);
  
    const data = {
      title: question.question_text,
      question: question,
      errors: [],
    };
  
    render("question.eta", data);
}

export { postNewQuestion, showQuestion }