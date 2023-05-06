import { FC } from "react"

type BurguerMenuButtonProps = {
  isOpen: boolean
}

export const BurguerMenuButton: FC<BurguerMenuButtonProps> = ({ isOpen }) => {
  const genericHamburgerLine = `h-0.5 w-7 mb-1.5 rounded-full bg-gray-900 dark:bg-white transition ease transform duration-300`

  return (
    <div className="flex flex-col h-12 w-12 justify-center items-center group">
      <div
        className={`${genericHamburgerLine} opacity-75 ${
          isOpen
            ? "rotate-45 translate-y-2  group-hover:opacity-100"
            : "group-hover:opacity-100"
        }`}
      />
      <div
        className={`${genericHamburgerLine} ${
          isOpen ? "opacity-0" : "opacity-75 group-hover:opacity-100"
        }`}
      />
      <div
        className={`${genericHamburgerLine} opacity-75 ${
          isOpen
            ? "-rotate-45 -translate-y-2 group-hover:opacity-100"
            : " group-hover:opacity-100"
        }`}
      />
    </div>
  )
}
