from django.db import models
from django.contrib.auth.models import User

class CVAnalysis(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="cv_analyses"
    )
    cv_file = models.FileField(upload_to="cvs/")
    extracted_text = models.TextField(blank=True)
    skills_found = models.TextField(blank=True)
    score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
