const mongoose = require("mongoose");

const ALLOWED_COLLECTIONS = ["customers"];
const ALLOWED_OPERATIONS = ["find", "count"];

async function readMongoDB({ collection, operation, filter = {} }) {

    if (!ALLOWED_COLLECTIONS.includes(collection)) {
        throw new Error("Collection is not allowed");
    }

    if (!ALLOWED_OPERATIONS.includes(operation)) {
        throw new Error("Operation is not allowed");
    }

    const dbCollection = mongoose.connection.collection(collection);

    if (operation === "find") {

        return await dbCollection
            .find(filter)
            .project({
                password: 0
            })
            .limit(100)
            .toArray();
    }

    if (operation === "count") {

        const count = await dbCollection.countDocuments(filter);

        return { count };
    }
}

module.exports = {
    readMongoDB
};