import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GROQ_API_KEY; // Thêm key này vào .env.local nhé

    if (!apiKey) return NextResponse.json({ text: "Thiếu GROQ_API_KEY" }, { status: 500 });

    const client = await clientPromise;
    const db = client.db("myBlog");
    const posts = await db.collection("posts").find({}).project({ title: 1, content: 1 }).toArray();
    const context = posts.map(p => `Tiêu đề: ${p.title}. Nội dung: ${p.content}`).join("\n");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Model cực mạnh và miễn phí
        messages: [
          { role: "system", content: `Bạn là trợ lý blog. Dữ liệu: ${context}` },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    const aiText = data.choices[0]?.message?.content || "Không có phản hồi";
    return NextResponse.json({ text: aiText });

  } catch (error: any) {
    return NextResponse.json({ text: "Lỗi Groq: " + error.message }, { status: 500 });
  }
}