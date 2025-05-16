const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri =
  "mongodb+srv://satyadedeepya21:nemani2005@cluster0.bm8re.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
async function connectDB() {
  if (!client) {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    console.log("Connected to database");
  }
  return client;
}
module.exports = { connectDB };
