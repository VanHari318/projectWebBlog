"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PostForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
        return () => {
          if (preview) {
            URL.revokeObjectURL(preview);
          }
        }
      }, [preview]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
    const file = e.target.files?.[0];
    if(file){
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  const handleUpload = async () =>{
    try{
      if(!image) return null;
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "myBlogUpload");
      const res = await fetch("https://api.cloudinary.com/v1_1/dojcgjli4/image/upload", {
        method: "POST",
        body: formData,
      });
      const data =  await res.json();
      return data.secure_url;
    }
    catch(err){
      console.log(err);
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    try{
      e.preventDefault();
      setLoading(true);

      const imageUrl = await handleUpload();
      const res = await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify({ title, content, image: imageUrl }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setIsOpen(false);
        setTitle(""); setContent(""); setImage(null); setLoading(false);
        router.refresh(); // Làm mới dữ liệu trang chủ ngay lập tức
      }
    }
    catch(err){
      console.log(err);
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
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
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
              <div>
                <label className="block text-sm font-medium text-gray-700">Thêm ảnh bài viết:</label>
                <label 
                  htmlFor="file-upload" 
                  className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-blue-400 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-all text-blue-600 font-semibold"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.587-1.587a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{image ? "Đã chọn ảnh (Click để đổi)" : "Chọn ảnh từ máy tính"}</span>
                </label>
                <input id="file-upload" type="file" accept="image/*" onChange={(e) => handleFileChange(e)} className="hidden" />
              </div>
              {preview && (
                <div className="mt-2">
                  <img src={preview} alt="Preview" className="w-full h-auto object-cover rounded" />
                </div>
              )}
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded" disabled={loading}>
                  {loading ? "Đang đăng..." : "Đăng"}
                </button>
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