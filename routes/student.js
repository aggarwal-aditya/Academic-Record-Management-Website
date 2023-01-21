const { courseticket, validate } = require('../models/courseticket');
const {Course} = require('../models/courses')
const User = require('../models/user')
const express = require('express');
const { ObjectID, ObjectId } = require('bson');
const router = express.Router();

router.post('/enrol', async (req, res) => {
    // First Validate The Request
    
    if (!req.session.role || req.session.role!='student' )
    {
        return res.status(401).send("Unauthorised");
    }


    // Check if this user already exisits
    let course = await Course.findOne({ code: req.body.code });
    let prevticket = await courseticket.findOne({code: req.body.code, studentmail: req.session.email});
    if (prevticket) {
        if (prevticket.status=='Enrolled')
        {
            return res.status(400).send('Already Enrolled');
        }
        await prevticket.delete();
    }
    if (!course) {
        return res.status(404).send('No such course exists');
    } else {
        // Insert the new user if they do not exist yet
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
});

router.get('/getenrolmentstatus', async (req, res) => {
    // First Validate The Request
    if (!req.session.role || req.session.role!='student' )
    {
        return res.status(401).send("Unauthorised");
    }
    const tickets = await courseticket.find({});
    filteredtickets=[];
    for (i=0;i<tickets.length;i++)
    {
        if (tickets[i].studentmail==req.session.email)
        {
            filteredtickets.push(tickets[i].toObject());
        }
    }
    return res.send(filteredtickets);
});

router.delete('/drop', async (req, res) => {
    // First Validate The Request
    if (!req.session.role || req.session.role!='student')
    {
        return res.status(401).send("Unauthorised");
    }
    const ticket = await courseticket.findOne({"_id":ObjectId(req.body._id)});
    if (!ticket) {
        return res.status(404).send('No such ticket exists');
    }
    else if (ticket.studentmail!=req.session.email)
    {
        return res.status(401).send("Unauthorised");
    }
    ticket.status = "Dropped by Student";
    ticket.pendingat = "admin";
    ticket.save();
    return res.send(ticket);

});

module.exports = router;
 
