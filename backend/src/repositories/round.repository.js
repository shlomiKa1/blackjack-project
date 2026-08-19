import { ObjectId } from "mongodb";

export default function createRoundRepository(collection) {
  async function create(data) {
    const newId = await collection.insertOne(data);
    return { id: newId.insertedId, ...data };
  }

  async function find(filter) {
    return await collection.find().filter(filter).toArray();
  }

  async function findOne(filter) {
    return await find()[0];
  }

  async function update(playerId, data) {
    return await collection.updateOne(
      { playerId: new ObjectId(playerId) },
      { $set: { data } },
    );
  }

  return { create, find, findOne, update };
}
