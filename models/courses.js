const Joi = require('joi');
const mongoose = require('mongoose');

const uri = "mongodb+srv://admin:acad%40123@acaddatabase.esyhw8q.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri);



const Course = mongoose.model('Course', new mongoose.Schema({
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
        unique: true
    },
    instructormail:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
        
    }
}));

function validate(course) {
    const schema = Joi.object({
        name: Joi.string().min(1).max(100).required(),
        code: Joi.string().min(5).max(5).required()
    });
    return schema.validate(course);
}

exports.Course = Course;
exports.validate = validate;
