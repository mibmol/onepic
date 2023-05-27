import { always, cond, equals } from "ramda"

export const creditsOptions = [
  { value: "50", labelToken: "50 credits" },
  { value: "100", labelToken: "100 credits" },
  { value: "200", labelToken: "200 credits" },
  { value: "500", labelToken: "500 credits" },
  { value: "1000", labelToken: "1000 credits" },
]

export const getCreditPrice = cond([
  [equals("50"), always({ value: 3, totalCredits: 50 })],
  [equals("100"), always({ value: 5.5, totalCredits: 100, messageToken: "save 8%" })],
  [equals("200"), always({ value: 10, totalCredits: 200, messageToken: "save 10%" })],
  [equals("500"), always({ value: 23, totalCredits: 500, messageToken: "save 8%" })],
  [equals("1000"), always({ value: 45, totalCredits: 1000, messageToken: "save 9%" })],
])

export const getSubscriptionPrice = cond([
  [equals("100"), always({ value: 5, totalCredits: 100, messageToken: "10% discount" })],
  [equals("200"), always({ value: 9.5, totalCredits: 200, messageToken: "8% discount" })],
  [equals("500"), always({ value: 21, totalCredits: 500, messageToken: "9% discount" })],
  [
    equals("1000"),
    always({ value: 40, totalCredits: 1000, messageToken: "11% discount" }),
  ],
])

export const getCreditStripePrice = cond([
  [equals("50"), always(process.env.STRIPE_PRICE_50_CREDITS)],
  [equals("100"), always(process.env.STRIPE_PRICE_100_CREDITS)],
  [equals("200"), always(process.env.STRIPE_PRICE_200_CREDITS)],
  [equals("500"), always(process.env.STRIPE_PRICE_500_CREDITS)],
  [equals("1000"), always(process.env.STRIPE_PRICE_1000_CREDITS)],
])

export const getSubscriptionStripePrice = cond([
  [equals("100"), always(process.env.STRIPE_PRICE_100_SUBSCRIPTION)],
  [equals("200"), always(process.env.STRIPE_PRICE_200_SUBSCRIPTION)],
  [equals("500"), always(process.env.STRIPE_PRICE_500_SUBSCRIPTION)],
  [equals("1000"), always(process.env.STRIPE_PRICE_1000_SUBSCRIPTION)],
])

export const subscriptionOptions = [
  { value: "100", labelToken: "100 credits" },
  { value: "200", labelToken: "200 credits" },
  { value: "500", labelToken: "500 credits" },
  { value: "1000", labelToken: "1000 credits" },
]

const {
  PAYPAL_100_PLAN_ID,
  PAYPAL_200_PLAN_ID,
  PAYPAL_500_PLAN_ID,
  PAYPAL_1000_PLAN_ID,
} = process.env

export const getSubscriptionPlanId = cond([
  [equals("100"), always(PAYPAL_100_PLAN_ID)],
  [equals("200"), always(PAYPAL_200_PLAN_ID)],
  [equals("500"), always(PAYPAL_500_PLAN_ID)],
  [equals("1000"), always(PAYPAL_1000_PLAN_ID)],
])
