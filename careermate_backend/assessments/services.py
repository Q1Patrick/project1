# assessments/services.py

def analyze_quiz_results(answers):
    """
    Input: Danh sách câu trả lời từ Frontend
    Output: Điểm % của từng nhóm (Technical, Creative...)
    """
    categories_score = {
        "technical": 0, "analytical": 0, "creative": 0, 
        "communication": 0, "leadership": 0
    }
    categories_max = {k: 0 for k in categories_score} # Lưu tổng điểm tối đa có thể đạt được

    for ans in answers:
        cat = ans.get("category")
        score = ans.get("score", 0) # Điểm người dùng chọn (VD: 4)
        max_val = ans.get("max_score", 5) # Điểm tối đa của câu đó (VD: 5)

        if cat in categories_score:
            categories_score[cat] += score
            categories_max[cat] += max_val

    # Tính ra phần trăm (0 - 100%)
    results = {}
    for cat, total_score in categories_score.items():
        max_possible = categories_max[cat]
        if max_possible > 0:
            results[cat] = round((total_score / max_possible) * 100, 2)
        else:
            results[cat] = 0
            
    return results

def recommend_career_path(percentage_results):
    """
    Gợi ý nghề nghiệp dựa trên % (Logic linh hoạt hơn)
    """
    careers = []
    
    # Logic gợi ý (Dựa trên %)
    # Nếu Technical > 70% VÀ Analytical > 60%
    if percentage_results["technical"] >= 70 and percentage_results["analytical"] >= 60:
        careers.append({
            "role": "Backend Developer",
            "reason": "Bạn có tư duy logic và kỹ thuật tốt."
        })

    if percentage_results["creative"] >= 65:
        careers.append({
            "role": "UI/UX Designer",
            "reason": "Khả năng sáng tạo của bạn rất nổi bật."
        })

    if percentage_results["communication"] >= 70 and percentage_results["leadership"] >= 50:
        careers.append({
            "role": "Business Analyst / PM",
            "reason": "Bạn giỏi giao tiếp và có tố chất quản lý."
        })

    # Fallback: Nếu không khớp cái nào cao hẳn
    if not careers:
        # Tìm kỹ năng cao nhất
        best_skill = max(percentage_results, key=percentage_results.get)
        careers.append({
            "role": "Fresher / Trainee",
            "reason": f"Hãy bắt đầu khám phá các vị trí thiên về {best_skill}."
        })

    return careers