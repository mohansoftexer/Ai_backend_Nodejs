// const { GoogleGenAI } = require("@google/genai");
// const mongoose = require("mongoose");

// require("dotenv").config({
//     path: "../.env"
// });

// const { readMongoDB } = require("../tools/mongoDB_ReadTools");

// const ai = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY
// });

// const readMongoDBTool = {
//     functionDeclarations: [
//         {
//             name: "readMongoDB",
//             description:
//                 "Read customer data from MongoDB. This tool is strictly read-only. It can find or count customers.",

//             parameters: {
//                 type: "object",

//                 properties: {
//                     collection: {
//                         type: "string",
//                         description: "MongoDB collection to read",
//                         enum: ["customers"]
//                     },

//                     operation: {
//                         type: "string",
//                         description: "Read operation",
//                         enum: ["find", "count"]
//                     },

//                     filter: {
//                         type: "object",
//                         description:
//                             "MongoDB filter used to find matching customers"
//                     }
//                 },

//                 required: ["collection", "operation"]
//             }
//         }
//     ]
// };

// async function testAgent() {

//     try {

//         // Connect MongoDB
//         await mongoose.connect(process.env.MONGODB_URI);

//         console.log("MongoDB connected");

//         // Ask Gemini
//         const response = await ai.models.generateContent({
//             model: "gemini-3.6-flash",

//             contents: `
// You are a customer database assistant.

// You can only read data from the customers collection.

// You must never insert, update, delete, or modify data.

// User question:
// Show me customers from city9
// `,

//             config: {
//                 tools: [readMongoDBTool]
//             }
//         });

//         // Get Gemini function call
//         const parts = response.candidates[0].content.parts;

//         const functionCallPart = parts.find(
//             part => part.functionCall
//         );

//         if (!functionCallPart) {
//             console.log("Gemini did not request a database operation.");
//             return;
//         }

//         const functionCall = functionCallPart.functionCall;

//         console.log("Gemini requested:");
//         console.log(functionCall);

//         // Execute MongoDB tool
//         if (functionCall.name === "readMongoDB") {

//             const result = await readMongoDB(functionCall.args);

//             console.log("MongoDB result:");
//             console.log(result);
//         }

//     } catch (error) {

//         console.error("Error:", error.message);

//     } finally {

//         await mongoose.disconnect();
//     }
// }

// testAgent();





require("dotenv").config({
    path: "../.env"
});

const { GoogleGenAI } = require("@google/genai");
const mongoose = require("mongoose");
const readline = require("readline");
const { readMongoDB } = require("../tools/mongoDB_ReadTools");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// Gemini tool definition
const readMongoDBTool = {
    functionDeclarations: [
        {
            name: "readMongoDB",
            description:
                "Read customer data from MongoDB. This tool is strictly read-only. It can find or count customers.",

            parameters: {
                type: "object",

                properties: {
                    collection: {
                        type: "string",
                        description: "MongoDB collection to read",
                        enum: ["customers"]
                    },

                    operation: {
                        type: "string",
                        description: "Read operation",
                        enum: ["find", "count"]
                    },

                    filter: {
                        type: "object",
                        description:
                            "MongoDB filter used to find matching customers"
                    }
                },

                required: ["collection", "operation"]
            }
        }
    ]
};


async function main(question) {

    // 1. Connect MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");
    var userQuestion = question;

    // 2. User's natural language question
    //const userQuestion = "Show me customers from city9";
    // const rl = readline.createInterface({
    //     input: process.stdin,
    //     output: process.stdout
    // });

    // const userQuestion = await new Promise((resolve) => {

    //     rl.question("Ask your question: ", (answer) => {

    //         resolve(answer);

    //         rl.close();
    //     });

    // });


    // 3. Ask Gemini
    const firstResponse = await ai.models.generateContent({

        model: "gemini-3.6-flash",

        contents: userQuestion,

        config: {
            tools: [readMongoDBTool]
        }
    });


    // 4. Get Gemini function call
    const functionCall =
        firstResponse.functionCalls?.[0];


    if (!functionCall) {

        console.log("Gemini did not request MongoDB");

        console.log(firstResponse.text);

        return;
    }


    console.log("\nGemini requested:");

    console.log(functionCall);


    // 5. Execute MongoDB tool
    const mongoResult = await readMongoDB(
        functionCall.args
    );


    console.log("\nMongoDB result:");

    console.log(mongoResult);


    // 6. Send MongoDB result back to Gemini
    const finalResponse = await ai.models.generateContent({

        model: "gemini-3.6-flash",

        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: userQuestion
                    }
                ]
            },

            // IMPORTANT:
            // Preserve Gemini's original response.
            // This keeps the thought_signature.
            firstResponse.candidates[0].content,

            {
                role: "user",
                parts: [
                    {
                        functionResponse: {
                            name: functionCall.name,

                            response: {
                                result: mongoResult
                            }
                        }
                    }
                ]
            }
        ],

        config: {
            tools: [readMongoDBTool]
        }
    });


    // 7. Final AI answer
    console.log("\n==============================");

    console.log("FINAL AI ANSWER:");

    console.log("==============================");

    console.log(finalResponse.text);
    


    // 8. Close MongoDB
    await mongoose.connection.close();
    return finalResponse.text;
}


// main().catch(error => {

//     console.error("ERROR:");

//     console.error(error);

// });
module.exports = {
    main
}