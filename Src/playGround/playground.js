const User = require('../Models/User.js');
require('../DB/mongoose.js');

// User.findOne({ name: "Mohamed Alaa Saad" }).then((user) => {
//     console.log(user);
//     return User.count({ name: "Mohamed Alaa" });
// }).then((result) => {
//     console.log(result);
// });

const updateUser = async(id, age) => {

    const updatedUser = await User.findByIdAndUpdate(id, { age });
    const count = await User.countDocuments({ age });
    return count;
}

updateUser('60b918f689edd0456096ab83', 25).then((count) => {
    console.log(count);
}).catch((error) => {
    console.log(error);
});