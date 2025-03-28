// frontend/src/contexts/AuthContext.jsx
"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";

// สร้าง Context สำหรับจัดการสถานะการล็อกอิน
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // โหลดข้อมูลผู้ใช้จาก localStorage เมื่อเริ่มต้น
  // frontend/src/contexts/AuthContext.jsx
// โค้ดใน useEffect
useEffect(() => {
  const checkLoginStatus = () => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedLoginStatus = localStorage.getItem("isLoggedIn");
      
      console.log("Auth check - stored status:", storedLoginStatus, "user data exists:", !!storedUser);

      if (storedLoginStatus === "true" && storedUser) {
        setUser(JSON.parse(storedUser));
        setIsLoggedIn(true);
        console.log("User is logged in");
      } else {
        console.log("User is NOT logged in");
      }
    } catch (error) {
      console.error("Error restoring auth state:", error);
    } finally {
      setLoading(false);
    }
  };

  // เรียกตรวจสอบเฉพาะฝั่ง client
  if (typeof window !== "undefined") {
    checkLoginStatus();
  } else {
    setLoading(false);
  }
}, []);

  // ฟังก์ชันล็อกอิน
  const login = async (staffId) => {
    try {
      setLoading(true);

      // เรียก API สำหรับการล็อกอิน
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ staff_id: staffId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const userData = data.data;

        // บันทึกข้อมูลลง state และ localStorage
        setUser(userData);
        setIsLoggedIn(true);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isLoggedIn", "true");

        return { success: true };
      } else {
        return {
          success: false,
          message: data.message || "รหัสผู้สัมภาษณ์ไม่ถูกต้อง",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
      };
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันล็อกเอาท์
  const logout = () => {
    // ล้างข้อมูลผู้ใช้
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    // นำทางกลับไปหน้าล็อกอิน
    router.push("/login");
  };

  // ฟังก์ชันตรวจสอบว่าผู้ใช้มีสิทธิ์เข้าถึงข้อมูลนักศึกษาคณะนั้นหรือไม่
  const hasAccessToFaculty = (faculty) => {
    if (!user) return false;

    // ถ้าเป็นผู้บริหาร จะเข้าถึงได้ทุกคณะ
    if (user.staff_faculty === "ผู้บริหาร") return true;

    // ถ้าไม่ใช่ เข้าถึงได้เฉพาะคณะเดียวกัน
    return user.staff_faculty === faculty;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        loading,
        login,
        logout,
        hasAccessToFaculty,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook สำหรับใช้งาน AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
