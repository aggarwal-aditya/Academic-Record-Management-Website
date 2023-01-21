const { Course, validate } = require('../models/courses');
const {courseticket} = require('../models/courseticket');
const {User} = require('../models/user');
const express = require('express');
const router = express.Router();

router.post('/addcourse', async (req, res) => {
    // First Validate The Request
    if (!req.session.role || req.session.role!='instructor' )
    {
        return res.status(401).send("Unauthorised");
    }
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // Check if this user already exisits
    let course = await Course.findOne({ code: req.body.code });
    if (course) {
        return res.status(400).send('Course already Exists');
    } else {
        // Insert the new user if they do not exist yet
        course = new Course({
            name: req.body.name,
            code: req.body.code,
            instructormail: req.session.email
            
        });
        await course.save();
        res.send(course);
    }
});

router.get('/pending' , async (req, res) => {
    // First Validate The Request
    if (!req.session.role || req.session.role!='instructor' )
    {
        return res.status(401).send("Unauthorised");
    }
    tickets = await courseticket.find({pendingat: req.session.email});
    tosend=[];
    for (i=0;i<tickets.length;i++)
    {
        studentmail = tickets[i].studentmail;
        studentname = await User.findOne({email: studentmail});
        tosend.push(tickets[i].toObject());
        tosend[i].studentname = studentname.name;
    }

    return res.send(tosend);
});

module.exports = router;
 
