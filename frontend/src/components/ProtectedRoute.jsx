// frontend/src/components/ProtectedRoute.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // ถ้าโหลดเสร็จแล้วและยังไม่ได้ล็อกอิน ให้ redirect ไปที่หน้าล็อกอิน
    if (!loading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, loading, router]);

  // ถ้ากำลังโหลดสถานะการล็อกอิน ให้แสดง loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">กำลังตรวจสอบสถานะการเข้าสู่ระบบ...</p>
        </div>
      </div>
    );
  }

  // ถ้าล็อกอินแล้ว แสดงเนื้อหาหน้านั้น
  return isLoggedIn ? children : null;
}
