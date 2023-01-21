const Joi = require('joi');
const mongoose = require('mongoose');

const uri = "mongodb+srv://admin:acad%40123@acaddatabase.esyhw8q.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri);



const User = mongoose.model('User', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
        unique: true
    },
    role: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 1024
    },
    advisor: {
        type: String,
        required: false,
        minlength: 3,
        maxlength: 255,
    }
}));

function validate(user) {
    const schema = Joi.object({
        name: Joi.string().min(1).max(50).required(),
        email: Joi.string().min(3).max(255).required().email(),
        role: Joi.string().min(1).max(255).required(),
        advisor: Joi.string().min(3).max(255).required().email()
    });
    return schema.validate(user);
}

exports.User = User;
exports.validate = validate;
