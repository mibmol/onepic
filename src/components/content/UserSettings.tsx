import { signOut, useSession } from "next-auth/react"
import { Button, ConfigSection, Img, Modal, Text, TextInput } from "@/components/common"
import {
  cancelUserSubscription,
  getSubscriptionNextChargeTime,
  getUserPlanInfo,
} from "@/lib/client/payment"
import useSWR from "swr"
import { ArrowRightIcon } from "@heroicons/react/24/outline"
import { formatDate, getSubscriptionPrice, notification } from "@/lib/utils"
import { useToggle } from "react-use"
import { useRef } from "react"
import { useMountedState } from "@/lib/hooks"
import { deleteUserAccount, updateUserName } from "@/lib/client/user"
import { useTranslation } from "next-i18next"

export const UserSettings = () => {
  const { data: session } = useSession()
  return (
    <div className="lg:flex mx-auto mt-8">
      <div className="mt-8 lg:mr-16">
        <div className="flex flex-col items-center">
          <Img src={session?.user?.image} className="w-20 rounded-full" />
          <Text bold>{session?.user?.name}</Text>
          <Text medium gray>
            {session?.user?.email}
          </Text>
        </div>
        <div className="mt-8"></div>
      </div>
      <div className="">
        <NameConfig {...session} />
        <PlanConfig {...session} />
        <DeleteAccountConfig />
      </div>
    </div>
  )
}

const NameConfig = ({ user }) => {
  const { t } = useTranslation()
  const [saving, setSaving] = useMountedState(false)
  const userNameRef = useRef<HTMLInputElement>()

  const updateName = async () => {
    setSaving(true)
    try {
      const name = userNameRef.current.value
      await updateUserName(name)
      notification.success(t("Name updated successfully"))
    } catch (error) {
      notification.error(t("Something wrong happened"))
    } finally {
      setSaving(false)
    }
  }

  return (
    <ConfigSection
      titleToken="Your name"
      actionToken="Save"
      actionMessage="Please use 32 characters at maximum."
      actionLoading={saving}
      onActionClick={updateName}
    >
      <Text
        as="label"
        htmlFor="nameInput"
        labelToken="Please enter your full name, or a display name you are comfortable with."
        className="mb-2 ml-1"
        size="sm"
      />
      <TextInput
        id="name"
        name="name"
        ref={userNameRef}
        className="lg:w-1/2 my-2"
        defaultValue={user?.name}
        maxLength={32}
      />
    </ConfigSection>
  )
}

const PlanConfig = ({ user }) => {
  const { data: plan, isLoading } = useSWR("planInfo", getUserPlanInfo, {
    errorRetryCount: 2,
  })

  return (
    <ConfigSection
      titleToken="Plan"
      actionToken={plan?.subscription ? "Upgrade plan" : "Buy credits or Subscribe"}
      actionHref="/pricing"
      actionIcon={ArrowRightIcon}
      className="mt-10"
    >
      {isLoading ? (
        <></>
      ) : (
        <>
          <div>
            <Text labelToken="Your credits balance is currently:" size="md" medium />
            <Text
              labelToken="{{totalCredits}} credits"
              tokenArgs={{ totalCredits: plan?.credits }}
              className="ml-2"
              bold
            />
          </div>
          <div>
            {plan?.subscription && (
              <>
                <Text
                  as="p"
                  labelToken="Your subscription rate is {{plan}} credits for ${{price}} renewed every month"
                  tokenArgs={{
                    plan: plan.subscription.plan,
                    price: getSubscriptionPrice(plan.subscription.plan).value,
                  }}
                  size="md"
                  className="mt-1"
                  medium
                />
                <NextChargeTime />
                <CancelSubscriptionButton />
              </>
            )}
          </div>
        </>
      )}
    </ConfigSection>
  )
}

const NextChargeTime = () => {
  const { data, isLoading } = useSWR("nextChargeTime", getSubscriptionNextChargeTime, {
    errorRetryCount: 2,
  })

  return isLoading || !data?.nextChargeTime ? (
    <></>
  ) : (
    <Text
      as="p"
      labelToken="The next charge for your subscription will be on {{date}}."
      tokenArgs={{
        date: formatDate(data.nextChargeTime),
      }}
      size="md"
      className="mt-1"
      medium
    />
  )
}

const CancelSubscriptionButton = () => {
  const { t } = useTranslation()
  const [showConfirm, toggleConfirm] = useToggle(false)
  const [canceling, setCanceling] = useMountedState(false)

  const cancel = async () => {
    setCanceling(true)
    try {
      await cancelUserSubscription()
      notification.success(t("Subscription cancelled successfully"))
    } catch (error) {
      notification.error(t("Something wrong happened"))
    } finally {
      setCanceling(false)
      toggleConfirm()
    }
  }

  return (
    <>
      <Button
        labelToken="Cancel subscription"
        onClick={toggleConfirm}
        variant="tertiary"
        className="mt-2 -ml-3"
      />
      <Modal
        role="alertdialog"
        show={showConfirm}
        titleToken="Are you sure you want to cancel?"
        onClose={toggleConfirm}
        actions={[
          {
            key: "close",
            variant: "secondary",
            labelToken: "Close",
            onClick: toggleConfirm,
          },
          {
            key: "cancelSubscription",
            variant: "danger",
            labelToken: "Cancel subscription",
            onClick: cancel,
            loading: canceling,
          },
        ]}
      >
        <Text labelToken="If you cancel your credits will still remain :)" medium gray />
      </Modal>
    </>
  )
}

const DeleteAccountConfig = () => {
  const { t } = useTranslation()
  const [showConfirm, toggleConfirm] = useToggle(false)
  const [deleting, setDeleting] = useMountedState(false)

  const deleteAccount = async () => {
    setDeleting(true)
    try {
      await deleteUserAccount()
      notification.success(t("Account deleted successfully"))
      setTimeout(() => signOut({ callbackUrl: "/auth/signin" }), 1000)
    } catch (error) {
      notification.error(t("Something went wrong"))
    } finally {
      setDeleting(false)
      toggleConfirm()
    }
  }

  return (
    <ConfigSection
      titleToken="Delete account"
      actionToken="Delete account"
      onActionClick={toggleConfirm}
      className="mt-10"
      danger
    >
      <Text
        as="p"
        labelToken="Permanently remove your Account and all of its contents from the Witcher.ai platform. This action is not reversible."
        size="sm"
        medium
      />
      <Modal
        role="alertdialog"
        show={showConfirm}
        titleToken="Are you sure you want to delete you acount?"
        onClose={toggleConfirm}
        actions={[
          {
            key: "close",
            variant: "secondary",
            labelToken: "Close",
            onClick: toggleConfirm,
          },
          {
            key: "deleteAccount",
            variant: "danger",
            labelToken: "Delete",
            onClick: deleteAccount,
            loading: deleting,
          },
        ]}
      >
        <Text
          labelToken="You will lose access to all your processed images"
          medium
          gray
        />
      </Modal>
    </ConfigSection>
  )
}
