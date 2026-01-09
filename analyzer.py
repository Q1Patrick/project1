import spacy
from skill_db import SKILLS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

nlp = spacy.load("en_core_web_sm")

def extract_skills(text):
    found_skills = []
    for skill in SKILLS:
        if skill in text:
            found_skills.append(skill)
    return list(set(found_skills))

def match_job(cv_text, job_text):
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([cv_text, job_text])
    similarity = cosine_similarity(vectors[0], vectors[1])[0][0]
    return round(similarity * 100, 2)

def analyze_cv(cv_text, job_text=None):
    skills = extract_skills(cv_text)

    result = {
        "skills_found": skills,
        "skill_count": len(skills),
    }

    if job_text:
        result["job_matching_score"] = match_job(cv_text, job_text)

    return result
