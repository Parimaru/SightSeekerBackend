require("dotenv").config();
require("colours");
const express = require("express");
const cors = require("cors");
const connectDB = require("./dbinit");
const userRoutes = require("./routes/user");
const travelplanRoutes = require("./routes/TravelRoute");
const chatRoutes = require("./routes/ChatRoute");
const messageRoutes = require("./routes/MessageRoute");
const pointsRoutes = require("./routes/PointsRoute");
const PORT = process.env.PORT || 8080;

const app = express();

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const whitelist = [
  "http://localhost:3000",
  "https://localhost:3000",
  "https://sightseeker.netlify.app",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Haha"));
    }
  },
  allowedHeaders: ["Access-Control-Allow-Origin"],
  credentials: true,
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

app.use("/travelplan", cors(corsOptions), travelplanRoutes);

app.use("/", cors(corsOptions), chatRoutes);

app.use("/message", cors(corsOptions), messageRoutes);

app.use("/point", cors(corsOptions), pointsRoutes);

// SOCKET.IO SETUP ///
// const io = require("socket.io")("http://localhost:8081", {
//   cors: {
//     origin: [
//       "http://localhost:3000",
//       "https://localhost:3000",
//       "https://sightseeker.netlify.app",
//     ],
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Access-Control-Allow-Origin"],
//     transports: ["websocket"],
//   },
// });

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://localhost:3000",
      "https://sightseeker.netlify.app",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Access-Control-Allow-Origin"],
    transports: ["websocket"],
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
        online: newUserId ? true : false
      });
    }
    io.emit("get-users", activeUsers);
  });

  // sending messages
  socket.on("send-message", (data) => {
    // console.log("active users", activeUsers);
    const { receiverId } = data;
    // console.log("receiverId", receiverId);
    // console.log("data", data);
    
    // Find all users whose userId is in the receiverId array
    const users = activeUsers.filter((user) => receiverId.includes(user.userId));
    // console.log("sending from socket to users:", users);
    
    // Emit the message to each user
    users.forEach((user) => {
      io.to(user.socketId).emit("receive-message", data);
    });
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    io.emit("get-users", activeUsers);
  });
});
/////////////////////////////////////////////////////////////////

server.listen(PORT, () => {
  console.log("Running".rainbow);
});
