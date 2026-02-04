import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

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