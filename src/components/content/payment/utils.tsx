import { PayPalButtonsComponentProps } from "@paypal/react-paypal-js"

export type CreateOrderHandler = PayPalButtonsComponentProps["createOrder"]
export type OnApproveHandler = PayPalButtonsComponentProps["onApprove"]
export type CreateSubscriptionHandler = PayPalButtonsComponentProps["createSubscription"]