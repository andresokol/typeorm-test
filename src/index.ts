import "reflect-metadata";
import * as express from 'express';
import {createConnection} from "typeorm";

import {TodoTask} from "./todoTask";
import handlers from "./handlers";

const app = express();
app.use(express.json());

createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "andresokol",
    password: "password",
    database: "spokeai",
    entities: [
        TodoTask
    ],
    synchronize: true,
    logging: false
}).then(async connection => {

    // let task = new TodoTask();
    // task.name = "yes";
    // await connection.manager.save(task);
    // console.log("Photo has been saved");

}).catch(error => console.log(error));


app.get('/', handlers.getAllTasks);
app.post('/task', handlers.createTask);
app.post('/task/update/name', handlers.updateTaskName);
app.post('/task/update/status', handlers.updateTaskStatus);

app.listen(5000, () => {
    console.log("server started");
});
