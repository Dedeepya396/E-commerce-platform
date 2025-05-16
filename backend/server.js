const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient } = require("mongodb");
app.use(cors());
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { login, signup } = require("./routes/registration");
const secretKey = "1289";
const { ObjectId } = require("mongodb");
const { hash } = require("crypto");
const saltRounds = 10;
const uri =
  "mongodb+srv://satyadedeepya21:nemani2005@cluster0.bm8re.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
require("dotenv").config();
const bodyParser = require("body-parser");
const OpenAI = require("openai");

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OpenAI API key! Please set OPENAI_API_KEY in .env");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CheckValidPhoneNumber = (phoneNumber) => {
  const PhoneNumberPattern = /^[2-9]{1}[0-9]{9}$/;
  return PhoneNumberPattern.test(phoneNumber);
};

app.listen(8000, () => {
  console.log("Backend running on port 8000");
});

app.post("/", async (req, res) => {
  const { ItemName, Price, Description, Category, SellerMail } = req.body;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("sampleDatabase");
    const collection = db.collection("Username");
    const user = await collection.findOne({ EmailAddr: SellerMail });
    if (!user) {
      console.log(SellerMail);
      return res.status(404).json({ message: "Seller email not found" });
    }
    const SellerName = user.Fname;
    const itemCollection = db.collection("Items");
    const NewItem = {
      ItemName: ItemName,
      Price: Price,
      SellerMail: SellerMail,
      Category: Category,
      Description: Description,
      SellerName: SellerName,
    };
    const result = await itemCollection.insertOne(NewItem);
    console.log("New item added!");
    res.status(201).json({ message: "New Item added" });
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await client.close();
  }
});

app.post("/login", async (req, res) => {
  login(req, res);
});

app.post("/signup", async (req, res) => {
  signup(req, res);
});

