import { MongoClient, Db, } from "mongodb";
import { MONGO_URI, NAME_DB } from "../config.js";

const client = new MongoClient(MONGO_URI);
let /**@type {Db} */ db;

async function connectToMongo() {
  if (!db) {
    try {
      await client.connect();
      db = client.db(NAME_DB);
      console.log("connect");
    } catch (error) {
      console.log(error.message);
    }
  }
  return db;
}

await connectToMongo();

export { db };
