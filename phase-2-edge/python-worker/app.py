from flask import Flask, request, jsonify
app = Flask(__name__)

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    # do lightweight ML/inference or rules
    # example: flag if temp > threshold
    temp = data.get('temp')
    flag = temp is not None and temp > 80
    return jsonify({"flag": flag, "recommendation": "none" if not flag else "alert"})
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
