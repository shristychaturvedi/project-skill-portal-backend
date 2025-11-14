import db from "../config/db.js";
import * as QuizModel from "../models/quiz.model.js";
import logger from "../config/logger.js";

export const startQuiz = async (req, res) => {
    try {
        const { skill_id } = req.body;
        const userId = req.user.id;

        const [questions] = await db.query(
            `SELECT id, question_text, option_a, option_b, option_c, option_d 
                FROM questions WHERE skill_id = ? ORDER BY RAND() LIMIT 5`,
            [skill_id]
        );

        if (!questions.length)
            return res.status(404).json({ message: "No questions found for this skill" });

        const attemptId = await QuizModel.startAttempt(
            userId,
            skill_id,
            questions.length
        );

        res.json({ attempt_id: attemptId, questions });
    } catch (err) {
        logger.error("Start quiz error:", err);
        res.status(500).json({ message: "Failed to start quiz" });
    }
};

export const submitQuiz = async (req, res) => {
    try {
        const { attempt_id, answers } = req.body;

        if (!answers || !Array.isArray(answers))
            return res.status(400).json({ message: "Invalid answers format" });

        const [correctAnswers] = await db.query(
            `SELECT id, correct_option FROM questions WHERE id IN (${answers.map(a => a.question_id).join(",")})`
        );

        const answerMap = Object.fromEntries(
            correctAnswers.map(q => [q.id, q.correct_option])
        );

        let score = 0;

        const processedAnswers = answers.map(a => {
            const isCorrect = a.selected_option === answerMap[a.question_id];
            if (isCorrect) score++;
            return { ...a, is_correct: isCorrect };
        });

        await QuizModel.saveAnswers(attempt_id, processedAnswers);
        await QuizModel.updateAttemptResult(
            attempt_id,
            score,
            processedAnswers.length
        );

        res.json({
            message: "Quiz submitted successfully",
            score,
            total: processedAnswers.length
        });
    } catch (err) {
        logger.error("Submit quiz error:", err);
        res.status(500).json({ message: "Failed to submit quiz" });
    }
};

export const getMyAttempts = async (req, res) => {
    try {
        const userId = req.user.id;
        const attempts = await QuizModel.getUserAttempts(userId);
        res.json(attempts);
    } catch (err) {
        logger.error("Get my attempts error:", err);
        res.status(500).json({ message: "Failed to fetch attempts" });
    }
};

export const getAttemptDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const details = await QuizModel.getAttemptDetails(id);
        res.json(details);
    } catch (err) {
        logger.error("Get attempt details error:", err);
        res.status(500).json({ message: "Failed to fetch attempt details" });
    }
};
