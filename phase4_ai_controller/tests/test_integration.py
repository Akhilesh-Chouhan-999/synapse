# phase4_ai_controller/tests/test_integration.py
import time
from utils.blockchain_feedback import send_metrics_to_ai, apply_blockchain_adjustments

def simulate_blockchain_feedback():
    sample_metrics = {
        "tps": 850,
        "latency": 130,
        "cpu": 78,
        "memory": 65
    }

    print("\n🌐 SYNAPSE Phase-4.2: Blockchain Feedback Simulation Started...\n")

    while True:
        result = send_metrics_to_ai(sample_metrics)
        recommendation = result.get("recommendation")
        apply_blockchain_adjustments(recommendation)
        time.sleep(5)   # simulate periodic monitoring

if __name__ == "__main__":
    simulate_blockchain_feedback()
