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

const getQuestion = async (questionId) => {
    const res = await sql`
        SELECT * FROM questions WHERE id = ${questionId}
    `;
    return res[0];
};

const deleteQuestion = async (questionId) => {
    await sql`
        DELETE FROM questions WHERE id = ${questionId}
    `;
    // delete also the answers for this question
    await sql`
        DELETE FROM question_answers WHERE question_id = ${questionId}
    `;

    await sql`
        DELETE FROM question_answer_options WHERE question_id = ${questionId}
    `;
};

const getQuestionCount = async () => {
    const res = await sql`
        SELECT COUNT(*) FROM questions
    `;
    return res[0].count;
};

const getAnswerCount = async () => {
    const res = await sql`
        SELECT COUNT(*) FROM question_answers
    `;
    return res[0].count;
};

const getRandomQuestion = async () => {
    const dbResponse = await sql`
        SELECT id, question_text FROM questions ORDER BY RANDOM() LIMIT 1
    `;

    const question = dbResponse[0];

    if (!question) {
        return {};
    }
    const answerOptions = await sql`
        SELECT id, option_text FROM question_answer_options WHERE question_id = ${question.id}
    `;

    return {
        question,
        answerOptions
    }
    
};

export { addQuestion, getAllQuestions, getQuestion, deleteQuestion, getQuestionCount, getAnswerCount, getRandomQuestion }