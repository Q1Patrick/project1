from django.conf import settings
from django.db import models
from django.utils import timezone


class Plan(models.Model):
    """
    Ví dụ: FREE, PERSONAL, ENTERPRISE (bạn đã seed rồi)
    """
    code = models.CharField(max_length=50, unique=True)   # FREE / PERSONAL / ENTERPRISE
    name = models.CharField(max_length=120)              # Free Plan / Personal Plan ...
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.code} - {self.name}"


class PlanPrice(models.Model):
    """
    Giá theo Tier + Billing cycle (monthly/annual)
    VD: PERSONAL + PRO + MONTHLY = 13.9
    """
    BILLING_CYCLE_CHOICES = [
        ("MONTHLY", "Monthly"),
        ("ANNUAL", "Annual"),
    ]
    TIER_CHOICES = [
        ("BASIC", "Basic"),
        ("PRO", "Pro"),
        ("STANDARD", "Standard"),
    ]

    plan = models.ForeignKey(Plan, on_delete=models.CASCADE, related_name="prices")
    tier = models.CharField(max_length=20, choices=TIER_CHOICES)
    billing_cycle = models.CharField(max_length=20, choices=BILLING_CYCLE_CHOICES)

    currency = models.CharField(max_length=10, default="USD")
    price = models.DecimalField(max_digits=10, decimal_places=2)  # 13.90
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ("plan", "tier", "billing_cycle")

    def __str__(self):
        return f"{self.plan.code}-{self.tier}-{self.billing_cycle}: {self.price} {self.currency}"


class Voucher(models.Model):
    code = models.CharField(max_length=30, unique=True)     # VD: NEWYEAR10
    percent_off = models.PositiveIntegerField(default=0)    # 10 = giảm 10%
    amount_off = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # giảm tiền cố định
    is_active = models.BooleanField(default=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    def is_valid(self) -> bool:
        if not self.is_active:
            return False
        if self.expires_at and timezone.now() > self.expires_at:
            return False
        return True

    def __str__(self):
        return self.code


class BillingOrder(models.Model):
    """
    Đơn hàng tạo khi user bấm Continue
    """
    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("PAID", "Paid"),
        ("FAILED", "Failed"),
        ("CANCELLED", "Cancelled"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="billing_orders")
    email = models.EmailField()
    country = models.CharField(max_length=80)

    plan = models.ForeignKey(Plan, on_delete=models.PROTECT)
    price_item = models.ForeignKey(PlanPrice, on_delete=models.PROTECT)

    voucher = models.ForeignKey(Voucher, on_delete=models.SET_NULL, null=True, blank=True)

    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order#{self.id} {self.user} {self.status}"


class Subscription(models.Model):
    """
    Gói premium đang kích hoạt của user
    """
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="subscription")
    plan = models.ForeignKey(Plan, on_delete=models.PROTECT)
    price_item = models.ForeignKey(PlanPrice, on_delete=models.PROTECT)
    starts_at = models.DateTimeField(default=timezone.now)
    ends_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user} -> {self.plan.code} ({'active' if self.is_active else 'inactive'})"

class Order(models.Model):
    STATUS_CHOICES = (
        ("PENDING", "PENDING"),
        ("PAID", "PAID"),
        ("FAILED", "FAILED"),
        ("CANCELLED", "CANCELLED"),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    plan = models.ForeignKey("Plan", on_delete=models.CASCADE)
    price_item = models.ForeignKey("PlanPrice", on_delete=models.CASCADE)
    country = models.CharField(max_length=50, default="VN")
    currency = models.CharField(max_length=10, default="VND")

    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tax = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order#{self.id} - {self.user} - {self.status}"