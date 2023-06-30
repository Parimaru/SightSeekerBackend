require("dotenv").config();
require("colours");
const express = require("express");
const cors = require("cors");
const connectDB = require("./dbinit");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/ChatRoute");
const messageRoutes = require("./routes/MessageRoute");
const PORT = process.env.PORT || 8080;

/// SOCKET.IO SETUP ///
const io = require("socket.io")(8081, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  // add new user
  socket.on("new-user-add", (newUserId) => {
    // if user is not added already
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id,
      });
    }
    io.emit("get-users", activeUsers);
  });

  // sending messages
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("sending from socket to :", user);
    console.log("data", data);
    if (user) {
      io.to(user.socketId).emit("receive-message", data);
    }
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    io.emit("get-users", activeUsers);
  });
});
////////////////////////////////////////////////////////////////////////////////
const app = express();

const whitelist = ["http://localhost:3000", "https://sightseeker.netlify.app"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Haha"));
    }
  },
};

app.use(function setCommonHeaders(req, res, next) {
  res.set("Access-Control-Allow-Private-Network", "true");
  next();
});

app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get("/", cors(corsOptions), (req, res) => {
  res.send("Welcome");
});

app.use("/user", cors(corsOptions), userRoutes);

app.use("/chat", cors(corsOptions), chatRoutes);

app.use("/message", cors(corsOptions), messageRoutes);

app.listen(PORT, () => {
  console.log("Running".rainbow);
});
