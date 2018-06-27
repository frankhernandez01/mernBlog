const express = require('express');
const router = express.Router();

//@route GET api/posts/test
//@desc Tests the posts route
//@acess Public
router.get('/test',(req, res) => { 
    res.json('the user endpoint works') 
})

module.exports = router;