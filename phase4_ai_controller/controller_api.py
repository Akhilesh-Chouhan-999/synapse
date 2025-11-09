from flask import Flask, request, jsonify
import time
from utils.blockchain_feedback import adjust_blockchain_parameters
from utils.logger import log_event

app = Flask(__name__)

@app.route("/controller/updateMetrics", methods=["POST"])
def update_metrics():
    try:
        payload = request.get_json()
        layer = payload.get("layer", "unknown")
        cid = payload.get("cid", "none")
        size = payload.get("size", 0)

        # log incoming event
        log_event(f"[Controller] Received metrics from {layer}: CID={cid}, size={size}")

        # Simulate AI-driven recommendation
        recommendation = adjust_blockchain_parameters(layer, size)

        return jsonify({
            "status": "processed",
            "layer": layer,
            "cid": cid,
            "recommendation": recommendation,
            "timestamp": int(time.time())
        })
    except Exception as e:
        log_event(f"[ERROR] {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5005, debug=True)
