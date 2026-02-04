"use client";
import useSWR from "swr";
import PostForm from "./PostForm";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BlogClient({ initialData }: { initialData: any }) {
  // SWR sẽ dùng initialData để hiện ngay lập tức, sau đó 5s sẽ check bài mới
  const { data: posts } = useSWR("/api/posts", fetcher, {
    fallbackData: initialData,
    refreshInterval: 5000,
  });

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">Blog của tôi</h1>
      
      <PostForm />

      <div className="grid gap-4 mt-6">
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