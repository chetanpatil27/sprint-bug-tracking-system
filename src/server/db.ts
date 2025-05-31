// import { MongoClient, Db } from 'mongodb';

// const uri =  'mongodb://localhost:27017/sp_track_1';
// let client: MongoClient;
// let db: Db;
// console.log("process.env.MONGODB_URI:", process.env.MONGODB_URI);
// export async function connectToDB(): Promise<Db> {
//     if (db) return db;
//     console.log("uri:", uri);
//     client = new MongoClient(uri);
//     try {
//         await client.connect();
//         db = client.db();
//         console.log("Connection to MongoDB established");
//         return db;
//     } catch (error) {
//         console.error('Failed to connect to MongoDB:', error);
//         throw error;
//     }
// }

// export async function closeDBConnection() {
//     if (client) {
//         await client.close();
//         db = undefined as unknown as Db;
//         client = undefined as unknown as MongoClient;
//     }
// }

import mongoose from "mongoose";

export const connectToDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/sp_track_1";
  mongoose
    .connect(uri)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err: unknown) => console.error("MongoDB connection error:", err));
};

