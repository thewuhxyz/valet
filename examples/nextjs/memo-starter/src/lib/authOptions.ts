import { getServerSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions: NextAuthOptions = {
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		GoogleProvider({
			clientId: process.env.NEXT_PUBLIC_GOOGLE_ID as string,
			clientSecret: process.env.GOOGLE_SECRET as string,
		}),
	],
	// todo: Set Provider and Provider ID Token on signin
};

const getSession = () => getServerSession(authOptions);

export { authOptions, getSession };
