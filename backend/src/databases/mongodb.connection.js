import { MongoClient } from "mongodb";
import { MONGO_URI, NAME_DB } from "../config.js";

const client = new MongoClient(MONGO_URI);
export const db = await client.db(NAME_DB);
