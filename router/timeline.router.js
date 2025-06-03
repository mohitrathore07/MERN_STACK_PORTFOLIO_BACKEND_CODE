import express from "express";
import {postTimeline,  deleteTimeline , getAllTimeLines} from "../Controller/timeline.controller.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();


router.post('/add' , isAuthenticated, postTimeline);
router.delete('/delete/:id', isAuthenticated, deleteTimeline);
router.get('/getall', getAllTimeLines);

export default router;
