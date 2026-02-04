"use client"; // Bắt buộc vì có dùng sự kiện nhấn nút
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const res = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({ title, content }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      alert("Đăng bài thành công!");
      setTitle(""); setContent("");
      router.push("/"); // Sau khi đăng xong thì tự nhảy về trang chủ
      router.refresh(); // Làm mới dữ liệu trang chủ ngay lập tức
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Viết bài mới ✍️</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded text-black"
          placeholder="Tiêu đề bài viết..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full p-2 border rounded h-32 text-black"
          placeholder="Nội dung bài viết..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Đăng bài ngay
        </button>
      </form>
    </div>
  );
}