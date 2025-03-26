// frontend/src/app/layout.jsx
'use client';

import { Inter } from 'next/font/google';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { InterviewProvider } from '@/contexts/InterviewContext';
import Notification from '@/components/Notification';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  return (
    <html lang="th">
      <head>
        <title>ระบบสัมภาษณ์นักศึกษา</title>
        <meta name="description" content="ระบบสัมภาษณ์นักศึกษาสำหรับเก็บข้อมูลในการดูแล" />
      </head>
      <body className={inter.className}>
        <InterviewProvider>
          <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex">
                    <div className="flex-shrink-0 flex items-center">
                      <h1 className="text-xl font-bold text-blue-600">ระบบสัมภาษณ์นักศึกษา</h1>
                    </div>
                    <nav className="ml-6 flex space-x-8">
                      <Link
                        href="/"
                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                          pathname === '/' 
                            ? 'border-blue-500 text-gray-900' 
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        }`}
                      >
                        หน้าแรก
                      </Link>
                      <Link
                        href="/interview"
                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                          pathname === '/interview' 
                            ? 'border-blue-500 text-gray-900' 
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        }`}
                      >
                        สัมภาษณ์
                      </Link>
                      <Link
                        href="/reports"
                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                          pathname === '/reports' 
                            ? 'border-blue-500 text-gray-900' 
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        }`}
                      >
                        รายงาน
                      </Link>
                    </nav>
                  </div>
                </div>
              </div>
            </header>

            {/* Main content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              {children}
            </main>
            
            {/* Footer */}
            <footer className="bg-white shadow-inner py-4 mt-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center text-gray-500 text-sm">
                  <p>&copy; {new Date().getFullYear()} ระบบสัมภาษณ์นักศึกษา</p>
                </div>
              </div>
            </footer>
            
            {/* Notification component */}
            <Notification />
          </div>
        </InterviewProvider>
      </body>
    </html>
  );
}

// frontend/src/app/page.jsx
'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="px-4 sm:px-0">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ยินดีต้อนรับสู่ระบบสัมภาษณ์นักศึกษา</h1>
            <p className="text-xl text-gray-500 mb-6">
              ระบบเก็บข้อมูลการสัมภาษณ์นักศึกษาเพื่อการดูแลและช่วยเหลือ
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-8">
              <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-blue-700 mb-2">สัมภาษณ์นักศึกษา</h2>
                <p className="text-gray-600 mb-4">
                  เริ่มการสัมภาษณ์นักศึกษาชั้นปีที่ 1 ทุกคณะและสาขาวิชา
                </p>
                <Link
                  href="/interview"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  ไปที่หน้าสัมภาษณ์
                </Link>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-green-700 mb-2">ดูรายงาน</h2>
                <p className="text-gray-600 mb-4">
                  ตรวจสอบผลการสัมภาษณ์ สถิติ และส่งออกข้อมูลเป็น Excel
                </p>
                <Link
                  href="/reports"
                  className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  ไปที่หน้ารายงาน
                </Link>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">ภาพรวมระบบ</h2>
              <ul className="text-left max-w-lg mx-auto text-gray-600 space-y-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>สัมภาษณ์นักศึกษาชั้นปีที่ 1 ทุกหลักสูตร ทุกคณะ</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>คำถามเกี่ยวกับข้อมูลส่วนบุคคลนักศึกษา เพื่อเป็นข้อมูลในการช่วยเหลือดูแล</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>รายงานสถิติ จำนวนนักศึกษาที่ตอบแบบสอบถาม และยังไม่ตอบ</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>ดูรายชื่อผู้ยังไม่ตอบแบบสัมภาษณ์ได้</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>ส่งออกข้อมูลการสัมภาษณ์ทั้งหมดเป็น Excel</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// frontend/src/app/interview/page.jsx
'use client';

import { useInterview } from '@/hooks/useInterview';
import InterviewerSelect from '@/components/InterviewerSelect';
import StudentSearch from '@/components/StudentSearch';
import StudentInfo from '@/components/StudentInfo';
import QuestionForm from '@/components/QuestionForm';

export default function InterviewPage() {
  const { interviewer, student } = useInterview();
  
  return (
    <div className="px-4 sm:px-0">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">สัมภาษณ์นักศึกษา</h1>
      
      {/* ส่วนเลือกผู้สัมภาษณ์ */}
      <InterviewerSelect />
      
      {interviewer && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-xl font-semibold mb-4">ข้อมูลผู้สัมภาษณ์</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">รหัส</p>
              <p className="font-medium">{interviewer.staff_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">ชื่อ-นามสกุล</p>
              <p className="font-medium">{interviewer.staff_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">คณะ</p>
              <p className="font-medium">{interviewer.staff_faculty}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* ส่วนค้นหานักศึกษา */}
      {interviewer && <StudentSearch />}
      
      {/* ส่วนแสดงข้อมูลนักศึกษา */}
      {student && <StudentInfo />}
      
      {/* ส่วนแบบสัมภาษณ์ */}
      {interviewer && student && <QuestionForm />}
    </div>
  );
}

// frontend/src/app/reports/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { studentService } from '@/services/studentService';
import InterviewReport from '@/components/InterviewReport';
import ExportButton from '@/components/ExportButton';

export default function ReportsPage() {
  const [notInterviewed, setNotInterviewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [faculty, setFaculty] = useState('');
  const [faculties, setFaculties] = useState([]);
  
  useEffect(() => {
    const fetchNotInterviewed = async () => {
      try {
        setLoading(true);
        const response = await studentService.getNotInterviewedStudents();
        if (response.success) {
          setNotInterviewed(response.data);
          
          // Extract unique faculties
          const uniqueFaculties = [...new Set(response.data.map(student => student.faculty))];
          setFaculties(uniqueFaculties);
        } else {
          setError('ไม่สามารถโหลดข้อมูลนักศึกษาที่ยังไม่ได้รับการสัมภาษณ์ได้');
        }
      } catch (err) {
        setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotInterviewed();
  }, []);
  
  // กรองนักศึกษาตามคณะ
  const filteredStudents = faculty 
    ? notInterviewed.filter(student => student.faculty === faculty)
    : notInterviewed;
  
  return (
    <div className="px-4 sm:px-0">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">รายงาน</h1>
        <ExportButton />
      </div>
      
      {/* รายงานสรุปการสัมภาษณ์ */}
      <InterviewReport />
      
      {/* รายชื่อนักศึกษาที่ยังไม่ได้รับการสัมภาษณ์ */}
      <div className="bg-white p-4 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold mb-4">รายชื่อนักศึกษาที่ยังไม่ได้รับการสัมภาษณ์</h2>
        
        {/* ตัวกรองตามคณะ */}
        <div className="mb-4">
          <label htmlFor="faculty-filter" className="block text-sm font-medium text-gray-700 mb-1">
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
                    <td colSpan={5} className="py-4 text-center text-gray-500">
                      {notInterviewed.length === 0 
                        ? 'นักศึกษาทุกคนได้รับการสัมภาษณ์แล้ว'
                        : 'ไม่พบนักศึกษาที่ตรงตามเงื่อนไขการค้นหา'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// frontend/src/app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-rgb: 243, 244, 246;
}

body {
  color: rgb(var(--foreground-rgb));
  background: rgb(var(--background-rgb));
}
