import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // 1. Kết nối DB
    const client = await clientPromise;
    const db = client.db();

    // 2. Kiểm tra xem email đã tồn tại chưa
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email này đã được sử dụng!" }, { status: 400 });
    }
    // 3. Băm mật khẩu và lưu người dùng mới
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      image: "",
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Đăng ký thành công!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi máy chủ!" }, { status: 500 });
  }
}