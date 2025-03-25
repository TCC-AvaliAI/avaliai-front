import NextAuth from "next-auth";
import axios from "axios";

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
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.name = token.name;
      session.email = token.email;
      session.image = token.image;
      session.idToken = token.idToken;

      if (session.accessToken && !token.isAuthenticated) {
        try {
          await axios.post(`${process.env.API_URL}/api/user/login/suap/`, {
            access_token: session.accessToken,
          });
          token.isAuthenticated = true;
        } catch (error: any) {
          console.error(
            "Erro ao enviar o accessToken para o backend:",
            error.message
          );
        }
      }

      return session;
    },
  },
});
