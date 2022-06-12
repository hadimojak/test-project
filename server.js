const WebSocket = require("ws");
const token = "abcd";

const webSocketSubscription =
  '{"event":"subscribe","pair":["XBT/USD","XBT/EUR","ADA/USD"],"subscription":{"name":"ticker"}}';

const krakenWs = new WebSocket("wss://ws.kraken.com/");
let websocketList = [];

krakenWs.on("open", () => {
  console.log("kraken opened");
  krakenWs.send(webSocketSubscription);
});

krakenWs.on("message", (data) => {
  websocketList.forEach((ws) => {
    ws.send(data);
  });
});

const server = new WebSocket.Server({
  port: 8080,
  verifyClient: (info, cb) => {
    let clientToken = info.req.headers.token;
    if (!token) {
      cb(false, 401, "Unauthorized");
    } else {
      if (token !== clientToken) {
        cb(false, 401, "Unauthorized");
      } else {
        cb(true);
      }
    }
  },
});

server.on("connection", (ws) => {
  websocketList.push(ws);
  console.log("new client connected");

  ws.on("close", () => {
    setTimeout(() => {
      console.log("the client has disconnected");
      ws.terminate();
    }, 5000);
  });
});
console.log("The WebSocket server is running on port 8080");
