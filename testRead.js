const mongoose = require("mongoose");
config = require('dotenv').config();

const { readMongoDB } = require("./tools/mongoDB_ReadTools");

async function test() {
    try {
        
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected");

        // Test 1: Get all customers
        const customers = await readMongoDB({
            collection: "customers",
            operation: "find",
            filter: {}
        });

        console.log("Customers:");
        console.log(customers);

        // Test 2: Find customer by city
        const cityCustomers = await readMongoDB({
            collection: "customers",
            operation: "find",
            filter: {
                city: "city9"
            }
        });

        console.log("City customers:");
        console.log(cityCustomers);

        // Test 3: Count customers
        const totalCustomers = await readMongoDB({
            collection: "customers",
            operation: "count",
            filter: {}
        });

        console.log("Total customers:");
        console.log(totalCustomers);

    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        await mongoose.disconnect();
    }
}

test();