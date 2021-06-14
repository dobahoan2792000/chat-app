const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeaveChat,
  getRoomUsers,
} = require("./utils/user");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(express.static(path.join(__dirname, "public")));
// run when client connect
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    // welcome current user
    socket.emit(
      "message",
      formatMessage("ChatCord Bot", "Welcome to ChatCord!")
    );
    // broadcast when a user connect
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage("ChatCord Bot", username + " has joined the chat!")
      );
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
    // runs when client disconnect
    socket.on("disconnect", () => {
      const user = userLeaveChat(socket.id);
      if (user) {
        io.to(user.room).emit(
          "message",
          formatMessage("ChatCord Bot", user.username + " has left the chat!")
        );
        io.to(user.room).emit("roomUsers", {
          room: user.room,
          users: getRoomUsers(user.room),
        });
      }
    });
  });

  // listen for chatMessage (from submit form)
  socket.on("chatMessage", (message) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, message));
  });
});
const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running at Port ${PORT}`));
