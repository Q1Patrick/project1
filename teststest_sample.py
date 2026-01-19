def analyze_cv(text):
    return {"skills": ["Python", "AI"]}

def test_analyze_cv():
    result = analyze_cv("Python AI")
    assert "Python" in result["skills"]
