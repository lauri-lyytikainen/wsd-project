import { sql } from '../database/database.js';
import { bcrypt } from '../deps.js';

const tryToRegister = async (data) => {

    const existingUsers = await sql`
        SELECT * FROM users WHERE email = ${data.email}
    `;

    if (existingUsers.length > 0) {
        return {
            success: false,
            error: "The email is already registered."
        };
    }

    const hash = await bcrypt.hash(data.password);

    await sql`
        INSERT INTO users (email, password) VALUES (${data.email}, ${hash})
    `;

    return {
        success: true,
        error: null
    };

};

const tryToLogin = async (data) => {

    const existingUsers = await sql`
        SELECT * FROM users WHERE email = ${data.email}
    `;

    if (existingUsers.length === 0) {
        return {success: false, admin: false};
    }

    const user = existingUsers[0];

    const hash = user.password;

    const passwordCorrect = await bcrypt.compare(data.password, hash);

    if (!passwordCorrect) {
        return {success: false, admin: false};
    }

    return {success: true, admin: user.admin, id: user.id};
};


export { tryToRegister, tryToLogin };