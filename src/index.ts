import "reflect-metadata";
import * as express from 'express';
import * as path from "path";
import {createConnection} from "typeorm";

import {TodoTask} from "./todoTask";
import handlers from "./handlers";

const PORT = process.env.PORT || 5000;

createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL || "postgres://andresokol:password@localhost:5432/spokeai",
    entities: [
        TodoTask,
    ],
    synchronize: true,
    logging: false
}).then(async connection => {
    console.log("Connected to DB");

    const pathToFrontendBuild = path.join(__dirname, "../frontend/build");
    console.log(`Serving frontend build from "${pathToFrontendBuild}"`)

    const app = express();
    app.use(express.json());
    app.use(express.static(pathToFrontendBuild));

    app.get('/tasks', handlers.getAllTasks);
    app.post('/task', handlers.createTask);
    app.post('/task/update/name', handlers.updateTaskName);
    app.post('/task/update/status', handlers.updateTaskStatus);

    app.listen(PORT, () => {
        console.log("Server started at port", PORT);
        console.log(`http://0.0.0.0:${PORT}`);
    });
}).catch(error => console.log(error));
