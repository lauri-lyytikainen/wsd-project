const { test, expect, request } = require("@playwright/test");

test("Main page has expected title and links.", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Drill and Practice");
  await expect(page.getByRole("link", { name: "Topic" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Quiz" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Login" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Register" })).toBeVisible();
});

test("Topic and Quiz pages cant be accessed without logging in.", async ({ page }) => {
    
    // Try to access topic and quiz pages without logging in
    await page.goto("/topics");
    await expect(page).toHaveTitle("Drill and Practice Login");
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
    await page.goto("/quiz");
    await expect(page).toHaveTitle("Drill and Practice Login");
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
});

test("Topic and Quiz pages can be accesseed while logged in", async ({ page }) => {
    
    // Login using admin credentials
    await page.goto("/auth/login");
    await page.getByPlaceholder("Email").fill("admin@admin.com");
    await page.getByPlaceholder("Password").fill("123456");
    await page.click("button:has-text('Login')");
    await expect(page).toHaveTitle("Topics");
    
    // Check that we can now access the topic and quiz pages
    await page.goto("/topics");
    await expect(page).toHaveTitle("Topics");
    await expect(page.getByRole("heading", { name: "Topics" })).toBeVisible();
    await page.goto("/quiz");
    await expect(page).toHaveTitle("Quiz");
    await expect(page.getByRole("heading", { name: "Choose topic" })).toBeVisible();
});

test("Registering a new user works", async ({ page }) => {
    
    // Register a new user
    await page.goto("/auth/register");
    
    const email = Math.random().toString(36).slice(-8) + "@test.com";
    const password = Math.random().toString(36).slice(-8);
    
    await page.getByPlaceholder("Email").fill(email);
    await page.getByPlaceholder("Password").fill(password);
    await page.click("button:has-text('Register')");
    
    // Now try to login with the new user
    await page.goto("/auth/login");
    await page.getByPlaceholder("Email").fill(email);
    await page.getByPlaceholder("Password").fill(password);
    await page.click("button:has-text('Login')");
    await expect(page).toHaveTitle("Topics");
    await expect(page.getByRole("link", { name: email })).toBeVisible();
});

test("Logging out works", async ({ page }) => {
    // Login using admin credentials
    await page.goto("/auth/login");
    await page.getByPlaceholder("Email").fill("admin@admin.com");
    await page.getByPlaceholder("Password").fill("123456");
    await page.click("button:has-text('Login')");
    await expect(page).toHaveTitle("Topics");
    await expect(page.getByRole("link", { name: "admin@admin.com" })).toBeVisible();
    await page.getByText("Logout").click();
    await expect(page.getByRole("link", { name: "Login" })).toBeVisible();
});

test("Creating a new topic works", async ({ page }) => {
    // Login using admin credentials
    await page.goto("/auth/login");
    await page.getByPlaceholder("Email").fill("admin@admin.com");
    await page.getByPlaceholder("Password").fill("123456");
    await page.click("button:has-text('Login')");
    
    // Create a new topic
    await page.goto("/topics");
    const randomName = Math.random().toString(36).slice(-8);
    await page.getByPlaceholder("Name").fill(randomName);
    await page.click("button:has-text('Add')");
    
    // Check that the topic was created
    await page.goto("/topics");
    await expect(page).toHaveTitle("Topics");
    await expect(page.getByRole("link", { name: randomName })).toBeVisible();
});

test("Creating a new question works", async ({ page }) => {
    // Login using admin credentials
    await page.goto("/auth/login");
    await page.getByPlaceholder("Email").fill("admin@admin.com");
    await page.getByPlaceholder("Password").fill("123456");
    await page.click("button:has-text('Login')");
    
    // Create a new topic
    await page.goto("/topics");
    const randomName = Math.random().toString(36).slice(-8);
    await page.getByPlaceholder("Name").fill(randomName);
    await page.click("button:has-text('Add')");
    
    // Create a new question
    await page.goto("/topics");
    await page.getByRole("link", { name: randomName }).click();
    
    const randomQuestion = Math.random().toString(36).slice(-8);
    await page.getByPlaceholder("Question").fill(randomQuestion);
    await page.click("button:has-text('Add')");
    
    // Check that the question was created
    await expect(page.getByRole("link", { name: randomQuestion })).toBeVisible();
    
});

test("Api should respond with a question", async ({ page, request }) => {
    // Expect /api/questions/random to return an empty object
    const response = await request.get("/api/questions/random");
    await expect(response.status()).toBe(200);
    const json = await response.json()
    await expect(json.questionText).toBeDefined();
});

test("Trying to register with an existing email should fail", async ({ page }) => {

    // Register a new user
    await page.goto("/auth/register");

    const email = Math.random().toString(36).slice(-8) + "@test.com";
    const password = Math.random().toString(36).slice(-8);

    await page.getByPlaceholder("Email").fill(email);
    await page.getByPlaceholder("Password").fill(password);
    await page.click("button:has-text('Register')");

    // Try to register with the same email
    await page.goto("/auth/register");
    await page.getByPlaceholder("Email").fill(email);
    await page.getByPlaceholder("Password").fill(password);
    await page.click("button:has-text('Register')");
    await expect(page).toHaveTitle("Drill and Practice Register");
    await expect(page.getByText("The email is already registered")).toBeVisible();
});    

test("Trying to login with an incorrect password should fail", async ({ page }) => {

    // Login using invalid credentials  
    await page.goto("/auth/login");
    const randomEmail = Math.random().toString(36).slice(-8) + "@test.com";
    const randomPassword = Math.random().toString(36).slice(-2);
    await page.getByPlaceholder("Email").fill(randomEmail);
    await page.getByPlaceholder("Password").fill(randomPassword);
    await page.click("button:has-text('Login')");
    await expect(page).toHaveTitle("Drill and Practice Login");
    await expect(page.getByText("The email or password is incorrect")).toBeVisible();

});