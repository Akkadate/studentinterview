// frontend/src/components/StudentSearch.jsx
"use client";

import { useState } from "react";
import { useInterview } from "../hooks/useInterview";
import { useAuth } from "../contexts/AuthContext"; // เพิ่ม useAuth
import { studentService } from "../services/studentService";

export default function StudentSearch() {
  const { setStudent, showNotification } = useInterview();
  const { user, hasAccessToFaculty } = useAuth(); // เพิ่ม user และ hasAccessToFaculty
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);

  // ค้นหานักศึกษา
  const handleStudentSearch = async () => {
    if (!studentId) {
      showNotification("กรุณากรอกรหัสนักศึกษา", "warning");
      return;
    }

    try {
      setLoading(true);
      const response = await studentService.getStudentById(studentId);

      if (response.success) {
        // ตรวจสอบสิทธิ์การเข้าถึงตามคณะ
        if (!hasAccessToFaculty(response.data.faculty)) {
          showNotification(
            "ข้อมูลถูกจำกัดการเข้าถึงตามสิทธิ์ที่ได้รับ ท่านไม่สามารถเข้าถึงข้อมูลนักศึกษาคณะอื่นได้",
            "error"
          );
          return;
        }

        if (response.data.interviewed) {
          showNotification("นักศึกษาคนนี้ได้รับการสัมภาษณ์แล้ว", "warning");
          return;
        }

        setStudent(response.data);
        showNotification(
          `เลือกนักศึกษา ${response.data.student_name} เรียบร้อยแล้ว`,
          "success"
        );
      } else {
        showNotification("ไม่พบข้อมูลนักศึกษา", "error");
      }
    } catch (error) {
      showNotification("เกิดข้อผิดพลาด: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // การค้นหานักศึกษาตามคณะของผู้สัมภาษณ์
  const searchStudentsByFaculty = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // ถ้าเป็นผู้บริหาร ดึงข้อมูลนักศึกษาทั้งหมด ถ้าไม่ใช่ ดึงเฉพาะนักศึกษาในคณะเดียวกัน
      const response =
        user.staff_faculty === "ผู้บริหาร"
          ? await studentService.getNotInterviewedStudents()
          : await studentService.getStudentsByFaculty(user.staff_faculty);

      if (response.success && response.data.length > 0) {
        showNotification(
          `พบนักศึกษา ${response.data.length} คน ที่ยังไม่ได้รับการสัมภาษณ์`,
          "info"
        );
      } else {
        showNotification("ไม่พบนักศึกษาที่ยังไม่ได้รับการสัมภาษณ์", "info");
      }
    } catch (error) {
      showNotification(
        "เกิดข้อผิดพลาดในการค้นหานักศึกษา: " + error.message,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-semibold mb-4">ค้นหานักศึกษา</h2>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <label
            htmlFor="student-id"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            รหัสนักศึกษา
          </label>
          <input
            id="student-id"
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="กรอกรหัสนักศึกษา"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="self-end">
          <button
            onClick={handleStudentSearch}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
          >
            {loading ? "กำลังค้นหา..." : "ค้นหา"}
          </button>
        </div>
      </div>

      {user && (
        <div className="mt-4 text-sm">
          <p className="text-gray-600">
            {user.staff_faculty === "ผู้บริหาร"
              ? "ท่านสามารถค้นหานักศึกษาจากทุกคณะ"
              : `ท่านสามารถค้นหานักศึกษาเฉพาะคณะ ${user.staff_faculty} เท่านั้น`}
          </p>
        </div>
      )}
    </div>
  );
}
