import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// Hàm lấy dữ liệu (Mới thêm)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("myBlog");
    const posts = await db.collection("posts").find({}).sort({ _id: -1 }).toArray();
    return NextResponse.json(posts);
  } catch (e) {
    return NextResponse.json({ error: "Lỗi lấy dữ liệu" }, { status: 500 });
  }
}
export async function POST(request: Request) {
  try {
    const { title, content } = await request.json();
    const client = await clientPromise;
    const db = client.db("myBlog");

    const result = await db.collection("posts").insertOne({
      title,
      content,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Lỗi server" }, { status: 500 });
  }
}