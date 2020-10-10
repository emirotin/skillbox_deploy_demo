require("dotenv").config();

const http = require("http");
const path = require("path");
const express = require("express");
const WebSocketServer = require("ws").Server;

const app = express();

app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  let count = null;

  ws.on("message", (data) => {
    try {
      data = JSON.parse(data);
    } catch (err) {
      return;
    }

    switch (data.type) {
      case "init": {
        count = data.value;
        ws.send(
          JSON.stringify({
            type: "ready",
          })
        );
        break;
      }
      case "dec": {
        if (count === null) {
          return;
        }
        count -= 1;
        ws.send(
          JSON.stringify({
            type: "value",
            value: count,
          })
        );
        break;
      }
      case "inc": {
        if (count === null) {
          return;
        }
        count += 1;
        ws.send(
          JSON.stringify({
            type: "value",
            value: count,
          })
        );
        break;
      }
    }
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(` Listening on http://localhost:${port}`);
});
