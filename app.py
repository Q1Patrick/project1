from flask import Flask, request, jsonify
from coach_service_mock import generate_response, interview_feedback

app = Flask(__name__)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json or {}
    message = data.get("message", "")
    profile = data.get("profile", {})

    if not message:
        return jsonify({"error": "Message is required"}), 400

    reply = generate_response(message, profile)
    return jsonify({"reply": reply})

@app.route("/mock-interview/feedback", methods=["POST"])
def feedback():
    data = request.json or {}
    answer = data.get("answer", "")
    return jsonify(interview_feedback(answer))

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(debug=True)
