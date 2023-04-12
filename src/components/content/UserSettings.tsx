import { useSession } from "next-auth/react"
import { Img, Text } from "@/components/common"

export const UserSettings = () => {
  const { data: session } = useSession()
  return (
    <div className="w-2/3 mx-auto mt-8">
      <div className="w-40">
        <div className="flex flex-col items-center" >
          <Img src={session.user.image} className="w-20 rounded-full" />
          <Text bold>{session.user.name}</Text>
          <Text medium gray>{session.user.email}</Text>
        </div>
        <div>

        </div>
      </div>
    </div>
  )
}
