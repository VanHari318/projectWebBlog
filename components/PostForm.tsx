"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PostForm() {
  const [isOpen, setIsOpen] = useState(false);
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
      setIsOpen(false);
      setTitle(""); setContent("");
      router.refresh(); // Làm mới dữ liệu trang chủ ngay lập tức
    }
  };

  return (
    <div className="mb-8">
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
        + Viết bài mới
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-black">Tạo bài viết mới</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="w-full p-2 border rounded text-black"
                placeholder="Tiêu đề..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea
                className="w-full p-2 border rounded h-32 text-black"
                placeholder="Nội dung..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded">Đăng</button>
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-gray-200 text-black p-2 rounded"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}