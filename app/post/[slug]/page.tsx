import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Link from "next/link";

export default async function PostDetail({ params }: { params: { id: string } }) {
  const client = await clientPromise;
  const db = client.db("myBlog");
  
  // Tạo bộ lọc tìm kiếm
  const query = params.id.length === 24 
    ? { _id: new ObjectId(params.id) } // Nếu là ID thì tìm theo _id
    : { slug: params.id };            // Nếu không phải thì tìm theo slug

  const post = await db.collection("posts").findOne(query as any);

  if (!post) return <div className="text-center mt-20">Không tìm thấy bài viết!</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Quay lại trang chủ
        </Link>
        
        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header bài viết */}
          <div className="p-8 border-b border-gray-100">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
              {post.title}
            </h1>
            <p className="text-sm text-gray-400">
              Đăng vào: {new Date(post.createdAt || Date.now()).toLocaleDateString('vi-VN')}
            </p>
          </div>

          {/* Nội dung bài viết */}
          <div className="p-8 text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">
            {post.content}
          </div>
          
          {/* Footer giả lập Reddit */}
          <div className="bg-gray-50 p-4 px-8 flex gap-4 text-gray-500 text-sm font-bold">
            <span>💬 0 Bình luận</span>
            <span>🎁 Tặng thưởng</span>
            <span>↪ Chia sẻ</span>
          </div>
        </article>
      </div>
    </div>
  );
}