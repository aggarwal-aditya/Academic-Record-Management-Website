
const express = require('express');
const router = express.Router();

router.delete('/', async (req, res) => {
    // First Validate The Request
    req.session.destroy();
    return res.status(200).send("OK Logged Out");
});


module.exports = router;
 
