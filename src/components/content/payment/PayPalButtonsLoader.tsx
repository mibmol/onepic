import { Spinner } from "@/components/common/icons"
import {
  PayPalButtons,
  PayPalButtonsComponentProps,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js"
import { FC } from "react"

export const PayPalButtonsLoader: FC<PayPalButtonsComponentProps> = ({
  className,
  ...props
}) => {
  const [{ isPending }] = usePayPalScriptReducer()

  return isPending ? (
    <Spinner
      className="animate-spin stroke-1 w-12 mx-auto"
      circleStroke="#33333366"
      semiCircleStroke="#333333"
    />
  ) : (
    <PayPalButtons {...props} className={className} />
  )
}
