import express from 'express';
import { getAllQuestions, createQuestion, deleteQuestion, updateQuestion } from '../controllers/question.controller.js';
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from '../middlewares/role.middleware.js';


const router = express.Router();


router.get('/', authenticate, authorizeRoles('user', 'admin'), getAllQuestions);
router.post('/', authenticate, authorizeRoles('admin'), createQuestion);
router.post('/', authenticate, authorizeRoles('admin'), deleteQuestion);
router.post('/', authenticate, authorizeRoles('admin'), updateQuestion);

export default router;