// frontend/src/app/login/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [staffId, setStaffId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!staffId) {
      setError("กรุณากรอกรหัสผู้สัมภาษณ์");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // เรียก API backend โดยตรงผ่าน Nginx proxy
      const response = await fetch(`/api/interviewers/${staffId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);

      // ตรวจสอบว่าเป็น JSON response หรือไม่
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Non-JSON response from login API");
        setError("เกิดข้อผิดพลาดในการตอบกลับจากเซิร์ฟเวอร์");
        return;
      }

      const data = await response.json();

      if (response.ok && data.success) {
        // บันทึกข้อมูลผู้ใช้ลงใน localStorage
        console.log("Login successful, user data:", data.data);
        localStorage.setItem("user", JSON.stringify(data.data));
        localStorage.setItem("isLoggedIn", "true");

        // นำทางไปยังหน้าหลัก
        router.push("/interview");
      } else {
        setError(data.message || "รหัสผู้สัมภาษณ์ไม่ถูกต้อง");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ โปรดลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            เข้าสู่ระบบสัมภาษณ์นักศึกษา
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            กรุณากรอกรหัสผู้สัมภาษณ์เพื่อเข้าสู่ระบบ
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="staff-id"
              className="block text-sm font-medium text-gray-700"
            >
              รหัสผู้สัมภาษณ์
            </label>
            <input
              id="staff-id"
              type="text"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="กรอกรหัสผู้สัมภาษณ์"
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            หากไม่ทราบรหัสผู้สัมภาษณ์หรือมีปัญหาในการเข้าสู่ระบบ
            กรุณาติดต่อผู้ดูแลระบบ
          </p>
        </div>
      </div>
    </div>
  );
}
