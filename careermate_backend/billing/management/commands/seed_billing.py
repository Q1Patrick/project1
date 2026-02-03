from django.core.management.base import BaseCommand
from billing.models import Plan, PlanPrice


class Command(BaseCommand):
    help = "Seed prices for premium demo"

    def handle(self, *args, **kwargs):
        # ✅ Dùng lại 3 plan bạn đã seed sẵn (đã có tier rồi)
        free = Plan.objects.get(code="FREE")
        personal = Plan.objects.get(code="PERSONAL_MONTHLY")
        enterprise = Plan.objects.get(code="ENTERPRISE_MONTHLY")

        # ✅ Seed PlanPrice (bạn chỉnh giá theo ảnh)
        PlanPrice.objects.update_or_create(
            plan=personal, tier="PRO", billing_cycle="MONTHLY",
            defaults={"price": 13.90, "currency": "USD", "is_active": True},
        )
        PlanPrice.objects.update_or_create(
            plan=personal, tier="PRO", billing_cycle="ANNUAL",
            defaults={"price": 120.00, "currency": "USD", "is_active": True},
        )

        PlanPrice.objects.update_or_create(
            plan=enterprise, tier="BASIC", billing_cycle="MONTHLY",
            defaults={"price": 9.90, "currency": "USD", "is_active": True},
        )
        PlanPrice.objects.update_or_create(
            plan=enterprise, tier="BASIC", billing_cycle="ANNUAL",
            defaults={"price": 90.00, "currency": "USD", "is_active": True},
        )

        self.stdout.write(self.style.SUCCESS("Seed billing done."))
