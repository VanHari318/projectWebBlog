import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Sửa kiểu dữ liệu của params thành Promise
export async function POST(
  request: Request, 
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    // BẮT BUỘC: Phải await params trước khi dùng id
    const { id } = await params; 
    
    const { author, text, image } = await request.json();
    const client = await clientPromise;
    const db = client.db("myBlog");

    // Thêm bình luận vào mảng comments của bài viết
    await db.collection("posts").updateOne(
      { _id: new ObjectId(id) },
      { 
        $push: { 
          comments: {
            author,
            text,
            image,
            createdAt: new Date()
          } 
        } as any
      }
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Lỗi API bình luận:", e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}