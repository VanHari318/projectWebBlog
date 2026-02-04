"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CommentSection({ postId, comments = [] }: { postId: string, comments: any[] }) {
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ author, text }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setAuthor(""); setText("");
      router.refresh(); // Tải lại để hiện bình luận mới
    }
  };

  return (
    <div className="mt-10 border-t pt-8">
      <h3 className="text-2xl font-bold mb-6 text-black">Bình luận ({comments.length})</h3>
      
      {/* Form nhập bình luận */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <input 
          className="w-full p-2 border rounded text-black" 
          placeholder="Tên của bạn..." 
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <textarea 
          className="w-full p-2 border rounded h-20 text-black" 
          placeholder="Viết bình luận..." 
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Gửi bình luận
        </button>
      </form>

      {/* Danh sách bình luận */}
      <div className="space-y-4">
        {comments.map((c, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="font-bold text-blue-700 text-sm">{c.author}</p>
            <p className="text-gray-800 mt-1">{c.text}</p>
            <p className="text-xs text-gray-400 mt-2">
              {new Date(c.createdAt).toLocaleString('vi-VN')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}