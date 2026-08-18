import { createClient } from "@supabase/supabase-js";
import { connection } from "../databases/supabase.connection.js";

export default function playerRepository(connection,
) {
  async function selectPlayer(id) {
    return await connection.select("*").match({ id });
  }

  async function insertPlayer(data) {
    return await dbConnection.insert(data);
  }

  return { selectPlayer, insertPlayer };
}
