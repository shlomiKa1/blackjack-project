import { createClient } from "@supabase/supabase-js";
import { SECRET_KEY, SUPABASE_URI } from "../config.js";

export const supabase = createClient(SUPABASE_URI, SECRET_KEY);
