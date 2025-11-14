
import db from '../config/db.js';

export const getAllSkills = async () => {
    try {
        const [rows] = await db.execute('SELECT * FROM skill_categories');
        return rows;
    } catch (err) {
        throw err;
    }
};

export const createSkill = async (name) => {
    try {
        const [result] = await db.execute('INSERT INTO skill_categories (name) VALUES(?)', [name]);
        return { id: result.insertId, name };
    } catch (err) {
        throw err;
    }
};

export const deleteSkill = async (id) => {
    try {
        const [result] = await db.execute('DELETE FROM skill_categories WHERE id = ?', [id]);
        return { affectedRows: result.affectedRows };
    } catch (err) {
        throw err;
    }
};