import Image from "next/image";
const POSTS = [
  { id: 1, slug: "hoc-nextjs", title: "Lộ trình học Next.js 2026", desc: "Bắt đầu từ đâu?" },
  { id: 2, slug: "tailwind-css", title: "Tại sao nên dùng Tailwind?", desc: "Nhanh, gọn, nhẹ." },
];
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="p-10 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">My Blog</h1>
      <div className="grid gap-6">
        {POSTS.map((post) => (
          <div key={post.id} className="p-6 border rounded-lg hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold">{post.title}</h2>
            <p className="text-gray-600 my-2">{post.desc}</p>
            <a href={`/blog/${post.slug}`} className="text-blue-500 font-medium">
              Đọc tiếp →
            </a>
          </div>
        ))}
      </div>
      </main>
    </div>
  );
}
