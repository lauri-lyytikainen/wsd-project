import { getTopicCount } from "../../services/topicService.js";
import { getQuestionCount, getAnswerCount } from "../../services/questionService.js";

const showMain = async ({ render }) => {

    const data = {
      title: "Drill and Practice",
      topicCount: await getTopicCount(),
      questionCount: await getQuestionCount(),
      answerCount: await getAnswerCount(),
    };

  render("main.eta", data);
};

export { showMain };
