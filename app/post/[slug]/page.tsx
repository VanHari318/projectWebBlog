import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Link from "next/link";
import CommentSection from "@/components/CommentSection";

export const dynamic = 'force-dynamic';

export default async function PostDetail({ params }: { params: { slug: string } }) {
  const { slug } = params; // Lấy đúng tên biến slug từ folder [slug]

  try {
    const client = await clientPromise;
    const db = client.db("myBlog");
    
    // Tìm theo slug hoặc ID (nếu ID hợp lệ)
    const isValidId = /^[0-9a-fA-F]{24}$/.test(slug);
    const query = isValidId 
      ? { $or: [{ _id: new ObjectId(slug) }, { slug: slug }] } 
      : { slug: slug };

    const post = await db.collection("posts").findOne(query);

    if (!post) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-black">
          <p className="text-xl mb-4">Không tìm thấy bài viết! 🔍</p>
          <Link href="/" className="text-blue-500 underline">Quay về trang chủ</Link>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-blue-500 hover:underline mb-6 inline-block">← Quay lại</Link>
          <article className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>
            <div className="text-gray-700 text-lg whitespace-pre-wrap leading-relaxed mb-10">
              {post.content}
            </div>
            
            {/* Phần bình luận */}
            <CommentSection postId={post._id.toString()} comments={post.comments || []} />
          </article>
        </div>
      </div>
    );
  } catch (error) {
    return <div className="p-10 text-center text-black">Đã có lỗi xảy ra khi tải bài viết.</div>;
  }
}