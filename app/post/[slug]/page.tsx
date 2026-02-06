import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Link from "next/link";
import CommentSection from "@/components/CommentSection";

// Dòng này rất quan trọng để tránh lỗi khi build trên Vercel
export const dynamic = "force-dynamic";

export default async function PostDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const client = await clientPromise;
    const db = client.db("myBlog");

    // Tìm kiếm bài viết
    const isId = /^[0-9a-fA-F]{24}$/.test(slug);
    const query = isId 
      ? { $or: [{ _id: new ObjectId(slug) }, { slug: slug }] } 
      : { slug: slug };

    const post = await db.collection("posts").findOne(query);

    if (!post) {
      return <div className="p-10 text-center">Bài viết không tồn tại.</div>;
    }

    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-blue-500 mb-6 inline-block">← Quay lại</Link>
          <article className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 text-black">
            <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
            <div className="text-lg whitespace-pre-wrap mb-10">{post.content}</div>
            {post.image && (
              <div>
                <img src={post.image} alt={post.title} className="mb-6 w-full max-h-96 object-cover rounded" />
              </div>
            )}

            {/* Đảm bảo truyền mảng rỗng nếu chưa có bình luận */}
            <CommentSection 
              postId={post._id.toString()} 
              comments={post.comments || []} 
            />
          </article>
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
    return <div className="p-10 text-center">Lỗi hệ thống.</div>;
  }
}