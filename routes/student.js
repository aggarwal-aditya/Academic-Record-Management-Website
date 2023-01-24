const { courseticket, validate } = require('../models/courseticket');
const { Course } = require('../models/courses')
const User = require('../models/user')
const express = require('express');
const { ObjectID, ObjectId } = require('bson');
const router = express.Router();
const { MongoClient, ServerApiVersion } = require('mongodb');

router.post('/enrol', async (req, res) => {
    // First Validate The Request

    if (!req.session.role || req.session.role != 'student') {
        return res.status(401).send("Unauthorised");
    }


    // Check if this user already exisits
    let course = await Course.findOne({ code: req.body.code });
    let prevticket = await courseticket.findOne({ code: req.body.code, studentmail: req.session.email });
    if (prevticket) {
        if (prevticket.status != 'Dropped by Student') {
            return res.status(400).send('Already Enrolled');
        }
        // await prevticket.delete();
    }
    if (!course) {
        return res.status(404).send('No such course exists');
    } else {
        if (!prevticket) {
            ticket = new courseticket({
                name: course.name,
                code: course.code,
                studentmail: req.session.email,
                pendingat: course.instructormail,
                status: 'Pending Instructor Approval'

            });
            await ticket.save();
            res.send(ticket);
        }
        else {
            prevticket.status = 'Pending Instructor Approval';
            prevticket.pendingat = course.instructormail;
            await prevticket.save();
            res.send(prevticket);
        }
    }
});

router.get('/getenrolmentstatus', async (req, res) => {
    // First Validate The Request
    if (!req.session.role || req.session.role != 'student') {
        return res.status(401).send("Unauthorised");
    }
    const tickets = await courseticket.find({});
    filteredtickets = [];
    for (i = 0; i < tickets.length; i++) {
        if (tickets[i].studentmail == req.session.email) {
            filteredtickets.push(tickets[i].toObject());
        }
    }
    return res.send(filteredtickets);
});

router.post('/drop', async (req, res) => {
    // First Validate The Request
    if (!req.session.role || req.session.role != 'student') {
        return res.status(401).send("Unauthorised");
    }
    let ticket = await courseticket.findOne({ code: req.body.code, studentmail: req.session.email });
    if (!ticket) {
        return res.status(404).send('You are not enrolled in this course');
    }
    else if (ticket.studentmail != req.session.email) {
        return res.status(401).send("Unauthorised");
    }
    else if (ticket.status == 'Dropped by Student') {
        return res.status(400).send('Already Dropped');
    }
    ticket.status = "Dropped by Student";
    ticket.pendingat = "admin";
    ticket.save();
    return res.send(ticket);

});






// Render the template
router.get('/enrol', async (req, res) => {
    if (!req.session.role || req.session.role != 'student') {
        return res.status(401).send("Unauthorised");
    }
    const currentPage = parseInt(req.query.page || 1);
    const courses = await Course.find({});
    filteredcourses = [];
    for (i = 0; i < courses.length; i++) {
        filteredcourses.push(courses[i].toObject());
    }
    res.render('enrol.ejs', { courses: filteredcourses, currentPage: currentPage });
});


module.exports = router;
