const { courseticket, validate } = require('../models/courseticket');
const Course = require('../models/courses')
const User = require('../models/user')
const express = require('express');
const router = express.Router();

router.post('/enrol', async (req, res) => {
    // First Validate The Request
    if (!req.session.role || req.session.role!='student' )
    {
        return res.status(401).send("Unauthorised");
    }
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // Check if this user already exisits
    let course = await Course.findOne({ code: req.body.code });
    if (!course) {
        return res.status(400).send('No such course exists');
    } else {
        // Insert the new user if they do not exist yet
        ticket = new courseticket({
            name: course.name,
            code: course.code,
            studentmail: req.session.email,
            pendingat: course.instructormail,
            status: 'Pending Instructor Approval'
            
        });
        const { error } = validate(courseticket);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        await courseticket.save();
        res.send(courseticket);
    }
});


module.exports = router;
 
