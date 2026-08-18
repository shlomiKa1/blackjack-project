import { createClient } from "@supabase/supabase-js";
import { SECRET_KEY, SUPABASE_URI } from "../config.js";

const supabase = createClient(SUPABASE_URI, SECRET_KEY);
const database = supabase.from("player");
