const mongoose = require("mongoose");
const validator = require('validator');
const bycrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./Task.js");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        minlength: 7,
        require: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is inValid!");
            }
        }
    },
    password: {
        required: true,
        type: String,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Password Can not Contain 'password' keyWord!");
            }
        }
    },
    age: {
        type: Number,
        default: 18,
        validate(value) {
            if (value < 0) {
                throw new Error("Age should be bigger than Zero");
            }
        }
    },
    tockens: [{
        tocken: {
            type: String,
            required: true
        }
    }],
    avater: {
        type: Buffer
    }
}, {
    timestamps: true
});

userSchema.methods.toJSON = function() {

    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tockens;

    return userObject;
}

userSchema.methods.generateTockenAuth = async function() {

    const user = this;
    const tocken = jwt.sign({ _id: user._id }, 'taskApp');
    console.log(tocken);

    user.tockens = user.tockens.concat({ tocken });
    await user.save();
    return tocken;

}
userSchema.statics.findByCredentials = async(email, password) => {

    const user = await User.findOne({ email });
    console.log(user.email);

    if (!user) {
        throw new Error("User Not Found!");
    };

    const isMatch = await bycrpt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Unable to login!");
    }

    return user;
}

userSchema.pre("save", async function(next) {
    const user = this;

    if (user.isModified("password")) {

        user.password = await bycrpt.hash(user.password, 8);
    }
    next();
});

userSchema.pre("remove", async function(next) {

    const user = this;
    await Task.deleteMany({ owner: user._id });
    next();
})

userSchema.virtual('tasks', {
    ref: 'tasks',
    localField: '_id',
    foreignField: 'owner'
});

const User = mongoose.model('users', userSchema);

module.exports = User;