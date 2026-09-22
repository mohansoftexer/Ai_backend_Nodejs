var express = require('express');
var router = express.Router();
var customers_Model = require('../app/Schema/customer');
router.post('/createuser', async (req, res) => {
    for (var i = 2; i < 10; i++) {
        var insertData = await customers_Model.insertMany([{
            email: "mohan" + i + "@gmail.com",
            password: "123456",
            name: "mohan" + i,
            age: 20 + i,
            companyName: "company" + i,
            city: "city" + i
        }])
        console.log("insertData", insertData)
    }
    return res.status(200).json({ message: "User created successfully", data: insertData })
})

router.post('/aiask', async (req, res) => {
    const  params  = req.body;
    console.log("params", params)
    if (!params.question) {
        return res.status(400).json({ message: "Question is required" });
    }
    var { main } = require('../ai/agent');
    var answer = await main(params.question);
    return res.status(200).json({ message: "Answer generated successfully", data: answer })
})

module.exports = router;