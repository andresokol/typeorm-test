import {Request, Response} from "express";
import {getManager} from "typeorm";

import {TodoTask} from "./todoTask";

const INTERVAL_TO_RESOLVE_COLLISIONS_MS = 60 * 60 * 1000; // 1 hour

async function getAllTasks(request: Request, response: Response) {
    const repository = getManager().getRepository(TodoTask);
    const tasks = await repository.find({order: {createdAt: "DESC"}});
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

    const insertResult = await getManager()
        .createQueryBuilder()
        .insert()
        .into(TodoTask)
        .values(task)
        .orIgnore('idempotencyKey')
        .returning(['id'])
        .execute();

    if (insertResult.raw.length !== 0) {
        console.log("Successfully created new task", task);
        response.send({status: "ok", task});
        return;
    }

    const competingTask = await getManager()
        .getRepository(TodoTask)
        .findOne({where: {idempotencyKey: idempotencyKey}});

    console.log("Idempotency key collision, competing item =", competingTask);
    const msSinceCreation = Date.now() - competingTask.createdAt.getTime();
    console.log("Since creation:", msSinceCreation, "ms");

    if (competingTask.name != taskName || msSinceCreation > INTERVAL_TO_RESOLVE_COLLISIONS_MS) {
        console.error("Other task considered different, either name is different or other item is too old");
        response.status(500);
        response.send({status: "error", details: "idempotency key collision"});
        return;
    }

    console.log("Other task considered same");
    response.send({status: "ok", task: competingTask});
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
