import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google" || account?.provider === "github") {
                try {
                    const baseUri = (process.env.NEXT_PUBLIC_SERVER_URI || "").replace(/\/+$/, "");
                    const response = await fetch(`${baseUri}/social-auth`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: user.email,
                            name: user.name,
                            avatar: user.image,
                            provider: account.provider,
                        }),
                    });

                    if (response.ok) {
                        return true;
                    }
                } catch (error) {
                    console.error("Social auth error:", error);
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (account && user) {
                token.provider = account.provider;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session as any).provider = token.provider;
            }
            return session;
        },
    },
    pages: {
        signIn: "/", // Redirect to home page after sign in
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);