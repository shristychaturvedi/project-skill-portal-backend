import express from "express";
import cors from 'cors';

import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import skillRoutes from "./routes/skill.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import questionRoutes from "./routes/question.routes.js";


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/questions", questionRoutes);




export default app;