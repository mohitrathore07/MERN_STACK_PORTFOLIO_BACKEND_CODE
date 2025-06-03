import express from "express";
import { addNewProject, getAllProject, deleteProject , updateProject, getSingleProject} from "../Controller/project.controller.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();


router.post('/add', isAuthenticated,addNewProject );
router.delete('/delete/:id', isAuthenticated, deleteProject);
router.put('/update/:id', isAuthenticated, updateProject);
router.get('/getall', getAllProject);
router.get('/get/:id', getSingleProject);

export default router;
