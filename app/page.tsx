import clientPromise from "@/lib/mongodb";
import PostForm from "@/components/PostForm";

export const revalidate = 0;
export default async function Home() {
  try {
    const client = await clientPromise;
    const db = client.db("myBlog"); // Đảm bảo tên này khớp với tên Database bạn tạo trên Atlas
    const posts = await db.collection("posts").find({}).sort({_id: -1}).toArray();
    return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">Blog của tôi</h1>
      
      {/* Hiện cái nút và Pop-up ở đây */}
      <PostForm />

      <div className="grid gap-4">
        {posts.map((post) => (
          <div key={post._id.toString()} className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-600">{post.content}</p>
          </div>
        ))}
      </div>
    </main>
  );
  } catch (e) {
    console.error(e);
    return <div className="p-10 text-red-500">Đã xảy ra lỗi khi kết nối Database. Vui lòng kiểm tra lại mật khẩu trong file .env.local!</div>;
  }
}