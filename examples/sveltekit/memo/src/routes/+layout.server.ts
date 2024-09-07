import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({ locals: { getUserData } }) => {
	return { user: await getUserData() }
}

export const ssr = false
export const csr = true