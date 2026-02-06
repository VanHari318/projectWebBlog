import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

function convertToSlug(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s])/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("myBlog");
    // Lấy thêm cả trường slug để bên ngoài Link có dữ liệu mà dùng
    const posts = await db.collection("posts").find({}).sort({ _id: -1 }).toArray();
    return NextResponse.json(posts);
  } catch (e) {
    return NextResponse.json({ error: "Lỗi lấy dữ liệu" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, content, image } = await request.json();
    const client = await clientPromise;
    const db = client.db("myBlog");

    const slug = convertToSlug(title);

    await db.collection("posts").insertOne({
      title,
      content,
      slug: slug, 
      image,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, slug });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}