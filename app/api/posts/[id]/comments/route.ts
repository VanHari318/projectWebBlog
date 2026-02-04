import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { author, text } = await request.json();
    const client = await clientPromise;
    const db = client.db("myBlog");

    await db.collection("posts").updateOne(
      { _id: new ObjectId(params.id) },
      { $push: { comments: { author, text, createdAt: new Date() } } } as any
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}