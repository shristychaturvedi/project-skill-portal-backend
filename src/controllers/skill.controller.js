import * as SkillModal from '../models/skill.model.js';
import logger from '../config/logger.js';

export const getAllSkills = async (req, res) => {
    try {
        const skills = await SkillModal.getAllSkills();
        logger.info('Fetched all skills');
        res.status(200).json({
            message: 'Skills fetched successfully',
            skills
        });
    } catch (err) {
        logger.error(`Error fetching skills: ${err.message}`);
        res.status(500).json({ message: 'Failed to fetch skills. Please try again later.' });
    }
};

export const createSkill = async (req, res) => {
    try {
        const { name } = req.body;
        const createdSkill = await SkillModal.createSkill(name);
        logger.info(`Skill created: ${name}`);
        res.status(201).json({
            message: 'Skill created successfully',
            skill: createdSkill
        });
    } catch (err) {
        logger.error(`Error creating skill: ${err.message}`);
        res.status(500).json({ message: 'Failed to create skill. Please try again later.' });
    }
};

export const deleteSkill = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSkill = await SkillModal.deleteSkill(id);
        logger.info(`Skill deleted: id=${id}`);
        res.status(200).json({
            message: 'Skill deleted successfully',
            skill: deletedSkill
        });
    } catch (err) {
        logger.error(`Error deleting skill: ${err.message}`);
        res.status(500).json({ message: 'Failed to delete skill. Please try again later.' });
    }
};