import NextAuth from "next-auth";
import api from "@/lib/axios";
import { NextResponse } from "next/server";

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
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.name = profile.nome as string;
        token.email = profile.email_google_classroom as string;
        token.image = profile.foto as string;
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.accessToken) {
        try {
          const response = await api.post(
            "/user/login/suap/",
            {},
            {
              headers: {
                Authorization: `Bearer ${token.accessToken}`,
              },
            }
          );
          const { user } = response.data;
          session.id = user.id;
          token.isAuthenticated = true;
          session.accessToken = token.accessToken;
          session.refreshToken = token.refreshToken;
          session.name = token.name;
          session.email = token.email;
          session.image = token.image;
          session.idToken = token.idToken;
        } catch (error: any) {
          if (error.response?.status === 401) {
            token.isAuthenticated = false;
            return { ...session, user: undefined };
          }
        }
      }

      return session;
    },
  },
});
