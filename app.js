const express = require("express");
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

function requestLogger(req, res, next) {
  console.log(`RECEBIDO: [${req.method}] ${req.path}`)
  next()
}

app.use(requestLogger)

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.status(200).send("OK");
});

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("WEBHOOK VERIFIED");
    return res.status(200).send(challenge);
  }

  return res.status(403).send("Forbidden");
});

app.post("/webhook", (req, res) => {
  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
  console.log(`\nWebhook received ${timestamp}`);
  console.log(JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

app.post("/webhook/messages", (req, res) => {
  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
  console.log(`\nWebhook received ${timestamp}`);
  console.log(JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on port ${PORT}`);
});