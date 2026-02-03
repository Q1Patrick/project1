from django.core.management.base import BaseCommand
from billing.models import Plan


class Command(BaseCommand):
    help = "Seed default pricing plans"

    def handle(self, *args, **kwargs):
        plans = [
            dict(
                code="FREE",
                tier="free",
                name="Free Plan",
                price_cents=0,
                currency="usd",
                interval="month",
            ),
            dict(
                code="PERSONAL_MONTHLY",
                tier="personal",
                name="Personal Plan",
                price_cents=1390,  # $13.90
                currency="usd",
                interval="month",
            ),
            dict(
                code="ENTERPRISE_MONTHLY",
                tier="enterprise",
                name="Enterprise Plan",
                price_cents=990,  # $9.90
                currency="usd",
                interval="month",
            ),
        ]

        for p in plans:
            Plan.objects.update_or_create(code=p["code"], defaults=p)

        self.stdout.write(self.style.SUCCESS("Seed plans OK"))
