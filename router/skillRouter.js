import express from "express";
import { deleteSkill, getAllSkills, addNewSkills , updateSkill} from "../Controller/skill.controller.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();


router.post('/add', isAuthenticated,addNewSkills );
router.delete('/delete/:id', isAuthenticated, deleteSkill);
router.put('/update/:id', isAuthenticated, updateSkill);
router.get('/getall', getAllSkills);

export default router;
