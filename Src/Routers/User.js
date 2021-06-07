const express = require("express");
const User = require("../Models/User");
const Router = new express.Router();
const auth = require("../middlewares/authontecation");
const multer = require("multer");
const sharp = require("sharp");


const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {

        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(new Error("Please upload an image"));
        }

        return callback(undefined, true);
    }
});

Router.post("/users", async(request, response) => {

    const user = new User(request.body);
    try {
        const tocken = await user.generateTockenAuth();
        await user.save();
        response.status(201).send({ user, tocken });
    } catch (error) {
        response.status(400).send("There is an Error  " + error);
    }

});

Router.post("/users/login", async(request, response) => {

    try {
        const user = await User.findByCredentials(request.body.email, request.body.password);
        const tocken = await user.generateTockenAuth();
        response.status(200).send({ user, tocken });

    } catch (error) {
        response.status(400).send("there is an Error" + error);
    }
});
Router.post("/users/logout", auth, async(request, response) => {

    try {

        request.user.tockens = request.user.tockens.filter((tocken) => {
            return tocken.tocken !== request.tocken;
        });

        await request.user.save();

        response.status(200).send(request.user);

    } catch (error) {
        response.status(400).send("There is an Error" + error);
    }
});

Router.post("/users/logoutall", auth, async(request, response) => {

    try {

        request.user.tockens = [];
        await request.user.save();

        response.status(200).send(request.user);

    } catch (error) {
        response.status(400).send("There is an Error" + error);
    }

})
Router.get("/users/me", auth, async(req, res) => {
    res.send(req.user);
});

Router.post("/users/me/avater", auth, upload.single('upload'), async(req, res) => {
        const buffer = await sharp(req.file.buffer).resize({ height: 250, width: 250 }).png().toBuffer();

        req.user.avater = buffer;
        await req.user.save();
        res.status(200).send("The Photo uploaded!");
    },
    (error, request, response, next) => {
        response.status(400).send({ error: error.message });
    }
);

Router.delete("/users/me/avater", auth, async(req, res) => {

    req.user.avater = undefined;
    await req.user.save();
    res.status(200).send("The Photo deleted!");
});

Router.get("/users/:id/avater", async(request, response) => {
    try {
        const _id = request.params.id;
        // console.log(_id);
        const user = await User.findById({ _id });

        if (!user || !user.avater) {
            throw new Error();
        }
        response.set('Content-Type', 'image/jpg');
        response.status(200).send(user.avater);
    } catch (error) {
        response.status(400).send('There is an Error ' + error);
    }
});

// Router.get("/users/:name", async(req, res) => {
//     const searchname = req.params.name;
//     try {
//         const user = await User.findOne({ name: searchname });
//         if (!user) {
//             return res.status(404).send("Not Found!");
//         }
//         res.status(200).send(user);
//     } catch (error) {
//         response.status(400).send("There is an Error  " + error);
//     }
// });

Router.delete("/users/me", auth, async(req, res) => {
    try {
        await req.user.remove();
        res.status(200).send(req.user);

    } catch (error) {
        response.status(400).send("There is an Error  " + error);
    }


});

Router.patch("/users/me", auth, async(request, response) => {

    const allowedUpdate = ['name', 'age', 'email', 'password'];
    const updates = Object.keys(request.body);
    const ifAllowed = updates.every((update) => allowedUpdate.includes(update));

    if (!ifAllowed) {
        return response.status(400).send("Invalid updates!");
    };

    try {

        updates.forEach((update) => request.user[update] = request.body[update]);

        await request.user.save();
        response.status(200).send(request.user);

    } catch (error) {
        response.status(500).send("There is an Error  " + error);
    }
});



module.exports = Router;