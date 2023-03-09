import { Dialog, Transition } from "@headlessui/react"
import { AriaRole, FC, Fragment, PropsWithChildren, ReactNode } from "react"

type ModalProps = {
  show: boolean
  onClose: () => void
  title: ReactNode
  role: AriaRole
}

export const Modal: FC<PropsWithChildren<ModalProps>> = ({
  show,
  onClose,
  title,
  children,
  role,
}) => {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        {...{ onClose, role }}
      >
        <div className="flex items-center justify-center h-screen text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-100 opacity-50" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="min-h-fit transition-all transform bg-white shadow-lg rounded-2xl">
              <Dialog.Title as={Fragment}>{title}</Dialog.Title>
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export const FullScreenView: FC<PropsWithChildren<ModalProps>> = ({
  show,
  onClose,
  title,
  children,
  role,
}) => {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        {...{ onClose, role }}
      >
        <div className="flex items-center justify-center h-screen text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-100 opacity-50" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="min-h-fit transition-all transform bg-white shadow-lg rounded-2xl">
              <Dialog.Title as={Fragment}>{title}</Dialog.Title>
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
