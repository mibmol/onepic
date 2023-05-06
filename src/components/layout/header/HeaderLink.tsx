import { Text } from "@/components/common"
import Link from "next/link"

export const HeaderLink = ({ href, labelToken }) => {
  return (
    <Link
      {...{ href }}
      className="flex items-center rounded h-10 px-5 hover:bg-gray-100 dark:hover:bg-gray-700"
      scroll={false}
    >
      <Text {...{ labelToken }} medium />
    </Link>
  )
}
