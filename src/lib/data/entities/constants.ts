export const PlanType = {
  subscription: "subscription",
  credits: "credits",
}

// https://replicate.com/docs/reference/http#predictions.get
export const ReplicateStatus = {
  starting: "starting",
  processing: "processing",
  succeeded: "succeeded",
  failed: "failed",
  canceled: "canceled",
}

// https://developer.paypal.com/docs/api/subscriptions/v1/#subscriptions_get
export const PaypalSubscriptionStatus = {
  active: "ACTIVE",
  approvalPending: "APPROVAL_PENDING",
  approved: "APPROVED",
  suspended: "SUSPENDED",
  cancelled: "CANCELLED",
  expired: "EXPIRED",
}

export const PaypalWebhook = {
  SALE_COMPLETED: "PAYMENT.SALE.COMPLETED",
  SUBSCRIPTION_CANCELLED: "BILLING.SUBSCRIPTION.CANCELLED",
  SUBSCRIPTION_EXPIRED: "BILLING.SUBSCRIPTION.EXPIRED",
  SUBSCRIPTION_SUSPENDED: "BILLING.SUBSCRIPTION.SUSPENDED",
}
