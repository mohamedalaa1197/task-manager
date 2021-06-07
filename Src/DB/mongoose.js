const mongoose = require("mongoose");


mongoose.connect("mongodb+srv://Moahmed:MohamedAlaa@cluster0.parrl.mongodb.net/task-manager-API?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useCreateIndex: true,
    //To stop depricated Error.
    useFindAndModify: false
});