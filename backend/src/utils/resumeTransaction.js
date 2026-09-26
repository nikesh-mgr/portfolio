import mongoose from "mongoose";
import ResumeWriteLock from "../models/ResumeWriteLock.js";

export default async function resumeTransaction(work) {
  try {
    await ResumeWriteLock.updateOne(
      { _id: "active" },
      { $setOnInsert: { version: 0 } },
      { upsert: true }
    );
  } catch (error) {
    if (error.code !== 11000) throw error;
  }
  return mongoose.connection.transaction(async (session) => {
    await ResumeWriteLock.updateOne(
      { _id: "active" },
      { $inc: { version: 1 } },
      { session }
    );
    return work(session);
  });
}
