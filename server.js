const http = require("http");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const {
  getLastMessagesFromRoom,
  sortRoomMessagesByDate,
  createNotificationInDataBase,
  followingProfessional,
  followingClient,
  sendChatNotifications,
} = require("./utils/chathelper");
const PORT = process.env.PORT || 4000;
const mongoose = require("mongoose");
const path = require("path");
const subscriberroute = require("./Routes/Subscriber.route");
const clientRoute = require("./Routes/client");
const professionalRoute = require("./Routes/professional");
const chatRoute = require("./Routes/chat");
const userChatNotifications = require("./Models/userChatNotification");

app.use(cors());

// __dirname = path.resolve();
// app.use(express.static("images"));
// app.use(express.static(path.join(__dirname, "./myapp/build")));
app.use("/img", express.static("./Images"));

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});
app.set("view engine", "pug");
app.use(bodyParser.json());
mongoose.connect(
  "mongodb+srv://admin:adminx@cluster0.dadf0ac.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);
const connection = mongoose.connection;
connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});

// socket connection for server
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
function ioMiddleware(req, res, next) {
  (req.io = io), next();
}
// socket server end

app.use("/api/signup", ioMiddleware, subscriberroute);
app.use("/api/client", ioMiddleware, clientRoute);
app.use("/api/professional", ioMiddleware, professionalRoute);
app.use("/api/chat", ioMiddleware, chatRoute);

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "./myapp", "build", "index.html"));
// });

// socket connection for implementation

io.on("connection", async (socket) => {
  socket.on("connect", () => {
    console.log("Connected to server");
  });
  console.log("A user connected.");
  const id = socket.handshake.query.id;
  if (id) {
    socket.join(id);
    console.log("Notification active for user====== " + id);
  }

  // chat notifications
  socket.on(
    "send-chat-notification",
    async ({ recipients, message, senderName, roomId, sender, messageTo }) => {
      console.log("Sending chat notification222", sender);
      // if (messageTo === "stylist") {
      //   await followingUser(sender, recipients[0]);
      // }

      await sendChatNotifications(sender + "_" + recipients[0], messageTo);
      recipients.forEach((recipient) => {
        socket.broadcast.to(recipient).emit("recieve-chat-notification", {
          recipients,
          message,
          senderName,
          roomId,
        });
      });
    }
  );

  // chat logic start

  socket.on("join-room", async (newRoom, priviousRoom, sender, reciever) => {
    console.log("ali raza want to join==", sender.accountType, reciever._id);
    socket.join(newRoom);
    if (newRoom !== priviousRoom) {
      socket.leave(priviousRoom);
    }
    if (sender.accountType === "client") {
      followingProfessional(sender._id, reciever._id);
    } else {
      followingClient(sender._id, reciever._id);
    }
    const updatedNotification = await userChatNotifications.findOneAndUpdate(
      { uniqueId: reciever._id + "_" + sender._id },
      { count: 0, seen: true },
      { new: true }
    );
    let roomMessages = await getLastMessagesFromRoom(newRoom);
    console.log("rooom messages ==========", roomMessages);
    roomMessages = await sortRoomMessagesByDate(roomMessages);
    socket.emit("room-messages", roomMessages);
  });

  // socket.on(
  //   "message-room",
  //   async (room, content, sender, time, date, reciever) => {
  //     console.log(sender, reciever, "1122====");
  //     let savedObj = await createNotificationInDataBase(
  //       reciever.accountType,
  //       sender.userName,
  //       reciever._id,
  //       `You recieve a new message from ${sender.userName}`
  //     );

  //     const newMessage = await Message.create({
  //       content,
  //       from: sender._id,
  //       time,
  //       date,
  //       to: room,
  //     });
  //     if (savedObj) {
  //       console.log("creeate new message", reciever);
  //       socket.broadcast
  //         .to(reciever._id.toString())
  //         .emit("recieve-new-message", {
  //           reciever,
  //         });
  //     }
  //     let roomMessages = await getLastMessagesFromRoom(room);
  //     console.log("get aggregate", roomMessages);
  //     roomMessages = await sortRoomMessagesByDate(roomMessages);
  //     /// sending message to room
  //     io.to(room).emit("room-messages", roomMessages);
  //     socket.broadcast.emit("notification", room);
  //   }
  // );

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// app.listen(PORT, "0.0.0.0", function () {
server.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});
