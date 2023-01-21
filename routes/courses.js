
const express = require('express');
const { Course} = require('../models/courses');
const {User} = require('../models/user');
const router = express.Router();

router.get('/', async (req, res) => {
    if (!req.session.role)
    {
        return res.status(401).send("Unauthorised");
    }
    const courses = await Course.find({});
    filteredcourses=[];
    instructoremail = req.body.instructormail;
    listofcodes = req.body.listofcodes;
    for (i=0;i<courses.length;i++)
    {
        if (( !instructoremail ||courses[i].instructormail==instructoremail )&& ( !listofcodes || listofcodes.includes(courses[i].code)))
        {
            filteredcourses.push(courses[i].toObject());
        }
    }
    
    for (i =0;i<filteredcourses.length;i++)
    {
        Instructor = await User.find({email:filteredcourses[i].instructormail});
        filteredcourses[i]['offeredby'] = Instructor[0].name;
    }
    
    return res.send(filteredcourses);
});


module.exports = router;
 
