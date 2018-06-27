const express = require('express');
const router = express.Router();

//@route GET api/user/test
//@desc Tests the users route
//@acess Public
router.get('/test',(req, res) => { 
    res.json('the user endpoint works') 
})

module.exports = router;