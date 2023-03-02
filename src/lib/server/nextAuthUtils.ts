import { unstable_getServerSession } from "next-auth"

export const getServerSession = (...args) => unstable_getServerSession(...(args as any))
