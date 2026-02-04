import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error("Lỗi: Bạn chưa thêm MONGODB_URI vào file .env.local");
}

if (process.env.NODE_ENV === "development") {
  // Trong môi trường phát triển, sử dụng biến toàn cục để bảo toàn kết nối khi HMR (Hot Module Replacement) chạy
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // Trong môi trường production, tạo kết nối mới
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;