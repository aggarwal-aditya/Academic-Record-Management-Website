const Joi = require('joi');
const mongoose = require('mongoose');

const uri = "mongodb+srv://admin:acad%40123@acaddatabase.esyhw8q.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri);



const courseticket = mongoose.model('courseticket', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100
    },
    code: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 5,
    },
    studentmail: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,

    },
    pendingat: {
        type: String,
        minlength: 3,
        maxlength: 255,
    }
    ,
    status: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255
    }
}));

function validate(courseticket) {
    const schema = Joi.object({
        name: Joi.string().min(1).max(100).required(),
        code: Joi.string().min(5).max(5).required(),
        studentmail: Joi.string().min(3).max(255).required().email(),
        pendingat: Joi.string().min(3).max(255).email(),
        status: Joi.string().min(1).max(255).required()
    });
    return schema.validate(courseticket);
}

exports.courseticket = courseticket;
exports.validate = validate;