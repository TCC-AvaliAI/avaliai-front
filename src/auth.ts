import NextAuth from "next-auth";
import api from "@/lib/axios";

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
  trustHost: true,
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
      if (token.accessToken && !token.isAuthenticated) {
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
          if (error.response?.status === 401 || error.response?.status === 403) {
            token.isAuthenticated = false;
            token.accessToken = undefined;
            token.refreshToken = undefined;
            session.accessToken = undefined;
            session.refreshToken = undefined;
            session.user = {
              id: "",
              email: "",
              name: "",
              image: "",
              emailVerified: null
            };
            session.id = "";
            session.email = "";
            session.name = "";
            session.image = "";
            session.idToken = undefined;

            if (typeof window !== "undefined") {
              window.sessionStorage.clear();
              await signOut({
                redirect: true,
                redirectTo: "/login"
              });
            }
            return session;
          }
          throw error;
        }
      } else if (token.isAuthenticated && token.accessToken) {
        session.id = session.id;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.name = token.name;
        session.email = token.email;
        session.image = token.image;
        session.idToken = token.idToken;
      }
      return session;
    },
  },
});
