def analyze_quiz(answers):
    """
    answers = [
        {"category": "technical", "score": 20},
        {"category": "analytical", "score": 15},
        ...
    ]
    """
    categories = {
        "technical": 0,
        "analytical": 0,
        "creative": 0,
        "communication": 0,
        "leadership": 0
    }

    if not answers or not isinstance(answers, list):
        raise ValueError("Invalid quiz answers")

    for q in answers:
        cat = q.get("category")
        score = q.get("score", 0)
        if cat in categories:
            categories[cat] += score

    return categories
