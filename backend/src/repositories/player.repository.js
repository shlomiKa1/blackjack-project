import { createClient } from "@supabase/supabase-js";
import { connection } from "../databases/supabase.connection.js";

export default function playerRepository(
  /**@type {PostgrestQueryBuilder}*/ connection,
) {
  async function selectPlayer(id) {
    return await connection.select("*").match({ id });
  }

  return { selectPlayer };
}
