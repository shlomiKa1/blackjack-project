export default function createPlayerRepository(supabase) {
  async function selectPlayer(filter) {
    return await supabase.from("player").select("*").match(filter);
  }

  async function insertPlayer() {
    return await supabase.from("player").insert({ chips: 1000 }).select("*");
  }

  async function updatePlayer(id, data) {
    return await supabase.from("player").update(data).eq({ id });
  }

  return { selectPlayer, insertPlayer, updatePlayer };
}
