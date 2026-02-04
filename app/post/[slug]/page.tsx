import clientPromise from "@/lib/mongodb";
import Link from "next/link";

export default async function PostDetail({ params }: { params: { id: string } }) {
  const client = await clientPromise;
  const db = client.db("myBlog");
  
  // Tìm theo slug (params.id chính là cái đoạn chữ trên URL)
  const post = await db.collection("posts").findOne({
    slug: params.id 
  });

  if (!post) {
    return (
      <div className="p-10 text-center">
        <p>Không tìm thấy bài viết!</p>
        <Link href="/" className="text-blue-500">Quay về trang chủ</Link>
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto p-10">
      <Link href="/" className="text-blue-500 hover:underline mb-6 block">← Quay lại</Link>
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="text-lg whitespace-pre-wrap text-gray-700">{post.content}</div>
    </main>
  );
}