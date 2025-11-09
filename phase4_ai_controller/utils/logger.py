# phase4_ai_controller/utils/logger.py
from datetime import datetime

def log_info(message: str):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] [INFO] {message}")

def log_error(message: str):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] [ERROR] {message}")


# --- CORRECTED FUNCTION ---
def log_event(message: str): # Added type hint
    # Fixed: Removed the extra '.datetime'
    timestamp = datetime.now().strftime("%H:%M:%S") 
    print(f"[{timestamp}] {message}")