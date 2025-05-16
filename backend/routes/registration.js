const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secretKey = "1289";
const saltRounds = 10;
const uri =
  "mongodb+srv://satyadedeepya21:nemani2005@cluster0.bm8re.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Replace with your MongoDB connection string

const CheckValidPhoneNumber = (phoneNumber) => {
  const PhoneNumberPattern = /^[2-9]{1}[0-9]{9}$/;
  return PhoneNumberPattern.test(phoneNumber);
};

async function login(req, res) {
  const client = new MongoClient(uri);
  try {
    const { emailAddr, password } = req.body;
    console.log("User came to login");

    const emailParts = emailAddr.split("@")[0].split(".");
    if (
      emailParts.length !== 2 ||
      emailParts[0].length === 0 ||
      emailParts[1].length === 0
    ) {
      console.log("Email format is incorrect!");
      return res
        .status(400)
        .json({ message: "Email must be in the format abc.xyz@domain!" });
    }

    // Check for IIIT email domain
    if (
      !emailAddr.endsWith("@students.iiit.ac.in") &&
      !emailAddr.endsWith("@research.iiit.ac.in")
    ) {
      console.log(
        "User is trying to login through a non-IIIT mail-based account!"
      );
      return res.status(400).json({ message: "Enter IIIT mail!" });
    }

    await client.connect();
    const database = client.db("sampleDatabase");
    const users = database.collection("Username");

    // Find user by email
    const existingUser = await users.findOne({ EmailAddr: emailAddr });
    if (existingUser) {
      // Compare the hashed password
      const validPass = await bcrypt.compare(password, existingUser.password);
      if (validPass) {
        const token = jwt.sign(
          { emailAddr: existingUser.EmailAddr, userId: existingUser._id },
          secretKey
        );
        return res.status(200).json({ message: "Login successful!", token });
      } else {
        return res.status(400).json({ message: "Incorrect password!" });
      }
    } else {
      return res.status(400).json({ message: "New user? Signup!" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await client.close();
  }
}

async function signup(req, res) {
  const client = new MongoClient(uri);
  try {
    const { Fname, Lname, emailAddr, password, Age, ContactNumber } = req.body;
    console.log("User came to Signup");

    const emailParts = emailAddr.split("@")[0].split(".");
    if (
      emailParts.length !== 2 ||
      emailParts[0].length === 0 ||
      emailParts[1].length === 0
    ) {
      console.log("Email format is incorrect!");
      return res
        .status(400)
        .json({ message: "Email must be in the format abc.xyz@domain!" });
    }

    // Check for IIIT email domain
    if (
      !emailAddr.endsWith("@students.iiit.ac.in") &&
      !emailAddr.endsWith("@research.iiit.ac.in")
    ) {
      console.log("User is trying to create a non-IIIT mail-based account!");
      return res.status(400).json({ message: "Enter IIIT mail!" });
    }

    await client.connect();
    const database = client.db("sampleDatabase");
    const users = database.collection("Username");

    // Check if the user already exists
    const existingUser = await users.findOne({ EmailAddr: emailAddr });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists! Login" });
    }

    if (!CheckValidPhoneNumber(ContactNumber)) {
      return res.status(400).json({ message: "Enter valid phone number!" });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      Fname: Fname,
      Lname: Lname,
      EmailAddr: emailAddr,
      password: hashedPassword,
      Age: Age,
      ContactNumber: ContactNumber,
      createdAt: new Date(),
    };
    const result = await users.insertOne(newUser);
    const token = jwt.sign(
      { emailAddr: newUser.EmailAddr, userId: newUser._id },
      secretKey
    );
    console.log(`New user created with id: ${result.insertedId}`);
    res.status(201).json({ message: "User signed up successfully!", token });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await client.close();
  }
}

module.exports = { login, signup };
