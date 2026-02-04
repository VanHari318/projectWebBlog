import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// Hàm biến chữ có dấu thành slug không dấu
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Chuẩn hóa Unicode để tách dấu
    .replace(/[\u0300-\u036f]/g, '') // Xóa dấu
    .replace(/\s+/g, '-') // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/[^\w-]+/g, '') // Xóa ký tự đặc biệt
    .replace(/--+/g, '-') // Xóa gạch ngang thừa
    .replace(/^-+/, '') // Xóa gạch ngang ở đầu
    .replace(/-+$/, ''); // Xóa gạch ngang ở cuối
}

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

    const slug = slugify(title); // Tạo slug từ tiêu đề

    const result = await db.collection("posts").insertOne({
      title,
      content,
      slug, // Lưu slug vào database
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}