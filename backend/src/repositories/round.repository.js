import { ObjectId } from "mongodb";

export default function createRoundRepository(collection) {
  async function create(data) {
    const newId = await collection.insertOne(data);
    return { id: newId.insertedId, ...data };
  }

  async function find(filter) {
    return await collection.find(filter).toArray();
  }

  async function findOne(filter) {
    return await collection.findOne(filter);
  }

  async function update(id, data) {
    return await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { data } },
    );
  }

  return { create, find, findOne, update };
}
