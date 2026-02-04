import clientPromise from "@/lib/mongodb";
import BlogClient from "@/components/BlogClient";

export default async function Home() {
  const client = await clientPromise;
  const db = client.db("myBlog");
  
  // Lấy dữ liệu từ Server (cực nhanh)
  const rawPosts = await db.collection("posts").find({}).sort({ _id: -1 }).toArray();
  
  // Chuyển đổi dữ liệu MongoDB thành JSON sạch để truyền sang Client
  const posts = JSON.parse(JSON.stringify(rawPosts));

  return <BlogClient initialData={posts} />;
}