import { createClient } from "@supabase/supabase-js";
import { connection } from "../databases/supabase.connection.js";

export default function playerRepository() {
  //   /**@type {PostgrestQueryBuilder}*/ dbC,
  async function selectPlayer(id) {
    return await connection.select("*").eq({ id });
  }

  async function insertPlayer() {
    return await connection.insert({ chips: 1000 }).select("*");
  }

  async function updatePlayer(id, data) {
    return await connection.update(data).eq({ id });
  }

  return { selectPlayer, insertPlayer, updatePlayer };
}
