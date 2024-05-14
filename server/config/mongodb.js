const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);
const database = client.db("phase-3");

module.exports = { database, client };
