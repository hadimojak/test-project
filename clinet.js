const WebSocket = require("ws");

const socket = new WebSocket("ws://localhost:8080", {
  headers: {
    token: "abcd",
  },
});

socket.addEventListener("open", (event) => {
  socket.send("Hello Server!");
});

socket.addEventListener("message", function (event) {
  console.log("Message from server ", JSON.parse(event.data));
});
