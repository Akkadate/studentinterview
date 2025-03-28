// frontend/src/app/reports/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { studentService } from "../../services/studentService";
import { useAuth } from "../../contexts/AuthContext"; // เพิ่ม useAuth
import InterviewReport from "../../components/InterviewReport";
import ExportButton from "../../components/ExportButton";
import ProtectedRoute from "../../components/ProtectedRoute"; // เพิ่ม ProtectedRoute

export default function ReportsPage() {
  const [notInterviewed, setNotInterviewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [faculty, setFaculty] = useState("");
  const [faculties, setFaculties] = useState([]);
  const { user } = useAuth(); // เพิ่มการดึงข้อมูลผู้ใช้

  useEffect(() => {
    const fetchNotInterviewed = async () => {
      try {
        setLoading(true);
        const response = await studentService.getNotInterviewedStudents();
        if (response.success) {
          setNotInterviewed(response.data);

          // Extract unique faculties
          const uniqueFaculties = [
            ...new Set(response.data.map((student) => student.faculty)),
          ];
          setFaculties(uniqueFaculties);
        } else {
          setError("ไม่สามารถโหลดข้อมูลนักศึกษาที่ยังไม่ได้รับการสัมภาษณ์ได้");
        }
      } catch (err) {
        setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchNotInterviewed();
  }, []);

  // กรองนักศึกษาตามคณะที่เลือก (สำหรับกรณีผู้บริหารที่เข้าถึงได้หลายคณะ)
  const filteredStudents = faculty
    ? notInterviewed.filter((student) => student.faculty === faculty)
    : notInterviewed;

  return (
    <ProtectedRoute>
      <div className="px-4 sm:px-0">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">รายงาน</h1>
          <ExportButton />
        </div>

        {/* แสดงข้อมูลผู้ล็อกอิน */}
        {user && (
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm mb-4">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">
              ข้อมูลผู้ดูรายงาน
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">รหัส</p>
                <p className="font-medium">{user.staff_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">ชื่อ-นามสกุล</p>
                <p className="font-medium">{user.staff_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">คณะ</p>
                <p className="font-medium">{user.staff_faculty}</p>
              </div>
            </div>

            {user.staff_faculty === "ผู้บริหาร" && (
              <div className="mt-2 text-sm text-blue-600">
                <p>* ท่านเป็นผู้บริหาร สามารถเข้าถึงข้อมูลนักศึกษาได้ทุกคณะ</p>
              </div>
            )}
          </div>
        )}

        {/* รายงานสรุปการสัมภาษณ์ */}
        <InterviewReport />

        {/* รายชื่อนักศึกษาที่ยังไม่ได้รับการสัมภาษณ์ */}
        <div className="bg-white p-4 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-semibold mb-4">
            รายชื่อนักศึกษาที่ยังไม่ได้รับการสัมภาษณ์
          </h2>

          {/* แสดงตัวกรองเฉพาะถ้าเป็นผู้บริหาร */}
          {user && user.staff_faculty === "ผู้บริหาร" && (
            <div className="mb-4">
              <label
                htmlFor="faculty-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                กรองตามคณะ
              </label>
              <select
                id="faculty-filter"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                className="w-full md:w-64 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">ทั้งหมด</option>
                {faculties.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      รหัสนักศึกษา
                    </th>
                    <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ชื่อ-นามสกุล
                    </th>
                    <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      คณะ
                    </th>
                    <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      หลักสูตร
                    </th>
                    <th className="py-2 px-4 border-b text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      การดำเนินการ
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.student_id}>
                      <td className="py-2 px-4 text-sm text-gray-900">
                        {student.student_id}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-900">
                        {student.student_name}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-900">
                        {student.faculty}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-900">
                        {student.program}
                      </td>
                      <td className="py-2 px-4 text-center">
                        <Link
                          href="/interview"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          สัมภาษณ์
                        </Link>
                      </td>
                    </tr>
                  ))}

                  {filteredStudents.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-4 text-center text-gray-500"
                      >
                        {notInterviewed.length === 0
                          ? "นักศึกษาทุกคนได้รับการสัมภาษณ์แล้ว"
                          : "ไม่พบนักศึกษาที่ตรงตามเงื่อนไขการค้นหา"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
