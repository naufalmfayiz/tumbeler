const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://naufalmf:u2p5no7ULpm2Fxrb@phase3.c4mm2ai.mongodb.net/?retryWrites=true&w=majority";

// Create a new client and connect to MongoDB
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect to the "phase-3" database and access its "users" collection
    const database = client.db("phase-3");
    const users = database.collection("User");

    // Create a document to insert
    const doc = {
      title: "Record of a Shriveled Datum",
      content: "No bytes, no problem. Just insert a document, in MongoDB",
    };

    // Insert the defined document into the "users" collection
    const result = await users.deleteOne({
      _id: new ObjectId("66302d822600fcafe5091a3b"),
    });
    console.log(result);

    // Print the ID of the inserted document
    // console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    // Close the MongoDB client connection
    await client.close();
  }
}
// Run the function and handle any errors
run().catch(console.dir);
