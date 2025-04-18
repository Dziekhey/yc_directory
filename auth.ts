import NextAuth from "next-auth";
import "next-auth/jwt";
import GitHub from "next-auth/providers/github";
import { client } from "./sanity/lib/client";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "./sanity/lib/queries";
import { writeClient } from "./sanity/lib/write-client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, profile }) {
      const existingUser = await client
        .withConfig({ useCdn: false })
        .fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id: profile?.id });

      if (!existingUser) {
        await writeClient.create({
          _type: "author",
          id: profile?.id,
          name: user?.name,
          username: profile?.login,
          email: user?.email,
          image: user?.image,
          bio: profile?.bio || "",
        });
      }
      return true;
    },

    async jwt({ token, account, profile }) {
      if (account && profile) {
        const user = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id: profile.id });

        if (user) {
          token.id = user._id;
        }
      }

      // Ensure token is always returned
      return token;
    },

    async session({ session, token }) {
      Object.assign(session, { id: token.id });
      return session;
    },
  },
});


declare module "next-auth" {
  interface Session {
    id?: string;
  }
  interface JWT {
    id?: string;
  }
}
