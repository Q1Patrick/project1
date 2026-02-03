def recommend_career(quiz_result):
    careers = []

    if quiz_result["technical"] >= 80 and quiz_result["analytical"] >= 70:
        careers.append("Backend Developer")

    if quiz_result["creative"] >= 75:
        careers.append("UI/UX Designer")

    if quiz_result["communication"] >= 70:
        careers.append("Business Analyst")

    if quiz_result["leadership"] >= 75:
        careers.append("Project Manager")

    if not careers:
        careers.append("General IT Graduate (Explore multiple roles)")

    return careers
