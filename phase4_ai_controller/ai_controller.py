import os
import joblib
import traceback
from utils.model_trainer import log_training_data, retrain_model

class AIController:
    def __init__(self):
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        self.model_path = os.path.join(BASE_DIR, "model", "ai_controller_model.pkl")
        self.coefficients = {"latency": -0.2, "tps": 0.3, "cpu": -0.1, "memory": -0.05}
        self.model = None

        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
            print("✅ Loaded trained model.")
        else:
            print("⚙️ Using default heuristic weights.")

    def analyze_metrics(self, metrics: dict):
        try:
            X = [[
                float(metrics.get("tps", 0)),
                float(metrics.get("latency", 0)),
                float(metrics.get("cpu", 0)),
                float(metrics.get("memory", 0))
            ]]

            if self.model:
                print("📊 Using trained model for prediction...")
                score = float(self.model.predict(X)[0])
            else:
                score = sum(metrics[k] * self.coefficients.get(k, 0) for k in metrics)

            recommendation = self._generate_recommendation(score)
            print("✅ Score:", score, "| Recommendation:", recommendation)

            log_training_data(metrics, score)
            retrain_model()

            return {"score": round(score, 3), "recommendation": recommendation}

        except Exception as e:
            print("❌ Error in analyze_metrics:", e)
            print(traceback.format_exc())
            return {"score": 0, "recommendation": "none"}

    def _generate_recommendation(self, score):
        if score > 10:
            return "Reduce block size and delegate count"
        elif score > 5:
            return "Maintain current configuration"
        else:
            return "Increase delegate count or block size"
