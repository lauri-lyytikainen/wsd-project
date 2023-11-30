import { sql } from '../database/database.js';

const getTopics = async () => {
    const res = await sql`
        SELECT * FROM topics
    `;
    return res;
}