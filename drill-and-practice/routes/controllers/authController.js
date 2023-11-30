import { validasaur } from "../../deps.js";
import * as userService from "../../services/userService.js";

const showLoginForm = ({ render }) => {
    render("login.eta", { title: "Drill and Practice Login", errors: [], email: ""  });
};

const showRegistrationForm = ({ render }) => {
    render("register.eta", { title: "Drill and Practice Register", errors: [], email: "" });
};

const postRegistrationForm = async ({ request, response, render }) => {
    const body = request.body({ type: "form"});
    const params = await body.value;
    const email = params.get("email");
    const password = params.get("password");

    const data = {
        email: email,
        password: password
    }

    const validationRules = {
        email: [validasaur.required, validasaur.isEmail],
        password: [validasaur.required, validasaur.minLength(4)]
    };

    const [passes, errors] = await validasaur.validate(data, validationRules);


    if (!passes) {
        render("register.eta", { title: "Drill and Practice Register", errors: errors, email: email });
        return;
    } else {
      const databaseResponse = await userService.tryToRegister(data);
      if (databaseResponse.success) {
        response.redirect("/auth/login");
      } else {
        render("register.eta", { title: "Drill and Practice Register", errors: { account: { email: databaseResponse.error } }, email: email });
      }
    }
};

const postLoginForm = async ({ request, state, render, response }) => {
  const body = request.body({ type: "form"});
  const params = await body.value;
  const email = params.get("email");
  const password = params.get("password");

  const data = {
    email: email,
    password: password
  }

  const loginAttempt = await userService.tryToLogin(data);
  if (loginAttempt.success) {
    await state.session.set("authenticated", true);
    await state.session.set("user", { email: email, admin: loginAttempt.admin });
    response.redirect("/");
  } else {
    render("login.eta", { title: "Drill and Practice Login", errors: { account: { account: "The email or password is incorrect" } }, email: email });
  }

};

const logout = async ({ response, state }) => {
  await state.session.set("authenticated", false);
  await state.session.set("user", null);
  response.redirect("/");
}


export { showLoginForm, showRegistrationForm, postRegistrationForm, postLoginForm, logout }