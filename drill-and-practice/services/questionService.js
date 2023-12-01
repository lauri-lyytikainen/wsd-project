import { sql } from '../database/database.js';
import { validasaur } from "../deps.js";

const addQuestion = async (question, topicId, userId) => {

    const validationRules = {
        question: [validasaur.required, validasaur.minLength(1)],
    };
    const [passes, errors] = await validasaur.validate({ question }, validationRules);
    if (!passes) {
        return { success: false, errors: errors };
    }

    await sql`
        INSERT INTO questions (question_text, topic_id, user_id) VALUES (${question}, ${topicId}, ${userId})
    `;

    return { success: true, errors: errors }
};

const getAllQuestions = async (topicId) => {
    const res = await sql`
        SELECT * FROM questions WHERE topic_id = ${topicId}
    `;
    return res;
};

export { addQuestion, getAllQuestions }