import { getTopics, addNewTopic } from "../../services/topicService.js";

const showTopics = async ({ render, state }) => {

  const user = await state.session.get("user");

  const data = {
      topics: await getTopics(),
      title: "Topics",
      isAdmin: user.admin,
      name: ""
  };

    render("topics.eta", data);
};
  
const postNewTopic = async ({ request, state, response, render }) => {

  // Check that the user is an admin
  const user = await state.session.get("user");
  if (!user || !user.admin) {
    response.redirect("/topics");
  }

  const body = request.body({ type: "form"});
  const params = await body.value;
  const name = params.get("name");


  // Add the new topic to the database
  const databaseResponse = await addNewTopic(name);
  if (databaseResponse.success) {
    response.redirect("/topics");
  } else {
    const data = {
      topics: await getTopics(),
      title: "Topics",
      errors: databaseResponse.errors,
      name: name,
      isAdmin: user.admin
    };
    render("topics.eta", data);
  }

};

export { showTopics, postNewTopic };
  