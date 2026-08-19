export const {
  MONGO_URI,
  NAME_DB,
  SUPABASE_URI,
  SECRET_KEY,
  PORT = 3000,
} = process.env;

export const ACE = "A";
export const SPACIEL = ["J", "Q", "K"];
export const TYPE_CARDS = ["S", "H", "D", "C"];
export const VALUE_CARDS = ["2", "3", "4", "5", "6", "7", "8", "9", "10"];

VALUE_CARDS.push(ACE);
VALUE_CARDS.push(SPACIEL);

export const MAX_NUMBER = 21;
export const MIN_ACE = 1;
export const MAX_ACE = 11;
export const SPACIEL_NUMBER = 10;
