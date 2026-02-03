from flask import Flask, request, jsonify
from quiz_analysis import analyze_quiz
from career_recommendation import recommend_career

app = Flask(__name__)

@app.route("/quiz/submit", methods=["POST"])
def submit_quiz():
    data = request.json or {}
    answers = data.get("answers")

    try:
        quiz_result = analyze_quiz(answers)
        careers = recommend_career(quiz_result)

        return jsonify({
            "quiz_result": quiz_result,
            "recommended_careers": careers
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "CM-4.3 OK"})


if __name__ == "__main__":
    app.run(debug=True)


