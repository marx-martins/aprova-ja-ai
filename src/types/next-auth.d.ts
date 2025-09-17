import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      subscription: string
      simulationsUsed: number
      simulationsLimit: number
    }
  }

  interface User {
    subscription: string
    simulationsUsed: number
    simulationsLimit: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    subscription: string
    simulationsUsed: number
    simulationsLimit: number
  }
}
