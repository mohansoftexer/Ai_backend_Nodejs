var mongoose = require('mongoose');
var db = require('./DB_Connection');
var schema = mongoose.Schema;
var customerSchema = new schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false,
        default: ""
    },
    name: {
        type: String,
        required: false,
        default: ""
    },
    age: {
        type: Number,
        required: false,
    },
    companyName: {
        type: String,
        required: false,
        default: ""
    },
    city: {
        type: String,
        required: false,
        default: ""
    }

})
db.connection.on('connected', () => {
    console.log('Mongoose connected to the database');
})
module.exports = mongoose.model("customer", customerSchema)
