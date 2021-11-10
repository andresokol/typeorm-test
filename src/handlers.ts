import {Request, Response} from "express";
import {getManager} from "typeorm";

import {TodoTask} from "./todoTask";

async function getAllTasks(request: Request, response: Response) {
    const repository = getManager().getRepository(TodoTask);
    const tasks = await repository.find();
    response.send({tasks});
}

async function createTask(request: Request, response: Response) {
    let task = new TodoTask();
    task.name = request.body.task_name;

    console.log("New task:", task);

    if (!task.name) {
        response.status(400);
        response.send("missing task_name");
        return;
    }

    const writtenTask = await getManager().save(task);

    response.send({status: "ok", task: writtenTask});
}


export default {
    getAllTasks,
    createTask
};