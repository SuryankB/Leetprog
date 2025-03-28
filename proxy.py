from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains

LEETCODE_URL = "https://leetcode.com/graphql"

@app.route("/leetcode", methods=["POST"])
def proxy():
    try:
        # Get the request payload (GraphQL query)
        data = request.json  

        # Forward the request to LeetCode API
        response = requests.post(LEETCODE_URL, json=data, headers={"Content-Type": "application/json"})

        # Return the response to the frontend
        return jsonify(response.json())
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
