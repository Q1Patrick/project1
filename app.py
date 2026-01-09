from flask import Flask, request, jsonify
import os
from cvparser import extract_text
from analyzer import analyze_cv

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/analyze-cv", methods=["POST"])
def analyze():
    file = request.files.get("cv")
    job_desc = request.form.get("job_description", "")

    if not file:
        return jsonify({"error": "No CV uploaded"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    cv_text = extract_text(file_path)
    result = analyze_cv(cv_text, job_desc)

    return jsonify({"status": "success", "analysis": result})

if __name__ == "__main__":
    app.run(debug=True)
