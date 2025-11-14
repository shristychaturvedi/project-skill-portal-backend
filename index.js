
import app from "./src/app.js";
import logger from "./src/config/logger.js";
import dotenv from 'dotenv';
import db from "./src/config/db.js";


dotenv.config();

const port = process.env.PORT;

app.listen(port, () => {
    logger.info(`Server listening at ${port}`);
});