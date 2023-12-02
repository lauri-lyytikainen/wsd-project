import { sql } from '../database/database.js';
import { validasaur } from "../deps.js";

const addOption = async (questionId, optionText, isCorrect) => {

    const validationRules = {
        optionText: [validasaur.required, validasaur.minLength(1)],
    };
    const [passes, errors] = await validasaur.validate({ optionText }, validationRules);
    if (!passes) {
        return { success: false, errors: errors };
    }

    await sql`
        INSERT INTO question_answer_options (question_id, option_text, is_correct) VALUES (${questionId}, ${optionText}, ${isCorrect})
    `;

    return { success: true, errors: errors }
};

const getAllOptions = async (questionId) => {
    const res = await sql`
        SELECT * FROM question_answer_options WHERE question_id = ${questionId}
    `;
    return res;
};

const deleteOption = async (optionId) => {
    await sql`
        DELETE FROM question_answer_options WHERE id = ${optionId}
    `;
    // delete also the answers for this option
    await sql`
        DELETE FROM question_answers WHERE question_answer_option_id = ${optionId}
    `;
};


export { addOption, getAllOptions, deleteOption }