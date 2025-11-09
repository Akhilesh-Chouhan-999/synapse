import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import iotRoutes from "./routes/iot.js";

const app = express();
app.use(bodyParser.json());
app.use("/iot", iotRoutes);

// ✅ CSV download route
app.get("/metrics/download", (req, res) => {
  const logPath = path.join(process.cwd(), "performance_logs.json");
  if (!fs.existsSync(logPath)) {
    return res.status(404).send("No metrics logged yet.");
  }

  const data = JSON.parse(fs.readFileSync(logPath, "utf8"));
  const csv = [
    "eventType,timestamp,sensorId,latency,hash,new_size",
    ...data.map(d =>
      [
        d.eventType || "",
        d.timestamp || "",
        d.sensorId || "",
        d.latency || "",
        d.hash || "",
        d.new_size || "",
      ].join(",")
    ),
  ].join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=performance_metrics.csv");
  res.send(csv);
});

app.listen(4000, () => {
  console.log("🔗 SYNAPSE Integration Server running on port 4000");
});
