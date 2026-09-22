var express = require('express');
var router = express.Router();
router.get('/', (req, res) => {
    return res.status(200).json({ message: "Welcome to Ai backend Nodejs application" })
})

module.exports = router;