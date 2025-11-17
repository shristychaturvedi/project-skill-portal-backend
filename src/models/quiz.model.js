import db from "../config/db.js";
import logger from "../config/logger.js";

export async function startAttempt(userId, skillId, totalQuestions) {
    const [result] = await db.execute(
        `INSERT INTO quiz_attempts (user_id, skill_id, total_questions, score) VALUES (?, ?, ?, 0)`,
        [userId, skillId, totalQuestions]
    );
    return result.insertId;
}

export async function submitQuiz(attemptId, questions) {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {

        const [attempt] = await connection.query(
            `SELECT * from quiz_attempts
             WHERE id = ?`,
            [attemptId]
        );

        if (!attempt[0]) {
            await connection.rollback();
            connection.release();
            throw new Error("Quiz doesn't exist");
        } else if (attempt[0].completed_at !== null) {
            await connection.rollback();
            connection.release();
            throw new Error("Quiz already submitted");
        }

        const questionIds = questions.map(question => question.questionId);

        const [correctRows] = await connection.query(
            `SELECT id, correct_answer FROM questions WHERE id IN (?)`,
            [questionIds]
        );

        const correctAnswerMap = Object.fromEntries(
            correctRows.map(q => [q.id, q.correct_answer])
        );

        let score = 0;
        const processedQuestions = questions.map(question => {
            const isCorrect = question.selectedOption === correctAnswerMap[question.questionId];
            if (isCorrect) score++;
            return { ...question, isCorrect };
        });

        const quizAnswersData = processedQuestions.map(question => [
            attemptId,
            question.questionId,
            question.selectedOption,
            question.isCorrect
        ]);

        await connection.query(
            `INSERT INTO quiz_answers (attempt_id, question_id, selected_answer, is_correct)
             VALUES ?`,
            [quizAnswersData]
        );

        await connection.query(
            `UPDATE quiz_attempts 
             SET score = ?, total_questions = ?, completed_at = ? 
             WHERE id = ?`,
            [score, processedQuestions.length, new Date(), attemptId]
        );

        await connection.commit();
        connection.release();

        logger.info("Submit quiz successful:", attemptId);

        return score;
    } catch (err) {
        await connection.rollback();
        connection.release();
        logger.error("Submit quiz error:", err);
        throw err;
    }
};

export async function fetchCorrectAnswers(questionIds) {
    try {
        console.log({ questionIds })
        const [correctAnswers] = await db.query(
            `SELECT id, correct_answer FROM questions WHERE id IN (${questionIds})`
        );
        return correctAnswers;
    } catch (err) {
        logger.error("Fetch correct answers error:", err);
        throw err;
    }
}

export async function saveAnswers(attemptId, answers) {
    try {
        const values = answers.map(a => [
            attemptId,
            a.questionId,
            a.selectedOption,
            a.isCorrect ? 1 : 0,
        ]);
        const placeholders = values.map(() => "(?, ?, ?, ?)").join(",");
        const flat = values.flat();
        await db.query(
            `INSERT INTO quiz_answers (attempt_id, question_id, selected_answer, is_correct) VALUES ${placeholders}`,
            flat
        );
    } catch (err) {
        logger.error("Save answers error:", err);
        throw err;
    }
}

export async function updateAttemptResult(attemptId, score) {
    try {
        await db.execute(
            `UPDATE quiz_attempts SET score = ?, completed_at = NOW() WHERE id = ?`,
            [score, attemptId]
        );
    } catch (err) {
        logger.error("Update attempt result error:", err);
        throw err;
    }
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
        `SELECT a.*, q.id, q.question_text, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_answer
            FROM quiz_answers a
            JOIN questions q ON q.id = a.question_id
            WHERE a.attempt_id = ?`,
        [attemptId]
    );
    return { attempt: attempt[0], answers };
}
