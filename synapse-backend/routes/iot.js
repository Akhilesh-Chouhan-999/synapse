import express from "express";
import { edgePreprocess } from "../services/edgeProcessor.js";
import { addBlock } from "../services/blockchainCore.js";

const router = express.Router();

router.post("/sendData", async (req, res) => {
  const { sensorId, payload } = req.body;
  const edgeResult = await edgePreprocess({ sensorId, payload });
  const block = await addBlock({ sensorId, data: payload });

  res.json({
    status: "ok",
    next: "edge-layer",
    validated: edgeResult,
    blockHash: block.hash,
  });
});

export default router;  // ✅ THIS LINE FIXES YOUR ERROR
