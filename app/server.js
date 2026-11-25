const express = require("express");
const os = require("os");
const app = express();

app.get("/", (req, res) => {
  res.send(`<h1>Hello from AKS</h1><p>Pod: ${os.hostname()}</p><p>Version: v1</p>`);
});

app.get("/healthz", (req, res) => res.status(200).send("ok"));

// Burns CPU for ~1 second, used only to demo autoscaling
app.get("/load", (req, res) => {
  const end = Date.now() + 1000;
  while (Date.now() < end) { Math.sqrt(Math.random()); }
  res.send("load done");
});

app.listen(3000, () => console.log("Listening on 3000"));
