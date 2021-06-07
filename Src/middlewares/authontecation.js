const User = require("../Models/User.js");
const jwt = require("jsonwebtoken");

const auth = async(request, response, next) => {

    try {

        const tocken = (request.header('Authorization')).replace('Bearer ', '');

        const decoded = jwt.verify(tocken, 'taskApp');
        const user = await User.findOne({ _id: decoded._id, 'tockens.tocken': tocken });

        if (!user) {
            throw new Error();
        }

        request.tocken = tocken;
        request.user = user;
        next();

    } catch (error) {
        response.status(400).send("Need to be authorize!");

    }

};

module.exports = auth;