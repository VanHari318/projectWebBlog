import clientPromise from "@/lib/mongodb";

export default async function Home() {
  try {
    const client = await clientPromise;
    const db = client.db("myBlog"); // Đảm bảo tên này khớp với tên Database bạn tạo trên Atlas

    // Lấy 10 bài viết mới nhất từ collection "posts"
    const posts = await db
      .collection("posts")
      .find({})
      .limit(10)
      .toArray();

    return (
      <main className="min-h-screen p-10 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 border-b pb-4">
            Blog của tôi 🖋️
          </h1>

          <div className="space-y-6">
            {posts.length === 0 ? (
              <div className="p-10 text-center bg-white rounded-lg shadow">
                <p className="text-gray-500">Chưa có bài viết nào. Hãy thêm bài viết trên MongoDB Atlas!</p>
              </div>
            ) : (
              posts.map((post) => (
                <article key={post._id.toString()} className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition">
                  <h2 className="text-2xl font-semibold text-blue-600 mb-2">
                    {post.title || "Tiêu đề trống"}
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {post.content || "Nội dung trống"}
                  </p>
                </article>
              ))
            )}
          </div>
        </div>
      </main>
    );
  } catch (e) {
    console.error(e);
    return <div className="p-10 text-red-500">Đã xảy ra lỗi khi kết nối Database. Vui lòng kiểm tra lại mật khẩu trong file .env.local!</div>;
  }
}