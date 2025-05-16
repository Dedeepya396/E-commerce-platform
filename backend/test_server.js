//// ENCRYPT AND DECRYPT USED CODE

// app.post("/login", async (req, res) => {
//   const client = new MongoClient(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
//   try {
//     const { emailAddr, password } = req.body;
//     console.log("user came to login");
//     const encryptedPassword = encrypt(password);
//     const emailParts = emailAddr.split("@")[0].split(".");
//     if (
//       emailParts.length !== 2 ||
//       emailParts[0].length === 0 ||
//       emailParts[1].length === 0
//     ) {
//       console.log("Email format is incorrect!");
//       return res
//         .status(400)
//         .json({ message: "Email must be in the format abc.xyz@domain!" });
//     }

//     // Check for IIIT email domain
//     if (
//       !emailAddr.endsWith("@students.iiit.ac.in") &&
//       !emailAddr.endsWith("@research.iiit.ac.in")
//     ) {
//       console.log(
//         "User is trying to login through a non-IIIT mail-based account!"
//       );
//       return res.status(400).json({ message: "Enter IIIT mail!" });
//     }

//     await client.connect();
//     const database = client.db("sampleDatabase");
//     const users = database.collection("Username");

//     // Check if the user already exists
//     const existingUser = await users.findOne({EmailAddr: emailAddr,password: encryptedPassword });
//     if (existingUser) {
//       return res.status(200).json({ message: "Login successful!" });
//     } else {
//       return res.status(400).json({ message: "New user? Signup!" });
//     }
//   } catch (error) {
//     console.error("Error during login:", error);
//     res.status(500).json({ message: "Internal server error" });
//   } finally {
//     await client.close();
//   }
// });

// app.post("/signup", async (req, res) => {
//   const client = new MongoClient(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
//   try {
//     const { Fname, Lname, emailAddr, password, Age, ContactNumber } = req.body;
//     console.log("User came to Signup");
//     // const encryptedPassword = encrypt(password);
//     console.log("Encrypted password ",{ encryptedPassword});
//     // Email format validation
//     const emailParts = emailAddr.split("@")[0].split(".");
//     if (
//       emailParts.length !== 2 ||
//       emailParts[0].length === 0 ||
//       emailParts[1].length === 0
//     ) {
//       console.log("Email format is incorrect!");
//       return res
//         .status(400)
//         .json({ message: "Email must be in the format abc.xyz@domain!" });
//     }

//     // Check for IIIT email domain
//     if (
//       !emailAddr.endsWith("@students.iiit.ac.in") &&
//       !emailAddr.endsWith("@research.iiit.ac.in")
//     ) {
//       console.log("User is trying to create a non-IIIT mail-based account!");
//       return res.status(400).json({ message: "Enter IIIT mail!" });
//     }

//     await client.connect();
//     const database = client.db("sampleDatabase"); // Replace with your database name
//     const users = database.collection("Username");

//     // Check if the user already exists
//     const existingUser = await users.findOne({EmailAddr: emailAddr });
//     console.log(emailAddr,existingUser);
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists! Login" });
//     }

//     // Insert the user data
//     const newUser = {
//       Fname: Fname,
//       Lname: Lname,
//       EmailAddr: emailAddr,
//       password: encryptedPassword,
//       Age: Age,
//       ContactNumber: ContactNumber,
//       createdAt: new Date(),
//     };

//     const result = await users.insertOne(newUser);
//     console.log(`New user created with id: ${result.insertedId}`);
//     res.status(201).json({ message: "User signed up successfully!" });
//   } catch (error) {
//     console.error("Error during signup:", error);
//     res.status(500).json({ message: "Internal server error" });
//   } finally {
//     await client.close();
//   }
// });