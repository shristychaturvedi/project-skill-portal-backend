import db from "../config/db.js";

export async function startAttempt(userId, skillId, totalQuestions) {
    const [result] = await db.execute(
        `INSERT INTO quiz_attempts (user_id, skill_id, total_questions, score) VALUES (?, ?, ?, 0)`,
        [userId, skillId, totalQuestions]
    );
    return result.insertId;
}

export async function saveAnswers(attemptId, answers) {
    const values = answers.map(a => [
        attemptId,
        a.question_id,
        a.selected_option,
        a.is_correct ? 1 : 0,
    ]);
    const placeholders = values.map(() => "(?, ?, ?, ?)").join(",");
    const flat = values.flat();
    await db.query(
        `INSERT INTO quiz_answers (attempt_id, question_id, selected_option, is_correct) VALUES ${placeholders}`,
        flat
    );
}

export async function updateAttemptResult(attemptId, score) {
    await db.execute(
        `UPDATE quiz_attempts SET score = ?, completed_at = NOW() WHERE id = ?`,
        [score, attemptId]
    );
}

export async function getUserAttempts(userId) {
    const [rows] = await db.execute(
        `SELECT qa.id, s.name AS skill_name, qa.score, qa.completed_at
            FROM quiz_attempts qa
            JOIN skill_categories s ON s.id = qa.skill_id
            WHERE qa.user_id = ?
            ORDER BY qa.completed_at DESC`,
        [userId]
    );
    return rows;
}

export async function getAttemptDetails(attemptId) {
    const [attempt] = await db.execute(
        `SELECT qa.*, s.name AS skill_name
            FROM quiz_attempts qa
            JOIN skill_categories s ON s.id = qa.skill_id
            WHERE qa.id = ?`,
        [attemptId]
    );
    const [answers] = await db.execute(
        `SELECT a.*, q.question_text, q.correct_option
            FROM quiz_answers a
            JOIN questions q ON q.id = a.question_id
            WHERE a.attempt_id = ?`,
        [attemptId]
    );
    return { attempt: attempt[0], answers };
}
