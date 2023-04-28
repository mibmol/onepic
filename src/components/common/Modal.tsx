import { Dialog, Transition } from "@headlessui/react"
import { AriaRole, FC, Fragment, PropsWithChildren, ReactElement } from "react"
import { Text } from "./Text"
import { Button, ButtonVariant } from "./Button"

type ModalProps = {
  show: boolean
  onClose: () => void
  titleToken: string
  role: AriaRole
  closeOnClickOutside?: boolean
  actions?: {
    key: string
    variant: ButtonVariant
    labelToken: string
    onClick: () => void
    disabled?: boolean
    loading?: boolean
  }[]
}

export const Modal: FC<PropsWithChildren<ModalProps>> = ({
  show,
  onClose,
  titleToken,
  children,
  role,
  closeOnClickOutside = false,
  actions = [],
}) => {
  return (
    <Transition show={show} as={Fragment}>
      <Dialog
        as="div"
        open={show}
        className="relative z-max"
        static
        {...{ role }}
        onClose={closeOnClickOutside ? onClose : () => {}}
      >
        {show && (
          <div className="fixed inset-0 bg-gray-700 opacity-50 dark:bg-gray-900" />
        )}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 flex justify-center items-center overflow-y-auto">
            <Dialog.Panel className="px-9 py-8 transition-all transform bg-white shadow-lg rounded-2xl dark:bg-gray-800">
              <Dialog.Title className="flex justify-between">
                <Text as="h1" labelToken={titleToken} size="xl" medium />
              </Dialog.Title>
              <Dialog.Description as="div">
                <div className="mt-4 mb-6">{children}</div>
                <div className="flex justify-end">
                  {actions.map(
                    ({ key, variant, onClick, labelToken, disabled, loading }) => (
                      <Button
                        key={key}
                        className="ml-3 py-2"
                        {...{ variant, onClick, labelToken, disabled, loading }}
                      />
                    ),
                  )}
                </div>
              </Dialog.Description>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}

export const FullScreenView: FC<PropsWithChildren<ModalProps>> = ({
  show,
  onClose,
  titleToken,
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
            <div className="fixed inset-0 bg-gray-100 opacity-50" />
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
            <Dialog.Panel className="min-h-fit transition-all transform bg-white shadow-lg rounded-2xl">
              <Dialog.Title as={Fragment}>{titleToken}</Dialog.Title>
              <Dialog.Description>{children}</Dialog.Description>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
