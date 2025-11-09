# Use lightweight Python image
FROM python:3.10-slim

WORKDIR /app
COPY . .

RUN pip install --no-cache-dir flask numpy scikit-learn

CMD ["python", "app.py"]
