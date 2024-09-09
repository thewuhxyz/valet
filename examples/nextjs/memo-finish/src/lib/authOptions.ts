import { getServerSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { otaDappServer } from "@/lib/ota";
import { Provider } from "@valet/ota";

const authOptions: NextAuthOptions = {
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		GoogleProvider({
			clientId: process.env.NEXT_PUBLIC_GOOGLE_ID as string,
			clientSecret: process.env.GOOGLE_SECRET as string,
		}),
	],
	// ✅ - Set Provider and Provider ID Token on signin
	callbacks: {
		async signIn({ account }) {
			if (account && account.id_token && account.provider === "google") {
				await otaDappServer.setProviderAndToken(
					Provider.Google,
					account.id_token,
					{
						path: "/",
						secure: false,
						httpOnly: true,
						sameSite: "lax",
						expires: new Date(Date.now() + 3600000),
						maxAge: 3600,
					}
				);
			}
			return true;
		},
	},
};

const getSession = () => getServerSession(authOptions);

export { authOptions, getSession };
