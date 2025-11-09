# phase4_ai_controller/utils/blockchain_feedback.py
import requests
import json
from utils.logger import log_info, log_error

AI_CONTROLLER_URL = "http://127.0.0.1:8083/analyze"

def send_metrics_to_ai(metrics: dict):
    """Send blockchain metrics to AI controller and get recommendation."""
    try:
        log_info(f"📤 Sending metrics to AI Controller: {metrics}")
        response = requests.post(AI_CONTROLLER_URL, json=metrics, timeout=5)
        result = response.json()
        log_info(f"✅ Received recommendation: {result}")
        return result["result"]
    except Exception as e:
        log_error(f"❌ Failed to contact AI controller: {e}")
        return {"recommendation": "none"}



def adjust_blockchain_parameters(layer, size):
    # Generate a rule-based decision
    if size > 5000:
        recommendation = {"action": "increase_block_size", "new_size": 15}
    elif size < 500:
        recommendation = {"action": "decrease_block_size", "new_size": 5}
    else:
        recommendation = {"action": "maintain", "new_size": 10}

    # Send it directly to Blockchain Core
    if recommendation["action"] != "maintain":
        try:
            r = requests.post(
                "http://localhost:5003/blockchain/updateConfig",
                json=recommendation,
                timeout=5
            )
            print(f"📡 Blockchain updated: {r.json()}")
        except Exception as e:
            print(f"⚠️ Blockchain update failed: {e}")

    return recommendation

def apply_blockchain_adjustments(recommendation: str):
    """
    Simulate sending a command to the blockchain core.
    In real system, this would call a REST endpoint or smart contract method.
    """
    log_info(f"⚙️ Applying adjustment → {recommendation}")
    # Simulated logic
    if "Reduce" in recommendation:
        log_info("🧩 Decreasing block size and delegate count.")
    elif "Increase" in recommendation:
        log_info("🧩 Increasing block size or delegate count.")
    else:
        log_info("🧩 Maintaining current configuration.")

def adjust_blockchain_parameters(layer, size):
    if size > 5000:
        return {"action": "increase_block_size", "new_size": 15}
    elif size < 500:
        return {"action": "decrease_block_size", "new_size": 5}
    else:
        return {"action": "maintain", "new_size": 10}
