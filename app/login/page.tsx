"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCredentialsLogin = (e: any) => {
    e.preventDefault();
    signIn("credentials", { email, password, callbackUrl: "/" });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <h1 className="text-2xl font-bold mb-6">Đăng nhập</h1>

        {/* Đăng nhập bằng Google */}
        <button onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-2 border p-2 rounded mb-4 hover:bg-gray-50">
          <img src="https://www.google.com/favicon.ico" className="w-5" alt="google" />
          Tiếp tục với Google
        </button>

        <div className="border-b my-4"></div>

        {/* Form đăng nhập thường */}
        <form onSubmit={handleCredentialsLogin}>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 mb-4 rounded" />
          <input type="password" placeholder="Mật khẩu" onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 mb-4 rounded" />
          <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}