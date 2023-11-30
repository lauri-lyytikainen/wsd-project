import { getTopics } from "../../services/topicService.js";

const showTopics = async ({ render, state }) => {

  const user = await state.session.get("user");

  const data = {
      topics: await getTopics(),
      title: "Topics",
      isAdmin: user.admin
  };

    render("topics.eta", data);
  };
  
export { showTopics };
  