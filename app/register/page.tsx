"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [info, setInfo] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const handleInput = (e: any) => {
    setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!info.name || !info.email || !info.password) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      setPending(true);
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info),
      });

      if (res.ok) {
        setPending(false);
        router.push("/login"); // Đăng ký xong thì sang trang Login
      } else {
        const errorData = await res.json();
        setError(errorData.error);
        setPending(false);
      }
    } catch (error) {
      setError("Có lỗi xảy ra, thử lại sau!");
      setPending(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Đăng ký tài khoản</h1>
        
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <input name="name" type="text" placeholder="Họ và tên" onChange={handleInput}
          className="w-full border p-2 mb-4 rounded" />

        <input name="email" type="email" placeholder="Email" onChange={handleInput}
          className="w-full border p-2 mb-4 rounded" />

        <input name="password" type="password" placeholder="Mật khẩu" onChange={handleInput}
          className="w-full border p-2 mb-4 rounded" />

        <button disabled={pending} className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
          {pending ? "Đang xử lý..." : "Đăng ký"}
        </button>

        <p className="mt-4 text-sm text-center">
          Đã có tài khoản? <Link href="/login" className="text-blue-600 underline">Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
}