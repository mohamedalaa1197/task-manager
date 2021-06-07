const Task = require("../Models/Task.js");
require("../DB/mongoose.js");

// Task.findByIdAndDelete({ _id: "60ba0eac565afa525062fa80" }).then((task) => {

//     if (task.deletedCount === 0) {
//         console.log("No of deleted tasks" + task.deletedCount);
//     }

//     return Task.count({ Done: false })
// }).catch((e) => {
//     console.log(e);
// }).then((count) => {
//     console.log(count);
// })

const DeleteTask = async(id) => {
    const DeletedTask = await Task.findByIdAndDelete(id);
    const unCompletedCount = await Task.countDocuments({ Done: false });
    return unCompletedCount;
};

DeleteTask('60ba2040f697343f38684a6c').then((count) => {
    console.log(count);
}).then((e) => {
    console.log(e);
});