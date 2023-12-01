import { sql } from '../database/database.js';
import { validasaur } from "../deps.js";

const getTopics = async () => {
    const res = await sql`
        SELECT * FROM topics ORDER BY name ASC
    `;
    return res;
}

const getTopic = async (id) => {
    const res = await sql`
        SELECT * FROM topics WHERE id = ${id}
    `;
    return res[0];
};

const addNewTopic = async (name, userId) => {

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
        INSERT INTO topics (name, user_id) VALUES (${name}, ${userId})
    `;
    return { success: true };
};

const deleteTopic = async (id) => {
 
    // Delete the answers with the topic id
    await sql`
        DELETE FROM question_answers WHERE question_id IN (SELECT id FROM questions WHERE topic_id = ${id})
    `;

    // Delete the answer options with the topic id  
    await sql`
        DELETE FROM question_answer_options WHERE question_id IN (SELECT id FROM questions WHERE topic_id = ${id})
    `;

    // Delete the questions with the topic id
    await sql`
        DELETE FROM questions WHERE topic_id = ${id}
    `;

    // Delete the topic with the id
    await sql`
        DELETE FROM topics WHERE id = ${id}
    `;
}



export { getTopics, getTopic, addNewTopic, deleteTopic };