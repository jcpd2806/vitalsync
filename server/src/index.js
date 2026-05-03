const express = require("express");
const app = express();
app.get("/", (req, res) => res.json({ status: "VitalSync server alive ✅" }));
app.listen(3001, () => console.log("Server running on :3001"));
