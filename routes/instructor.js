const { Course, validate } = require('../models/courses');
const express = require('express');
const { ObjectID } = require('bson');
const { courseticket } = require('../models/courseticket');
const { User } = require('../models/user');
const router = express.Router();


router.post('/addcourse', async (req, res) => {
    // First Validate The Request
    if (!req.session.role || req.session.role != 'instructor') {
        return res.status(401).send("Unauthorised");
    }
    const { error } = Course(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // Check if this user already exisits
    let course = await Course.findOne({ code: req.body.code });
    if (course) {
        // return res.status(400).send('Course already Exists');
        return res.render('status', { session: req.session, message: { type: 'alert', text: 'Course Already Exists' } });
    } else {
        // Insert the new user if they do not exist yet
        course = new Course({
            name: req.body.name,
            code: req.body.code,
            instructormail: req.session.email

        });
        await course.save();
        // res.send(course);
        return res.render('status', { session: req.session, message: { type: 'success', text: 'Course Released Successfully' } });
    }
});
router.get('/pending', async (req, res) => {
    // First Validate The Request
    if (!req.session.role || req.session.role != 'instructor') {
        return res.status(401).send("Unauthorised");
    }
    const currentPage = parseInt(req.query.page || 1);
    tickets = await courseticket.find({ pendingat: req.session.email });
    tosend = [];
    for (i = 0; i < tickets.length; i++) {
        studentmail = tickets[i].studentmail;
        studentname = await User.findOne({ email: studentmail });
        tosend.push(tickets[i].toObject());
        tosend[i].studentname = studentname.name;
    }
    res.render('approval.ejs', { courses: tosend, currentPage: currentPage, session: req.session });

    // return res.send(tosend);
});


router.get('/releasedcourses', async (req, res) => {
    if (!req.session.role || req.session.role != 'instructor') {
        return res.status(401).send("Unauthorised");
    }
    const currentPage = parseInt(req.query.page || 1);
    const courses = await Course.find({});
    tosend = [];
    for (i = 0; i < courses.length; i++) {
        if (courses[i].instructormail == req.session.email) {
            tosend.push(courses[i].toObject());
        }
    }
    for (i = 0; i < tosend.length; i++) {
        const tickets = await courseticket.find({ coursecode: tosend[i].code, status: 'Enrolled' });
        tosend[i].enrolled = 0;
        if (tickets) {
            tosend[i].enrolled = tickets.length;
        }

    }
    res.render('releasedcourses.ejs', { courses: tosend, currentPage: currentPage, session: req.session });
});

router.post('/approve', async (req, res) => {
    // First Validate The Request
    if (!req.session.role || req.session.role != 'instructor') {
        return res.status(401).send("Unauthorised");
    }
    ticket = await courseticket.findOne({ "_id": ObjectID(req.body._id) });
    if (!ticket) {
        return res.status(404).send("No such ticket exists");
    }
    if (ticket.pendingat != req.session.email) {
        return res.status(401).send("Unauthorised");
    }
    if (ticket.status == 'Pending Instructor Approval') {
        student = await User.findOne({ email: ticket.studentmail });
        ticket.pendingat = student.advisor;
        console.log(student);
        ticket.status = 'Pending Advisor Approval';
        await ticket.save();
    }
    else if (ticket.status == 'Pending Advisor Approval') {
        ticket.pendingat = "Admin";
        ticket.status = 'Enrolled';
        await ticket.save();
    }
    // return res.send(ticket);
    return res.redirect('/pending');
});

router.post('/reject', async (req, res) => {
    // First Validate The Request
    if (!req.session.role || req.session.role != 'instructor') {
        return res.status(401).send("Unauthorised");
    }
    ticket = await courseticket.findOne({ "_id": ObjectID(req.body._id) });
    if (!ticket) {
        return res.status(404).send("No such ticket exists");
    }
    course = await Course.findOne({ code: ticket.code });

    offeredby = course.instructormail;
    student = await User.findOne({ email: ticket.studentmail });
    advisor = student.advisor;
    if (ticket.pendingat != req.session.email && offeredby != req.session.email && advisor != req.session.email) {
        return res.status(401).send("Unauthorised");
    }
    if (ticket.status == 'Pending Instructor Approval' || (offeredby == req.session.email && ticket.status != 'Pending Advisor Approval')) {
        ticket.pendingat = "Admin";
        ticket.status = 'Instructor Rejected';
        await ticket.save();
    }
    else if (ticket.status == 'Pending Advisor Approval' || advisor == req.session.email) {
        ticket.pendingat = "Admin";
        ticket.status = 'Advisor Rejected';
        await ticket.save();
    }
    // return res.send(ticket);
    return res.redirect('/pending');
});



module.exports = router;
