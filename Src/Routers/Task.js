const express = require("express");
const Task = require("../Models/Task");
const taskRouter = new express.Router();
const auth = require("../middlewares/authontecation.js");



taskRouter.post("/tasks", auth, async(req, res) => {

    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try {
        const taskCreated = await task.save();
        res.status(200).send(taskCreated);
    } catch (error) {
        res.status(400).send("There is an Error" + error);
    }
});

taskRouter.delete("/tasks/:id", auth, async(request, response) => {
    const _id = request.params.id;

    try {
        const task = await Task.findOneAndDelete({ _id, owner: request.user._id })
        if (!task) {
            return response.status(400).send("The task is not Found!");
        }

        response.status(200).send(task);

    } catch (error) {
        res.status(400).send("There is an Error" + error);
    }
});

// Get /tasks?completed
taskRouter.get("/tasks", auth, async(request, response) => {
    try {

        const match = {};
        const sort = {};
        if (request.query.Done) {
            match.Done = request.query.Done === 'true'
        }

        if (request.query.sortBy) {
            const splited = request.query.sortBy.split(":");
            sort[splited[0]] = splited[1] === 'desc' ? -1 : 1;
        }

        await request.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(request.query.limit),
                skip: parseInt(request.query.skip),
                sort

            }
        }).execPopulate();

        response.status(200).send(request.user.tasks)
    } catch (error) {
        res.status(400).send("There is an Error" + error);
    }
});

taskRouter.get("/tasks/:id", auth, async(request, response) => {
    const _id = request.params.id;
    try {
        const task = await Task.findOne({ _id, owner: request.user._id });
        response.status(200).send(task);
    } catch (error) {
        res.status(400).send("There is an Error" + error);

    }
});

taskRouter.patch("/tasks/:id", auth, async(request, response) => {

    try {

        const _id = request.params.id;

        const allowedKeys = ['description', 'Done'];
        const Updates = Object.keys(request.body);

        const ifAllowed = Updates.every((update) => allowedKeys.includes(update));

        if (!ifAllowed) {
            return response.status(400).send("Invalid Update!");
        };

        const task = await Task.findOne({ _id, owner: request.user._id });

        if (!task) {
            response.status(400).send("No Found!");
        }

        Updates.forEach((update) => {
            task[update] = request.body[update]
        });

        await task.save();


        response.status(200).send(task);

    } catch (error) {
        res.status(400).send("There is an Error" + error);
    }

});

module.exports = taskRouter;