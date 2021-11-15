import "reflect-metadata";
import * as express from 'express';
import * as path from "path";
import {createConnection} from "typeorm";

import {TodoTask} from "./todoTask";
import handlers from "./handlers";

createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "andresokol",
    password: "password",
    database: "spokeai",
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

    const port = 5000;
    app.listen(port, () => {
        console.log("Server started at port", 5000);
        console.log(`http://0.0.0.0:${port}`);
    });
}).catch(error => console.log(error));
