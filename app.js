import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import dbConnection from './database/dbConnection.js';
import { errorMiddleWare } from './middleware/error.js';
import router from './router/messageRouter.js';
import userrouter from './router/user.router.js';
import timelinerouter from './router/timeline.router.js';
import softwareapplicationrouter from './router/softwareApplication.router.js';
import skillrouter from './router/skillRouter.js';
import projectrouter from './router/projectRouter.js';



const app = express();
dotenv.config({path: "./config/.env"});

app.use(
    cors({
        origin:[process.env.PORTFOLIO_URL , process.env.DASHBOARD_URL],
        methods:["GET", "POST", "DELETE", "PUT"],
        credentials: true
    }),
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/"
    })
)

app.use('/api/message',router);
app.use('/api/user',userrouter);
app.use('/api/timeline',timelinerouter);
app.use('/api/softwareapplication',softwareapplicationrouter);
app.use('/api/skill',skillrouter);
app.use('/api/project',projectrouter);

dbConnection();
app.use(errorMiddleWare);

export default app;



