"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-blue-600">
          MyBlog
        </Link>

        {/* Menu Items */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-gray-600 hover:text-blue-600">Trang chủ</Link>
          <Link href="/posts" className="text-gray-600 hover:text-blue-600">Bài viết</Link>
          
          {session ? (
            <div className="flex items-center gap-4 border-l pl-6 ml-2">
              <span className="text-sm font-medium text-gray-700">
                Chào, {session.user?.name}
              </span>
              <button 
                onClick={() => signOut()}
                className="bg-red-50 text-red-600 px-3 py-1.5 rounded-md text-sm hover:bg-red-100 transition"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium">Đăng nhập</Link>
              <Link 
                href="/register" 
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}