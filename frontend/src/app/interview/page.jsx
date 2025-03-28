// frontend/src/app/interview/page.jsx
"use client";

import { useInterview } from "../../hooks/useInterview";
import { useAuth } from "../../contexts/AuthContext";
import InterviewerSelect from "../../components/InterviewerSelect";
import StudentSearch from "../../components/StudentSearch";
import StudentInfo from "../../components/StudentInfo";
import QuestionForm from "../../components/QuestionForm";
import ProtectedRoute from "../../components/ProtectedRoute"; // เพิ่ม ProtectedRoute

export default function InterviewPage() {
  const { interviewer, student } = useInterview();
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="px-4 sm:px-0">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          สัมภาษณ์นักศึกษา
        </h1>

        {/* แสดงข้อมูลผู้ล็อกอิน */}
        {user && (
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm mb-4">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">
              ข้อมูลผู้สัมภาษณ์
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

        {/* ส่วนค้นหานักศึกษา */}
        <StudentSearch />

        {/* ส่วนแสดงข้อมูลนักศึกษา */}
        {student && <StudentInfo />}

        {/* ส่วนแบบสัมภาษณ์ */}
        {user && student && <QuestionForm />}
      </div>
    </ProtectedRoute>
  );
}
