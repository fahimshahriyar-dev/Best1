import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET_KEY || "",
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_SERVER_URI}/social-auth`,
                        {
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
                        }
                    );

                    if (response.ok) {
                        return true;
                    }
                } catch (error) {
                    console.error("Social auth error:", error);
                    return false;
                }
            }
            return true;
        },
    },
    secret: process.env.SECRET_KEY,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
