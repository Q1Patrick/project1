from decimal import Decimal
from typing import Optional
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import PlanPrice, Voucher
from .serializers import CheckoutPreviewSerializer

def compute_tax(country: str, amount: Decimal) -> Decimal:
    """
    Demo: US tax 1.05%, VN 0%, others 2%
    Bạn đổi rule theo ý.
    """
    country = (country or "").strip().upper()
    if country in ["US", "USA", "UNITED STATES"]:
        return (amount * Decimal("0.0105")).quantize(Decimal("0.01"))
    if country in ["VN", "VIETNAM"]:
        return Decimal("0.00")
    return (amount * Decimal("0.02")).quantize(Decimal("0.01"))


def apply_voucher(subtotal: Decimal, voucher: Optional[Voucher]) -> Decimal:
    if not voucher:
        return Decimal("0.00")

    # nếu voucher có hàm is_valid()
    if hasattr(voucher, "is_valid") and not voucher.is_valid():
        return Decimal("0.00")

    # Ví dụ: voucher giảm theo % hoặc giảm thẳng tiền
    # Tuỳ model Voucher của bạn đang có field gì:
    if getattr(voucher, "percent_off", None):
        percent = Decimal(str(voucher.percent_off))  # ví dụ 10 = 10%
        discount = (subtotal * percent / Decimal("100")).quantize(Decimal("0.01"))
        return min(discount, subtotal)

    if getattr(voucher, "amount_off", None):
        amount = Decimal(str(voucher.amount_off)).quantize(Decimal("0.01"))
        return min(amount, subtotal)

    return Decimal("0.00")


def preview_total(*, price_item: PlanPrice, country: str, voucher_code: Optional[str] = None):
    subtotal = Decimal(price_item.price)
    voucher = None
    if voucher_code:
        try:
            voucher = Voucher.objects.get(code=voucher_code.strip().upper())
        except Voucher.DoesNotExist:
            voucher = None

    discount = apply_voucher(subtotal, voucher)
    taxable = subtotal - discount
    tax = compute_tax(country, taxable)
    total = (taxable + tax).quantize(Decimal("0.01"))

    return {
        "subtotal": subtotal,
        "discount": discount,
        "tax": tax,
        "total": total,
        "voucher_valid": bool(voucher and voucher.is_valid()),
        "voucher_code": voucher.code if voucher else None,
    }
class PreviewTotalAPI(APIView):
    def post(self, request):
        price_code = request.data.get("price_code")
        country = request.data.get("country")
        voucher_code = request.data.get("voucher_code")

        if not price_code or not country:
            return Response(
                {"error": "price_code and country are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            price_item = PlanPrice.objects.select_related("plan").get(code=price_code)
        except PlanPrice.DoesNotExist:
            return Response({"error": "Invalid price_code"}, status=status.HTTP_400_BAD_REQUEST)

        subtotal = Decimal(price_item.price)
        voucher = None

        if voucher_code:
            voucher_code = str(voucher_code).strip().upper()
            try:
                voucher = Voucher.objects.get(code=voucher_code)
            except Voucher.DoesNotExist:
                voucher = None

        discount = apply_voucher(subtotal, voucher)
        taxable = subtotal - discount
        tax = compute_tax(country, taxable)
        total = (taxable + tax).quantize(Decimal("0.01"))

        return Response({
            "plan": price_item.plan.code,
            "price_code": price_item.code,
            "currency": price_item.currency,
            "subtotal": str(subtotal),
            "discount": str(discount),
            "tax": str(tax),
            "total": str(total),
            "voucher_valid": bool(voucher and voucher.is_valid()),
        }, status=status.HTTP_200_OK)
    
class CheckoutPreviewAPI(APIView):
    def post(self, request):
        ser = CheckoutPreviewSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        data = ser.validated_data

        plan_code = data["plan_code"]
        tier = data["tier"]
        billing_cycle = data["billing_cycle"]
        country = data["country"]
        voucher_code = data.get("voucher_code") or None

        # (tuỳ bạn) map country -> currency nếu cần
        # currency = "VND" if country.upper() == "VN" else "USD"

        try:
            price_item = PlanPrice.objects.select_related("plan").get(
                plan__code=plan_code,
                tier=tier,
                billing_cycle=billing_cycle,
                # currency=currency,  # mở nếu DB có currency theo quốc gia
            )
        except PlanPrice.DoesNotExist:
            # Trả 400 cho dễ debug (không nên 404)
            available = list(
                PlanPrice.objects.filter(plan__code=plan_code)
                .values("tier", "billing_cycle", "currency", "price", "code")
            )
            return Response(
                {
                    "error": "PlanPrice not found for given plan/tier/billing_cycle",
                    "input": {
                        "plan_code": plan_code,
                        "tier": tier,
                        "billing_cycle": billing_cycle,
                    },
                    "available_prices_for_plan": available,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # reuse logic bạn viết
        subtotal = Decimal(price_item.price)
        voucher = None
        if voucher_code:
            try:
                voucher = Voucher.objects.get(code=voucher_code.strip().upper())
            except Voucher.DoesNotExist:
                voucher = None

        discount = apply_voucher(subtotal, voucher)
        taxable = subtotal - discount
        tax = compute_tax(country, taxable)
        total = (taxable + tax).quantize(Decimal("0.01"))

        return Response(
            {
                "plan": price_item.plan.code,
                "tier": price_item.tier,
                "billing_cycle": price_item.billing_cycle,
                "price_code": price_item.code,
                "currency": price_item.currency,
                "subtotal": str(subtotal),
                "discount": str(discount),
                "tax": str(tax),
                "total": str(total),
                "voucher_valid": bool(voucher and getattr(voucher, "is_valid", lambda: True)()),
            },
            status=status.HTTP_200_OK,
        )