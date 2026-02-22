"use client";
import useSWR from "swr";
import PostForm from "./PostForm";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BlogClient({ initialData }: { initialData: any }) {
  // SWR 
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
            <Link key={post._id} href={`/post/${post.slug || post._id}`}>
                <div className="p-4 border rounded hover:shadow-lg cursor-pointer transition-all">
                <h2 className="text-xl font-bold text-blue-600">{post.title}</h2>
                <p className="line-clamp-3">{post.content}</p>
                <img src={post.image} alt={post.title} className="mt-2 max-h-48 w-full object-cover rounded" />
                </div>
            </Link>
        ))}
      </div>
    </main>
  );
}