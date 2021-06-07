const mongoose = require("mongoose");
const validator = require('validator');

const taskSchema = mongoose.Schema({
    description: {
        type: String,
        required: true,
        default: false
    },
    Done: {
        required: true,
        type: String,
        validate(value) {
            if (!validator.isBoolean(value)) {
                throw new Error("Done Value is invalid!")
            }
        }
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    }
}, {
    timestamps: true
})
const Task = mongoose.model("tasks", taskSchema);

module.exports = Task;