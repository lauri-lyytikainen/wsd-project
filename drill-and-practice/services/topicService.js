import { sql } from '../database/database.js';
import { validasaur } from "../deps.js";

const getTopics = async () => {
    const res = await sql`
        SELECT * FROM topics ORDER BY name ASC
    `;
    return res;
}

const addNewTopic = async (name) => {

    const validationRules = {
        name: [validasaur.required, validasaur.minLength(1)],
    };
    const [passes, errors] = await validasaur.validate({ name }, validationRules);
    if (!passes) {
        return { success: false, errors: errors };
    }

    // Check that the topic does not already exist

    const existingTopics = await sql`
        SELECT * FROM topics WHERE name = ${name}
    `;

    if (existingTopics.length > 0) {
        return { success: false, errors: { database: { name: "The topic already exists." }} };
    }

    // Add the new topic to the database
    await sql`
        INSERT INTO topics (name) VALUES (${name})
    `;
    return { success: true };
};

export { getTopics, addNewTopic };