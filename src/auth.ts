import NextAuth from "next-auth";
import api from "@/lib/axios";
import { NextResponse } from "next/server";

async function loginWithAccessToken(token: string) {
  const response = await api.post(
    "/user/login/suap/",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.user;
}

async function refreshAccessToken(refreshToken: string) {
  const response = await api.post("/user/refresh-token/", {
    refresh_token: refreshToken,
  });
  return {
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token || refreshToken,
  };
}

export const { signIn, signOut, auth, handlers } = NextAuth({
  providers: [
    {
      id: "suap",
      name: "SUAP",
      type: "oauth",
      authorization: {
        url: "https://suap.ifrn.edu.br/o/authorize/",
        params: { scope: "identificacao email" },
      },
      token: "https://suap.ifrn.edu.br/o/token/",
      userinfo: "https://suap.ifrn.edu.br/api/eu/",
      clientId: process.env.SUAP_CLIENT_ID,
      clientSecret: process.env.SUAP_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.identificacao,
          username: profile.nome_social || profile.nome,
          email: profile.email,
          firstName: profile.primeiro_nome,
          lastName: profile.ultimo_nome,
          role: profile.tipo_usuario,
          avatar: profile.foto,
        };
      },
      options: {
        timeout: 10000,
      },
    },
  ],
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.name = profile.nome as string;
        token.email = profile.email_google_classroom as string;
        token.image = profile.foto as string;
        token.idToken = account.id_token;
        token.expiresAt = account.expires_at;
      }
      if (token.expiresAt && Date.now() > token.expiresAt * 1000 - 300000) {
        try {
          const newTokens = await refreshAccessToken(
            token.refreshToken as string
          );
          token.accessToken = newTokens.accessToken;
          token.refreshToken = newTokens.refreshToken;

          token.expiresAt = Math.floor(Date.now() / 1000) + 36000;
        } catch (error) {
          token.error = "RefreshAccessTokenError";
          return token;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token.error === "RefreshAccessTokenError") {
        await signOut({ redirect: false });
        if (typeof window !== "undefined") {
          window.sessionStorage.clear();
          window.location.href = "/login";
        }
        return null as any;
      }

      try {
        const user = await loginWithAccessToken(token.accessToken as string);
        session.id = user.id;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.name = token.name;
        session.email = token.email;
        session.image = token.image;
        session.idToken = token.idToken;
      } catch (error: any) {
        if (error.response?.status === 401) {
          await signOut({ redirect: false });
          if (typeof window !== "undefined") {
            window.sessionStorage.clear();
            window.location.href = "/login";
          }
          return null as any;
        }
      }

      return session;
    },
  },

  events: {
    signOut: async () => {
      if (typeof window !== "undefined") {
        window.sessionStorage.clear();
      }
    },
  },
});
