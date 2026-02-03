from rest_framework import serializers
from .models import Plan, PlanPrice, BillingOrder, Subscription


class PlanPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanPrice
        fields = ["id", "tier", "billing_cycle", "currency", "price"]


class PlanSerializer(serializers.ModelSerializer):
    prices = PlanPriceSerializer(many=True)

    class Meta:
        model = Plan
        fields = ["id", "code", "name", "prices"]


class CheckoutPreviewSerializer(serializers.Serializer):
    email = serializers.EmailField()
    country = serializers.CharField(max_length=80)

    plan_code = serializers.CharField()           # PERSONAL / ENTERPRISE
    tier = serializers.ChoiceField(choices=["BASIC", "PRO", "STANDARD"])
    billing_cycle = serializers.ChoiceField(choices=["MONTHLY", "ANNUAL"])
    voucher_code = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        attrs["plan_code"] = attrs["plan_code"].strip().upper()
        if attrs.get("voucher_code"):
            attrs["voucher_code"] = attrs["voucher_code"].strip().upper()
        return attrs


class CheckoutConfirmSerializer(CheckoutPreviewSerializer):
    email = serializers.EmailField()
    plan_code = serializers.CharField()
    tier = serializers.CharField()
    billing_cycle = serializers.CharField()
    country = serializers.CharField()
    voucher_code = serializers.CharField(required=False, allow_blank=True, allow_null=True)


class BillingOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillingOrder
        fields = "__all__"


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = "__all__"

class CheckoutPreviewByCodeSerializer(serializers.Serializer):
    price_code = serializers.CharField()
    country = serializers.CharField(max_length=80)
    voucher_code = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        attrs["price_code"] = attrs["price_code"].strip().upper()
        attrs["country"] = attrs["country"].strip().upper()
        if attrs.get("voucher_code"):
            attrs["voucher_code"] = attrs["voucher_code"].strip().upper()
        return attrs
