import {Request, Response} from "express";
import {getManager, QueryFailedError} from "typeorm";

import {TodoTask} from "./todoTask";

async function getAllTasks(request: Request, response: Response) {
    const repository = getManager().getRepository(TodoTask);
    const tasks = await repository.find();
    response.send({tasks});
}

async function createTask(request: Request, response: Response) {
    const {taskName, idempotencyKey} = request.body;
    if (!taskName) {
        response.status(400);
        response.send({error: "missing taskName"});
        return;
    }
    if (!idempotencyKey) {
        response.status(400);
        response.send({error: "missing idempotencyKey"});
        return;
    }


    let task = new TodoTask();
    task.name = taskName;
    task.idempotencyKey = idempotencyKey;

    console.log("New task:", task);

    await getManager()
        .createQueryBuilder()
        .insert()
        .into(TodoTask)
        .values(task)
        .orIgnore('idempotencyKey')
        .returning(['*'])
        .execute();

    // if (newTaskId) {
    //     console.log('Idempotency key problem, looks like problem');
    // }

    response.send({status: 'ok', task});
    return;
}

async function updateTaskName(request: Request, response: Response) {
    console.log(request.body);

    const taskId = request.body.taskId;
    if (!taskId) {
        response.status(400);
        response.send({error: "missing taskId param"});
        return;
    }

    const newName = request.body.newName;
    if (!newName) {
        response.status(400);
        response.send({error: "missing taskId param"});
        return;
    }

    console.log("Updating task id", taskId, "set new name", newName);

    const repository = getManager().getRepository(TodoTask);
    const task = await repository.findOne(taskId);

    if (!task) {
        response.status(404);
        response.send({error: "no task with id found"});
        return;
    }

    task.name = newName;
    const writtenTask = await repository.save(task);
    response.send({task: writtenTask});
}


async function updateTaskStatus(request: Request, response: Response) {
    const taskId = request.body.taskId;
    if (!taskId) {
        response.status(400);
        response.send({error: "missing taskId param"});
        return;
    }

    const newIsCompleted = request.body.isCompleted;
    if (newIsCompleted === undefined) {
        response.status(400);
        response.send({error: "missing taskId param"});
        return;
    }

    console.log("Updating task id", taskId, "set done =", newIsCompleted);

    const repository = getManager().getRepository(TodoTask);
    const task = await repository.findOne(taskId);

    if (!task) {
        response.status(404);
        response.send({error: "no task with id found"});
        return;
    }

    task.isCompleted = newIsCompleted;
    const writtenTask = await repository.save(task);
    response.send({task: writtenTask});
}

export default {
    getAllTasks,
    createTask,
    updateTaskName,
    updateTaskStatus,
};
