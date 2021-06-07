require("./DB/mongoose.js");
const express = require("express");
const app = express();
const taskRouter = require("./Routers/Task.js");
const UserRouter = require("./Routers/User.js");
const jwt = require("jsonwebtoken");




const port = process.env.PORT || 3000;


//Convert json to Objects.
app.use(express.json());


app.use(UserRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log("Server is Up on port " + port);
});

// const myfun = async() => {

//     const tocken = jwt.sign({ _id: '123abc' }, 'Mohamed Alaa', { expiresIn: '7days' });
//     console.log(tocken);

//     const data = jwt.verify(tocken, 'Mohamed Alaa');
//     console.log(data);
// }
// myfun();
const User = require("./Models/User.js");


const main = async() => {
    const user = await User.findById('60bcc03117e86241640d361a');
    await user.populate('tasks').execPopulate();
    console.log(user.tasks);

}

// main();