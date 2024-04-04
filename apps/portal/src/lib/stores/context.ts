import type { Supabase } from "$lib/database/client"
import { getContext, setContext } from "svelte"

export const setSupabase = (supabase: Supabase) => {
  return setContext<Supabase>("supabase", supabase)
}

export const getSupabase = () => {
  return getContext<Supabase>("supabase")
}