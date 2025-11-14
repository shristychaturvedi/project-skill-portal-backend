
import db from '../config/db.js';

export const getAllQuestions = async () => {
    try {
        const [rows] = await db.execute('SELECT questions.*, skill_categories.name as skill FROM questions JOIN skill_categories ON questions.skill_id = skill_categories.id;');
        console.log(rows);
        return rows;

    } catch (err) {
        throw err;
    }
};

export const createQuestion = async ({ skill_id, question_text, option_a, option_b, option_c, option_d, correct_answer }) => {
    try {
        const [result] = await db.execute(
            'INSERT INTO questions(skill_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES(?,?,?,?,?,?,?)',
            [skill_id, question_text, option_a, option_b, option_c, option_d, correct_answer]
        );
        const [question] = await db.execute(
            `SELECT questions.*, skill_categories.name AS skill
                FROM questions
                JOIN skill_categories ON questions.skill_id = skill_categories.id
                WHERE questions.id = ?`,
            [result.insertId]
        );
        return question[0];
    } catch (err) {
        throw err;
    }
};

export const deleteQuestion = async (id) => {
    try {
        const [result] = await db.execute('DELETE FROM questions WHERE id = ?', [id]);
        return { affectedRows: result.affectedRows };
    } catch (err) {
        throw err;
    }
};

export const updateQuestion = async (id, { skill_id, question_text, option_a, option_b, option_c, option_d, correct_answer }) => {
    try {
        const [result] = await db.execute(
            'UPDATE questions SET skill_id = ?, question_text = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_answer = ? WHERE id = ?',
            [skill_id, question_text, option_a, option_b, option_c, option_d, correct_answer, id]
        );
        return { affectedRows: result.affectedRows };
    } catch (err) {
        throw err;
    }
};