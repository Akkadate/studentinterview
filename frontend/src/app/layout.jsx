// frontend/src/app/layout.jsx
"use client";

import { Prompt, Inter } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { InterviewProvider } from "../contexts/InterviewContext.jsx";
import { AuthProvider } from "../contexts/AuthContext.jsx"; // เพิ่ม AuthProvider
import Notification from "../components/Notification";
import "./globals.css";

// กำหนดค่าฟอนต์ Prompt สำหรับภาษาไทย
const prompt = Prompt({
  weight: ["300", "400", "500", "700"],
  subsets: ["thai", "latin"],
  display: "swap",
  variable: "--font-prompt",
});

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <title>ระบบสัมภาษณ์นักศึกษา</title>
        <meta
          name="description"
          content="ระบบสัมภาษณ์นักศึกษาสำหรับเก็บข้อมูลในการดูแล"
        />
        {/* โหลดฟอนต์ Prompt โดยตรง */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />

        {/* บังคับใช้ฟอนต์ Prompt ด้วย inline style */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          * {
            font-family: 'Prompt', 'Inter', sans-serif !important;
          }
          
          /* ปรับแต่ง line-height สำหรับภาษาไทย */
          p, div, span, li, a, button, input, textarea, select {
            line-height: 1.7 !important;
          }
          
          /* ปรับแต่งหัวข้อภาษาไทย */
          h1, h2, h3, h4, h5, h6 {
            line-height: 1.4 !important;
            letter-spacing: -0.01em !important;
          }
        `,
          }}
        />
      </head>
      <body
        className={`${prompt.className} ${inter.className}`}
        suppressHydrationWarning
      >
        {/* ครอบ AuthProvider รอบ InterviewProvider */}
        <AuthProvider>
          <InterviewProvider>
            <div className="min-h-screen bg-gray-100">
              {/* ตรวจสอบว่าอยู่ที่หน้าล็อกอินหรือไม่ เพื่อซ่อน Header */}
              {pathname !== "/login" && (
                <header className="bg-white shadow-sm">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                      <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                          <h1 className="text-xl font-bold text-blue-600">
                            ระบบสัมภาษณ์นักศึกษา
                          </h1>
                        </div>
                        <nav className="ml-6 flex space-x-8">
                          <Link
                            href="/"
                            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                              pathname === "/"
                                ? "border-blue-500 text-gray-900"
                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                            }`}
                          >
                            หน้าแรก
                          </Link>
                          <Link
                            href="/interview"
                            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                              pathname === "/interview"
                                ? "border-blue-500 text-gray-900"
                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                            }`}
                          >
                            สัมภาษณ์
                          </Link>
                          <Link
                            href="/reports"
                            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                              pathname === "/reports"
                                ? "border-blue-500 text-gray-900"
                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                            }`}
                          >
                            รายงาน
                          </Link>
                        </nav>
                      </div>
                      {/* เพิ่มปุ่มล็อกเอาท์ */}
                      <div className="flex items-center">
                        <LogoutButton />
                      </div>
                    </div>
                  </div>
                </header>
              )}

              {/* Main content */}
              <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
              </main>

              {/* Footer จะแสดงทุกหน้ารวมถึงหน้าล็อกอิน */}
              <footer className="bg-white shadow-inner py-4 mt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center text-gray-500 text-sm">
                    <p>
                      &copy; {new Date().getFullYear()} ระบบสัมภาษณ์นักศึกษา
                    </p>
                  </div>
                </div>
              </footer>

              {/* Notification component */}
              <Notification />
            </div>
          </InterviewProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

// คอมโพเนนต์ปุ่มล็อกเอาท์
function LogoutButton() {
  const { isLoggedIn, user, logout } = useAuth();

  if (!isLoggedIn || !user) return null;

  return (
    <div className="flex items-center space-x-4">
      <div className="text-sm">
        <span className="block text-gray-700">{user.staff_name}</span>
        <span className="block text-xs text-gray-500">
          {user.staff_faculty}
        </span>
      </div>
      <button
        onClick={logout}
        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        ออกจากระบบ
      </button>
    </div>
  );
}
