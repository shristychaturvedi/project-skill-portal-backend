
import express from 'express';
import { getAllSkills, createSkill, deleteSkill } from '../controllers/skill.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = express.Router();

router.get('/', authenticate, authorizeRoles('user', 'admin'), getAllSkills);
router.post('/', authenticate, authorizeRoles('admin'), createSkill);
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteSkill);

export default router;