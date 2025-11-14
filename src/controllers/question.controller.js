
import logger from '../config/logger.js';
import * as QuestionModel from '../models/question.model.js';

const getAllQuestions = async (req, res) => {
    try {
        const questions = await QuestionModel.getAllQuestions();
        logger.info('Questions loaded successfully');
        res.status(200).json({ message: "Questions loaded successfully", questions });
    } catch (err) {
        logger.error(`Error loading questions: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

const createQuestion = async (req, res) => {
    const { skill_id, question_text, option_a, option_b, option_c, option_d, correct_answer } = req.body;
    try {
        const createdQuestion = await QuestionModel.createQuestion({ skill_id, question_text, option_a, option_b, option_c, option_d, correct_answer });
        logger.info('Question created successfully');
        res.status(201).json({ message: "Question created successfully", question: createdQuestion });
    } catch (err) {
        logger.error(`Error creating question: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

const deleteQuestion = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await QuestionModel.deleteQuestion(id);
        logger.info(`Question with id ${id} deleted successfully`);
        res.status(200).json({ message: "Question deleted successfully", result: deleted });
    } catch (err) {
        logger.error(`Error deleting question: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

const updateQuestion = async (req, res) => {
    const { id } = req.params;
    const { skill_id, question_text, option_a, option_b, option_c, option_d, correct_answer } = req.body;
    try {
        const updated = await QuestionModel.updateQuestion(id, { skill_id, question_text, option_a, option_b, option_c, option_d, correct_answer });
        logger.info(`Question with id ${id} updated successfully`);
        res.status(200).json({ message: "Question updated successfully", result: updated });
    } catch (err) {
        logger.error(`Error updating question: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

export { getAllQuestions, createQuestion, deleteQuestion, updateQuestion };
