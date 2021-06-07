//CRUD operations
// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;
// const id = new ObjectID();
// console.log(id.getTimestamp());
// console.log(id.toHexString().length);
// console.log(id.id.length);

const { MongoClient, ObjectID } = require("mongodb");


const connectionURL = 'mongodb://127.0.0.1:27017'
const mongooDBName = 'task-manager';

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {

    if (error) {
        return console.log('There is an error');
    }

    const db = client.db(mongooDBName);
    const users = db.collection("User");
    const docs = db.collection("Task");
    // db.collection("users").findOne({ name: "Mohamed Alaa" }, (error, user) => {
    //     if (error) {
    //         console.log("There is an error!");
    //     }

    //     console.log(user.age);
    // })

    // db.collection("users").find({ name: "Mohamed Alaa" }).toArray((error, users) => {
    //     console.log(users);
    // });

    // db.collection("users").find({ name: "Mohamed Alaa" }).count((error, countNumber) => {
    //     console.log(countNumber);
    // })

    // db.collection("docs").findOne({ _id: new ObjectID("60b89acb9c153d157487ea16") }).then((data) => {
    //     console.log(data);
    // }).catch((erro) => {
    //     console.log("There is an error");
    // })

    // db.collection("docs").find({ done: false }).toArray().then((users) => {
    //     console.log(users);
    // }).catch((error) => {
    //     console.log("there is an error!");
    // })
    // db.collection("users").updateOne({ _id: new ObjectID("60b894086f518e24f8508789") }, {
    //     $set: {
    //         name: "Mohamed Saad"
    //     }
    // }).then((result) => {
    //     console.log(result.modifiedCount);
    // }).catch((error) => {
    //     console.log("There is an error!");
    // })

    docs.updateMany({ done: false }, { $set: { done: true } }).then((result) => {
        console.log(result.modifiedCount);
    }).catch((error) => {
        console.log(error);
    })

    users.deleteOne({ name: "Mohamed Saad" }).then((data => {
        console.log(data.deletedCount);
    })).catch((error) => {
        console.log(error);
    })
});