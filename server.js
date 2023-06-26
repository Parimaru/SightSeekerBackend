require("dotenv").config();
require("colours");
const express = require("express");
const cors = require("cors");
const connectDB = require("./dbinit");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/ChatRoute")
const messageRoutes = require("./routes/MessageRoute")
const PORT = process.env.PORT || 8080;

const app = express();

// const whitelist = ["http://localhost:3000", "https:our-nice-deployment.com"];
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Haha"));
//     }
//   },
// };
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get("/", (req, res) => {
  res.send("Welcome");
});
app.use("/user", userRoutes);

app.use("/chat", chatRoutes)

app.use("/message", messageRoutes)

app.listen(PORT, () => {
  console.log("Running".rainbow);
});
