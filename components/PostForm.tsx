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
                <input type="file" onChange={(e) => handleFileChange(e)}/>
              </div>
              {preview && (
                <div className="mt-2">
                  <img src={preview} alt="Preview" className="ww-full h-auto object-cover rounded" />
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