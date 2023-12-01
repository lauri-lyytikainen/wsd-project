import { getTopics, addNewTopic, deleteTopic} from "../../services/topicService.js";

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
    return;
  }

  const body = request.body({ type: "form"});
  const params = await body.value;
  const name = params.get("name");


  // Add the new topic to the database
  const databaseResponse = await addNewTopic(name);
  if (databaseResponse.success) {
    response.redirect("/topics");
    return;
  } else {
    // Database call failed, show the form again with an error message
    const data = {
      topics: await getTopics(),
      title: "Topics",
      errors: databaseResponse.errors,
      name: name,
      isAdmin: user.admin
    };
    render("topics.eta", data);
    return;
  }
};

const removeTopic = async ({ request, state, response }) => {
  // Check that the user is an admin
  const user = await state.session.get("user");
  if (!user || !user.admin) {
    response.redirect("/topics");
    return;
  }

  // Get the topic id from the request address

  const id = request.url.pathname.split("/")[2];

  // Delete the topic from the database
  await deleteTopic(id);
  response.redirect("/topics");
  return;
};

export { showTopics, postNewTopic, removeTopic };
  