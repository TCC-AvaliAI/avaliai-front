import "next-auth";

import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    email?: string;
    name?: string;
    image?: string;
    id?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    email?: string;
    name?: string;
    image?: string;
    expiresAt?: number;
    error?: string;
  }
}
