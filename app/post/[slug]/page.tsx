import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Link from "next/link";

// Đổi params.id thành params.slug ở đây
export default async function PostDetail({ params }: { params: { slug: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db("myBlog");
    
    // Đổi params.id thành params.slug
    const identifier = params.slug;

    let query: any = { slug: identifier };

    // Kiểm tra định dạng ID MongoDB (24 ký tự hex)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
    
    if (isValidObjectId) {
      query = { 
        $or: [
          { _id: new ObjectId(identifier) },
          { slug: identifier }
        ] 
      };
    }

    const post = await db.collection("posts").findOne(query);

    if (!post) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-black">
          <p className="text-xl font-semibold text-gray-600 mb-4">Bài viết này không tồn tại!</p>
          <Link href="/" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
            Quay về trang chủ
          </Link>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">← Quay lại</Link>
          <article className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="text-gray-700 text-lg whitespace-pre-wrap leading-relaxed">
              {post.content}
            </div>
          </article>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Lỗi bài viết:", error);
    return <div className="p-10 text-center text-black">Đã có lỗi xảy ra. Vui lòng thử lại sau!</div>;
  }
}