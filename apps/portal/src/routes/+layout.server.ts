import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals: { getUser, getSession } }) => {
	return {
		user: await getUser(),
		session: await getSession()
	};
};
