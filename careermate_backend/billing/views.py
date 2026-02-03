from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import timedelta

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import Plan, PlanPrice, BillingOrder, Subscription, Voucher
from .serializers import PlanSerializer, CheckoutPreviewSerializer, CheckoutConfirmSerializer, SubscriptionSerializer
from .services import preview_total

from rest_framework.views import APIView
from .models import PlanPrice, Subscription
from .serializers import (
    PlanSerializer,
    CheckoutPreviewSerializer,
    CheckoutConfirmSerializer,
    SubscriptionSerializer,
    CheckoutPreviewByCodeSerializer,
)

@api_view(["GET"])
@permission_classes([AllowAny])
def list_plans(request):
    qs = Plan.objects.filter(is_active=True).prefetch_related("prices")
    return Response(PlanSerializer(qs, many=True).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def checkout_preview(request):
    # ✅ Nếu client gửi price_code thì ưu tiên xử lý kiểu price_code
    if request.data.get("price_code"):
        s = CheckoutPreviewByCodeSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        data = s.validated_data

        price_item = get_object_or_404(
            PlanPrice,
            code=data["price_code"],
            is_active=True,
            plan__is_active=True,
        )

        result = preview_total(
            price_item=price_item,
            country=data["country"],
            voucher_code=data.get("voucher_code"),
        )

        return Response({
            "plan_code": price_item.plan.code,
            "tier": price_item.tier,
            "billing_cycle": price_item.billing_cycle,
            "price_code": price_item.code,
            "currency": price_item.currency,
            **{k: str(v) for k, v in result.items() if k in ["subtotal", "discount", "tax", "total"]},
            "voucher_valid": result["voucher_valid"],
            "voucher_code": result["voucher_code"],
        })

    # ✅ Còn lại giữ nguyên kiểu cũ: plan_code + tier + billing_cycle
    s = CheckoutPreviewSerializer(data=request.data)
    s.is_valid(raise_exception=True)
    data = s.validated_data

    price_item = get_object_or_404(
        PlanPrice,
        plan__code=data["plan_code"],
        tier=data["tier"],
        billing_cycle=data["billing_cycle"],
        is_active=True,
        plan__is_active=True,
    )

    result = preview_total(
        price_item=price_item,
        country=data["country"],
        voucher_code=data.get("voucher_code"),
    )

    return Response({
        "plan_code": data["plan_code"],
        "tier": data["tier"],
        "billing_cycle": data["billing_cycle"],
        "currency": price_item.currency,
        **{k: str(v) for k, v in result.items() if k in ["subtotal", "discount", "tax", "total"]},
        "voucher_valid": result["voucher_valid"],
        "voucher_code": result["voucher_code"],
    })



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def checkout_confirm(request):
    s = CheckoutConfirmSerializer(data=request.data)
    s.is_valid(raise_exception=True)
    data = s.validated_data

    price_item = get_object_or_404(
        PlanPrice,
        plan__code=data["plan_code"],
        tier=data["tier"],
        billing_cycle=data["billing_cycle"],
        is_active=True,
        plan__is_active=True,
    )

    result = preview_total(
        price_item=price_item,
        country=data["country"],
        voucher_code=data.get("voucher_code"),
    )

    voucher = None
    if result["voucher_code"]:
        voucher = Voucher.objects.filter(code=result["voucher_code"]).first()

    # Tạo Order
    order = BillingOrder.objects.create(
        user=request.user,
        email=data["email"],
        country=data["country"],
        plan=price_item.plan,
        price_item=price_item,
        voucher=voucher,
        subtotal=result["subtotal"],
        discount=result["discount"],
        tax=result["tax"],
        total=result["total"],
        status="PAID",  # DEMO: coi như đã thanh toán
    )

    # Kích hoạt subscription (DEMO)
    # Nếu annual thì +365 ngày, monthly thì +30 ngày
    duration_days = 365 if price_item.billing_cycle == "ANNUAL" else 30
    ends_at = timezone.now() + timedelta(days=duration_days)

    sub, _ = Subscription.objects.update_or_create(
        user=request.user,
        defaults={
            "plan": price_item.plan,
            "price_item": price_item,
            "starts_at": timezone.now(),
            "ends_at": ends_at,
            "is_active": True,
        }
    )

    return Response({
        "message": "Checkout success (demo)",
        "order_id": order.id,
        "subscription": SubscriptionSerializer(sub).data,
    }, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_subscription(request):
    sub = Subscription.objects.filter(user=request.user).first()
    if not sub:
        return Response({"subscription": None})
    return Response(SubscriptionSerializer(sub).data)

class PlanListAPI(APIView):
    def get(self, request):
        plans = Plan.objects.all().order_by("id")
        data = [
            {
                "id": p.id,
                "code": p.code,
                "name": p.name,
                "tier": getattr(p, "tier", None),
            }
            for p in plans
        ]
        return Response(data, status=status.HTTP_200_OK)
    
class CheckoutAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        price_code = request.data.get("price_code")
        country = request.data.get("country")

        if not price_code or not country:
            return Response({"error": "price_code and country are required"}, status=400)

        try:
            price_item = PlanPrice.objects.select_related("plan").get(code=price_code)
        except PlanPrice.DoesNotExist:
            return Response({"error": "Invalid price_code"}, status=400)

        # (demo) tạo order trạng thái pending (chưa tích hợp cổng thanh toán)
        order = Order.objects.create(
            user=request.user,
            plan=price_item.plan,
            price_item=price_item,
            country=country,
            status="PENDING",
        )

        # (demo) tạo subscription tạm (hoặc chỉ tạo khi payment success)
        Subscription.objects.create(
            user=request.user,
            plan=price_item.plan,
            status="ACTIVE",   # demo
            started_at=timezone.now(),
        )

        return Response({
            "order_id": order.id,
            "message": "Checkout created (demo). Subscription activated."
        }, status=status.HTTP_201_CREATED)