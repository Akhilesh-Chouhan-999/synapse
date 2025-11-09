# phase4_ai_controller/model/train_model.py
import pandas as pd
from sklearn.linear_model import LinearRegression
import joblib
import os

DATA_PATH = os.path.join(os.path.dirname(__file__), "training_data.csv")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "ai_controller_model.pkl")

def train_initial_model():
    df = pd.read_csv(DATA_PATH)
    X = df[['tps', 'latency', 'cpu', 'memory']]
    y = df['score']

    model = LinearRegression()
    model.fit(X, y)

    joblib.dump(model, MODEL_PATH)
    print("✅ Model trained and saved to", MODEL_PATH)

if __name__ == "__main__":
    train_initial_model()