app.get("/profile", async (req, res) => {
  const { email } = req.query;
  console.log("profile:", email);
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("sampleDatabase");
    const collection = db.collection("Username");
    const user = await collection.findOne({ EmailAddr: email });
    console.log(user);
    if (user) res.send(user);
    else res.status(400).json({ message: "Couldn't fetch user details :(" });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await client.close();
  }
});
app.get("/search", async (req, res) => {
  const client = new MongoClient(uri);
  const searchQuery = req.query.q || "";

  try {
    await client.connect();
    const db = client.db("sampleDatabase");
    const collection = db.collection("Items");

    const query = searchQuery
      ? { name: { $regex: searchQuery, $options: "i" } }
      : {};
    const items = await collection.find(query).toArray();
    if (items.length > 0) {
      res.send(items);
    } else {
      res.status(404).json({ message: "No items found" });
    }
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await client.close();
  }
});
app.put("/profile", async (req, res) => {
  const client = new MongoClient(uri);
  try {
    const { Fname, Lname, mail, Age, ContactNumber } = req.body;
    console.log("User came to edit");

    await client.connect();
    const database = client.db("sampleDatabase");
    const users = database.collection("Username");
    console.log(mail);
    const UpdateBy = { EmailAddr: mail };
    if (!CheckValidPhoneNumber(ContactNumber)) {
      return res.status(400).json({ message: "Enter valid phone number!" });
    }
    // create updated data
    const updatedData = {
      $set: {
        Fname: Fname,
        Lname: Lname,
        Age: Age,
        ContactNumber: ContactNumber,
      },
    };
    const result = await users.updateOne(UpdateBy, updatedData);
    if (result.matchedCount > 0) {
      console.log("Details updated!");
      return res.status(200).json({ message: "Edits done!" });
    } else {
      return res
        .status(400)
        .json({ message: "Couldn't find the user with given mail" });
    }
  } catch (error) {
    console.error("Error during editing details:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await client.close();
  }
});

app.get("/search/:id", async (req, res) => {
  const client = new MongoClient(uri);
  const id = req.params.id;
  console.log("ID:", id);
  try {
    await client.connect();
    const db = client.db("sampleDatabase");
    const collection = db.collection("Items");
    const items = await collection.findOne({ _id: new ObjectId(id) });
    console.log(items);
    if (items) {
      res.send(items);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await client.close();
  }
});

app.post("/search/:id", async (req, res) => {
  const client = new MongoClient(uri);
  const {
    Name,
    Price,
    SellerName,
    SellerMail,
    Category,
    Description,
    BuyerEmail,
  } = req.body;
  try {
    await client.connect();
    const db = client.db("sampleDatabase");
    const collection = db.collection("Cart");
    console.log(Name);
    const NewItem = {
      ItemName: Name,
      Price: Price,
      SellerName: SellerName,
      SellerMail: SellerMail,
      Category: Category,
      Description: Description,
      BuyerMail: BuyerEmail,
    };
    const result = await collection.insertOne(NewItem);
    console.log("Item added to cart!");
    res.status(201).json({ message: "Item added to cart!" });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await client.close();
  }
});

app.get("/mycart", async (req, res) => {
  const client = new MongoClient(uri);
  const BuyerEmail = req.query.mail;
  try {
    await client.connect();
    const db = client.db("sampleDatabase");
    const collection = db.collection("Cart");
    const cartItems = await collection
      .find({ BuyerMail: BuyerEmail })
      .toArray();
    console.log(cartItems);
    if (cartItems.length > 0) {
      res.send(cartItems);
    } else {
      res.status(404).json({ message: "Cart is empty" });
    }
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await client.close();
  }
});

app.delete("/mycart", async (req, res) => {
  const client = new MongoClient(uri);
  const id = req.query.id;
  try {
    await client.connect();
    const db = client.db("sampleDatabase");
    const collection = db.collection("Cart");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result) {
      console.log("Item removed from cart!");
      return res.send({ message: "Removed" });
    } else {
      console.log("No documents matched the query. Deleted 0 documents.");
    }
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await client.close();
  }
});

app.get("/orders", async (req, res) => {
  const { mail, type } = req.query;

  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("sampleDatabase");
    const collection = db.collection("Orders");
    console.log("mail", mail, "Type", type);
    let result;

    switch (type) {
      case "Pending":
        result = await collection
          .find({ Status: "Pending", BuyerMail: mail })
          .toArray();
        break;
      case "Placed":
        result = await collection
          .find({ Status: "Sold", BuyerMail: mail })
          .toArray();
        break;
      case "Sold":
        result = await collection
          .find({ Status: "Sold", SellerMail: mail })
          .toArray();
        break;
      default:
        await client.close();
        return res
          .status(400)
          .json({ message: "Invalid order type specified." });
    }
    console.log(result);
    await client.close();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/mycart", async (req, res) => {
  const {
    Cart_id,
    ItemName,
    Price,
    SellerMail,
    SellerName,
    Category,
    Description,
    BuyerMail,
    Status,
    otp,
  } = req.body;
  console.log(Cart_id);
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("sampleDatabase");
    const cartCollection = db.collection("Cart");
    const usercollection = db.collection("Username");
    const user = await usercollection.findOne({ EmailAddr: BuyerMail });
    const buyerName = user.Lname;
    const removeItem = await cartCollection.deleteOne({
      _id: new ObjectId(Cart_id),
    });

    if (removeItem) console.log("Item deleted from cart", Cart_id);
    const collection = db.collection("Orders");
    const hashedOtp = await bcrypt.hash(otp, saltRounds);

    const newItem = {
      Cart_id: Cart_id,
      ItemName: ItemName,
      Price: Price,
      SellerMail: SellerMail,
      SellerName: SellerName,
      Category: Category,
      Description: Description,
      BuyerName: buyerName,
      BuyerMail: BuyerMail,
      Status: Status,
      otp: hashedOtp,
    };
    const result = collection.insertOne(newItem);
    if (result) {
      res.status(200).send({ message: "Order placed for item " });
    }
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/deliver", async (req, res) => {
  const { mail } = req.query;
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("sampleDatabase");
    const collection = db.collection("Orders");
    console.log("mail", mail);
    const result = await collection
      .find({
        SellerMail: mail,
        Status: "Pending",
      })
      .toArray();
    console.log(result, result.length);
    await client.close();
    if (result.length > 0) res.send(result);
    else res.status(400).json({ message: "Not orders yet:(" });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/deliver", async (req, res) => {
  const { otp, itemId } = req.body;
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("sampleDatabase");
    const collection = db.collection("Orders");
    const result = await collection.findOne({ _id: new ObjectId(itemId) });
    const hashedOtp = result.otp;
    const isOtpCorrect = await bcrypt.compare(otp, hashedOtp);
    if (isOtpCorrect) {
      res.status(200).json({ message: "Transaction success!!" });
      const UpdateBy = { _id: new ObjectId(itemId) };
      const updatedData = {
        $set: {
          Status: "Sold",
        },
      };
      const afterUpdate = await collection.updateOne(UpdateBy, updatedData);
      if (afterUpdate) console.log("Status is updated!!");
    } else {
      res.status(400).json({ message: "Incorrect otp" });
    }
    await client.close();
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/chatbot", async (req, res) => {
  console.log("A message came!");
  try {
    const message = req.body.message;
    console.log(message);
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
    });

    res.json({ content: chatCompletion.choices[0].message.content });
    console.log(chatCompletion.choices[0].message);
  } catch (error) {
    console.error("Error communicating with OpenAI:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
