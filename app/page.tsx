"use client"; // Chuyển sang Client Component
import useSWR from "swr";
import PostForm from "@/components/PostForm";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  // refreshInterval: 5000 nghĩa là cứ 5 giây web tự kiểm tra bài mới 1 lần
  const { data: posts, error, isLoading } = useSWR("/api/posts", fetcher, {
    refreshInterval: 5000, 
    revalidateOnFocus: true // Tự cập nhật khi bạn quay lại tab web này
  });

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">Blog Thời Gian Thực ⚡</h1>
      
      <PostForm />

      {isLoading && <p>Đang tải bài viết mới...</p>}
      {error && <p>Có lỗi xảy ra khi lấy dữ liệu.</p>}

      <div className="grid gap-4">
        {posts?.map((post: any) => (
          <div key={post._id} className="p-4 border rounded shadow bg-white text-black">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-600">{post.content}</p>
          </div>
        ))}
      </div>
    </main>
  );
}