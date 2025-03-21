import NextAuth, { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
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
      httpOptions: {
        timeout: 10000,
      },
    },
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      console.log(user);
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      return session;
    },
  },
};

export default NextAuth(authOptions);
