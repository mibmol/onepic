import { toast, ToastOptions } from "react-hot-toast"
import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline"

export const notification = {
  success: toast.success,
  error: toast.error,
  info: (message: string, options?: ToastOptions) =>
    toast(message, {
      icon: <InformationCircleIcon className="text-yellow-500" width={32} height={32} />,
      ...options,
    }),
  warning: (message: string, options?: ToastOptions) =>
    toast(message, { icon: <ExclamationTriangleIcon />, ...options }),
}
