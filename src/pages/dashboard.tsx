import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { GetStaticProps, NextPage } from "next"
import { Header } from "@/components/layout"
import { SharedHead } from "@/components/layout/header/headUtils"
import { PagePropsProvider } from "@/lib/hooks"
import { Footer } from "@/components/layout/Footer"
import { Tab } from "@headlessui/react"
import { BookOpenIcon, Cog6ToothIcon } from "@heroicons/react/24/outline"
import { cn, getQueryParams, toInt } from "@/lib/utils"
import { useTranslation } from "next-i18next"
import { UserPredictions } from "@/components/content/UserPredictions"
import { UserSettings } from "@/components/content/UserSettings"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const localeProps = await serverSideTranslations(locale, ["common"])
  return {
    props: { ...localeProps },
  }
}

const TabButton = ({ selected, labelToken, Icon }) => {
  const { t } = useTranslation()
  return (
    <div
      className={cn(
        `
        w-40 relative flex items-center justify-center py-2 rounded-md border-none text-lg text-gray-800 ring-none
            dark:text-gray-200
         hover:bg-gray-100 dark:hover:bg-gray-800`,
        {
          "font-medium": selected,
        },
      )}
    >
      <Icon className="w-5 h-5 stroke-2 mr-2" />
      {t(labelToken)}
      {selected && (
        <div className="absolute rounded-full z-20 h-1 inset-x-4 -bottom-3 bg-purple-500" />
      )}
    </div>
  )
}

const CustomTabGroup = ({ children }) => {
  const router = useRouter()
  const [tabIndex, setTabIndex] = useState(0)
  const currentIndex = getQueryParams().get("tabIndex")

  useEffect(() => {
    currentIndex && setTabIndex(toInt(currentIndex))
  }, [currentIndex])

  return (
    <Tab.Group
      selectedIndex={tabIndex}
      onChange={(index) => {
        router.push(router.pathname, { query: { tabIndex: index } })
      }}
    >
      {children}
    </Tab.Group>
  )
}

const DashboardPage: NextPage = ({}) => {
  return (
    <PagePropsProvider
      value={{ titleToken: "Dashboard", descriptionToken: "Onepic User's dashboard" }}
    >
      <SharedHead />
      <Header className="border-b" showBottomLineOnScroll={false} noSticky />
      <main className=" pt-4">
        <CustomTabGroup>
          <Tab.List className="sticky top-0 pt-3 z-50 w-full pb-3 border-b border-gray-200 bg-white dark:bg-black dark:border-gray-700">
            <Tab className="ml-4 outline-none">
              {({ selected }) => (
                <TabButton
                  {...{ selected }}
                  labelToken={"Predictions"}
                  Icon={BookOpenIcon}
                />
              )}
            </Tab>
            <Tab className="ml-4 outline-none">
              {({ selected }) => (
                <TabButton
                  {...{ selected }}
                  labelToken={"Settings"}
                  Icon={Cog6ToothIcon}
                />
              )}
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-4 px-3 lg:px-12" id="appContainer">
            <Tab.Panel className="min-h-screen">
              <UserPredictions />
            </Tab.Panel>
            <Tab.Panel>
              <UserSettings />
            </Tab.Panel>
          </Tab.Panels>
        </CustomTabGroup>
      </main>
      <Footer />
    </PagePropsProvider>
  )
}

export default DashboardPage
