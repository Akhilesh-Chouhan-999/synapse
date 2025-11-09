import express from "express";
const app = express();
app.use(express.json());

app.post("/receiveData", (req, res) => {
  console.log("📦 Received Data:", req.body);
  res.status(200).send("Data received");
});

app.listen(5000, () => console.log("🚀 Mock Edge Gateway running on port 5000"));
