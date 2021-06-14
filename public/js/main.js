const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
// get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
// console.log(username,room)
const socket = io();
//Join chatroom
socket.emit("joinRoom", { username, room });
//get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});
// message from server
socket.on("message", (message) => {
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// submit chat
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // get message text
  const msg = e.target.elements.msg.value;
  //emit a msg to server
  socket.emit("chatMessage", msg);
  //clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});
// function outputMessage to DOM
function outputMessage(msg) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${msg.userName} <span>${msg.time}</span></p>
                    <p class="text">
                        ${msg.text}
                    </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

function outputRoomName(room) {
  const roomName = document.querySelector("#room-name");
  roomName.innerHTML = room;
}
function outputUsers(users) {
  const usersList = document.querySelector("#users");
  for (var i = 0; i < users.length; i++) {
    const li = document.createElement("li");
    li.innerHTML = users[i].username;
    usersList.appendChild(li);
  }
}
