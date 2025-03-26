// frontend/src/components/InterviewerSelect.jsx
'use client';

import { useState, useEffect } from 'react';
import { useInterview } from '@/hooks/useInterview';
import { interviewerService } from '@/services/interviewerService';

export default function InterviewerSelect() {
  const { setInterviewer, showNotification } = useInterview();
  const [interviewers, setInterviewers] = useState([]);
  const [interviewerId, setInterviewerId] = useState('');
  const [loading, setLoading] = useState(false);
  
  // โหลดข้อมูลผู้สัมภาษณ์
  useEffect(() => {
    const loadInterviewers = async () => {
      try {
        setLoading(true);
        const response = await interviewerService.getAllInterviewers();
        if (response.success) {
          setInterviewers(response.data);
        } else {
          showNotification('ไม่สามารถโหลดข้อมูลผู้สัมภาษณ์ได้', 'error');
        }
      } catch (error) {
        showNotification('เกิดข้อผิดพลาด: ' + error.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    
    loadInterviewers();
  }, [showNotification]);
  
  // ค้นหาผู้สัมภาษณ์
  const handleInterviewerSelect = async () => {
    if (!interviewerId) {
      showNotification('กรุณากรอกรหัสผู้สัมภาษณ์', 'warning');
      return;
    }
    
    try {
      setLoading(true);
      const response = await interviewerService.getInterviewerById(interviewerId);
      if (response.success) {
        setInterviewer(response.data);
        showNotification(`เลือกผู้สัมภาษณ์ ${response.data.staff_name} เรียบร้อยแล้ว`, 'success');
      } else {
        showNotification('ไม่พบข้อมูลผู้สัมภาษณ์', 'error');
      }
    } catch (error) {
      showNotification('เกิดข้อผิดพลาด: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-semibold mb-4">เลือกผู้สัมภาษณ์</h2>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <label htmlFor="interviewer-id" className="block text-sm font-medium text-gray-700 mb-1">
            รหัสผู้สัมภาษณ์
          </label>
          <input
            id="interviewer-id"
            type="text"
            value={interviewerId}
            onChange={(e) => setInterviewerId(e.target.value)}
            placeholder="กรอกรหัสผู้สัมภาษณ์"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="self-end">
          <button
            onClick={handleInterviewerSelect}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
          >
            {loading ? 'กำลังค้นหา...' : 'ค้นหา'}
          </button>
        </div>
      </div>
      
      {interviewers.length > 0 && (
        <div className="mt-4">
          <label htmlFor="interviewer-select" className="block text-sm font-medium text-gray-700 mb-1">
            หรือเลือกจากรายการ
          </label>
          <select
            id="interviewer-select"
            value={interviewerId}
            onChange={(e) => setInterviewerId(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- เลือกผู้สัมภาษณ์ --</option>
            {interviewers.map((interviewer) => (
              <option key={interviewer.staff_id} value={interviewer.staff_id}>
                {interviewer.staff_id} - {interviewer.staff_name} ({interviewer.staff_faculty})
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

// frontend/src/components/StudentSearch.jsx
'use client';

import { useState } from 'react';
import { useInterview } from '@/hooks/useInterview';
import { studentService } from '@/services/studentService';

export default function StudentSearch() {
  const { setStudent, showNotification } = useInterview();
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  
  // ค้นหานักศึกษา
  const handleStudentSearch = async () => {
    if (!studentId) {
      showNotification('กรุณากรอกรหัสนักศึกษา', 'warning');
      return;
    }
    
    try {
      setLoading(true);
      const response = await studentService.getStudentById(studentId);
      if (response.success) {
        if (response.data.interviewed) {
          showNotification('นักศึกษาคนนี้ได้รับการสัมภาษณ์แล้ว', 'warning');
          return;
        }
        
        setStudent(response.data);
        showNotification(`เลือกนักศึกษา ${response.data.student_name} เรียบร้อยแล้ว`, 'success');
      } else {
        showNotification('ไม่พบข้อมูลนักศึกษา', 'error');
      }
    } catch (error) {
      showNotification('เกิดข้อผิดพลาด: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-semibold mb-4">ค้นหานักศึกษา</h2>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <label htmlFor="student-id" className="block text-sm font-medium text-gray-700 mb-1">
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
            {loading ? 'กำลังค้นหา...' : 'ค้นหา'}
          </button>
        </div>
      </div>
    </div>
  );
}

// frontend/src/components/StudentInfo.jsx
'use client';

import { useInterview } from '@/hooks/useInterview';

export default function StudentInfo() {
  const { student } = useInterview();
  
  if (!student) return null;
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-semibold mb-4">ข้อมูลนักศึกษา</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">รหัสนักศึกษา</p>
          <p className="font-medium">{student.student_id}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">ชื่อ-นามสกุล</p>
          <p className="font-medium">{student.student_name}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">คณะ</p>
          <p className="font-medium">{student.faculty}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">หลักสูตร</p>
          <p className="font-medium">{student.program}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">วิทยาเขต</p>
          <p className="font-medium">{student.campus}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">ระดับ</p>
          <p className="font-medium">{student.level}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">เบอร์โทรศัพท์</p>
          <p className="font-medium">{student.phone || '-'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">ทุนการศึกษา</p>
          <p className="font-medium">{student.scholarship || '-'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">โรงเรียนที่จบ</p>
          <p className="font-medium">{student.graduated_school || '-'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">ภูมิลำเนา</p>
          <p className="font-medium">{student.hometown || '-'}</p>
        </div>
      </div>
    </div>
  );
}

// frontend/src/components/QuestionForm.jsx
'use client';

import { useInterview } from '@/hooks/useInterview';

export default function QuestionForm() {
  const { 
    visibleQuestions, 
    answers, 
    saveAnswer,
    loading,
    submitInterview
  } = useInterview();
  
  // ฟังก์ชันสำหรับการตอบคำถาม
  const handleAnswerChange = (questionId, value) => {
    saveAnswer(questionId, value);
  };
  
  // สร้าง UI element สำหรับคำถามแต่ละประเภท
  const renderQuestionInput = (question) => {
    const questionId = question.question_id;
    const currentAnswer = answers[questionId] || '';
    
    switch (question.question_type) {
      case 'text':
        return (
          <input
            type="text"
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(questionId, e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="พิมพ์คำตอบของคุณที่นี่"
          />
        );
        
      case 'textarea':
        return (
          <textarea
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(questionId, e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="พิมพ์คำตอบของคุณที่นี่"
          />
        );
        
      case 'radio':
        try {
          const options = question.answer_options ? 
            question.answer_options.split(',').map(opt => opt.trim()) : 
            [];
          
          return (
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="radio"
                    id={`question-${questionId}-option-${index}`}
                    name={`question-${questionId}`}
                    value={option}
                    checked={currentAnswer === option}
                    onChange={() => handleAnswerChange(questionId, option)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`question-${questionId}-option-${index}`}
                    className="ml-2 block text-gray-700"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          );
        } catch (error) {
          console.error(`Error rendering radio options for question ${questionId}:`, error);
          return (
            <div className="text-red-500">
              เกิดข้อผิดพลาดในการแสดงตัวเลือก
            </div>
          );
        }
        
      case 'checkbox':
        try {
          const options = question.answer_options ? 
            question.answer_options.split(',').map(opt => opt.trim()) : 
            [];
          
          // แปลงคำตอบเป็น array ถ้าเป็น string
          const selectedOptions = currentAnswer ? 
            (typeof currentAnswer === 'string' ? currentAnswer.split(',').map(opt => opt.trim()) : currentAnswer) : 
            [];
          
          return (
            <div className="space-y-2">
              {options.map((option, index) => {
                const isChecked = selectedOptions.includes(option);
                
                return (
                  <div key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`question-${questionId}-option-${index}`}
                      value={option}
                      checked={isChecked}
                      onChange={() => {
                        // อัปเดตรายการตัวเลือกที่เลือก
                        const newSelectedOptions = isChecked
                          ? selectedOptions.filter(opt => opt !== option)
                          : [...selectedOptions, option];
                        
                        handleAnswerChange(questionId, newSelectedOptions.join(','));
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`question-${questionId}-option-${index}`}
                      className="ml-2 block text-gray-700"
                    >
                      {option}
                    </label>
                  </div>
                );
              })}
            </div>
          );
        } catch (error) {
          console.error(`Error rendering checkbox options for question ${questionId}:`, error);
          return (
            <div className="text-red-500">
              เกิดข้อผิดพลาดในการแสดงตัวเลือก
            </div>
          );
        }
        
      case 'select':
        try {
          const options = question.answer_options ? 
            question.answer_options.split(',').map(opt => opt.trim()) : 
            [];
          
          return (
            <select
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(questionId, e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- เลือกคำตอบ --</option>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        } catch (error) {
          console.error(`Error rendering select options for question ${questionId}:`, error);
          return (
            <div className="text-red-500">
              เกิดข้อผิดพลาดในการแสดงตัวเลือก
            </div>
          );
        }
        
      case 'number':
        return (
          <input
            type="number"
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(questionId, e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="กรอกตัวเลข"
          />
        );
        
      default:
        return (
          <input
            type="text"
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(questionId, e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="พิมพ์คำตอบของคุณที่นี่"
          />
        );
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitInterview();
  };
  
  if (visibleQuestions.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <div className="text-center py-8">
          <p className="text-lg text-gray-500">กำลังโหลดคำถาม...</p>
        </div>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-semibold mb-4">แบบสัมภาษณ์</h2>
      
      <div className="space-y-6">
        {visibleQuestions.map((question) => (
          <div key={question.question_id} className="border-b pb-4 last:border-b-0">
            <label className="block text-gray-700 font-medium mb-2">
              {question.question_id}. {question.question_text}
              {question.condition_display && (
                <span className="text-sm text-gray-500 ml-2">({question.condition_display})</span>
              )}
            </label>
            {renderQuestionInput(question)}
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex justify-center">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400"
        >
          {loading ? 'กำลังบันทึก...' : 'บันทึกการสัมภาษณ์'}
        </button>
      </div>
    </form>
  );
}

// frontend/src/components/Notification.jsx
'use client';

import { useInterview } from '@/hooks/useInterview';

export default function Notification() {
  const { notification } = useInterview();
  
  if (!notification.show) return null;
  
  // กำหนดสีตามประเภทการแจ้งเตือน
  const getNotificationStyle = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-100 border-green-500 text-green-700';
      case 'error':
        return 'bg-red-100 border-red-500 text-red-700';
      case 'warning':
        return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      default:
        return 'bg-blue-100 border-blue-500 text-blue-700';
    }
  };
  
  return (
    <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-md border-l-4 shadow-md ${getNotificationStyle()}`}>
      <p className="font-medium">{notification.message}</p>
    </div>
  );
}

// frontend/src/components/ExportButton.jsx
'use client';

import { useState } from 'react';
import { useInterview } from '@/hooks/useInterview';

export default function ExportButton() {
  const { downloadExcelReport } = useInterview();
  const [loading, setLoading] = useState(false);
  
  const handleExport = async () => {
    try {
      setLoading(true);
      await downloadExcelReport();
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400"
    >
      {loading ? 'กำลังส่งออก...' : 'ส่งออกข้อมูลเป็น Excel'}
    </button>
  );
}

// frontend/src/components/InterviewReport.jsx
'use client';

import { useState, useEffect } from 'react';
import { studentService } from '@/services/studentService';

export default function InterviewReport() {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const response = await studentService.getInterviewStatusSummary();
        if (response.success) {
          setSummary(response.data);
        } else {
          setError('ไม่สามารถโหลดข้อมูลสรุปได้');
        }
      } catch (err) {
        setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSummary();
  }, []);
  
  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="text-center py-8">
          <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">รายงานสรุปการสัมภาษณ์</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                คณะ
              </th>
              <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                หลักสูตร
              </th>
              <th className="py-2 px-4 border-b text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                นักศึกษาทั้งหมด
              </th>
              <th className="py-2 px-4 border-b text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                สัมภาษณ์แล้ว
              </th>
              <th className="py-2 px-4 border-b text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                ยังไม่ได้สัมภาษณ์
              </th>
              <th className="py-2 px-4 border-b text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                ความคืบหน้า
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {summary.map((item, index) => {
              const progress = item.total_students > 0 
                ? Math.round((item.interviewed_count / item.total_students) * 100) 
                : 0;
              
              return (
                <tr key={index}>
                  <td className="py-2 px-4 text-sm text-gray-900">
                    {item.faculty}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-900">
                    {item.program}
                  </td>
                  <td className="py-2 px-4 text-center text-sm text-gray-900">
                    {item.total_students}
                  </td>
                  <td className="py-2 px-4 text-center text-sm text-gray-900">
                    {item.interviewed_count}
                  </td>
                  <td className="py-2 px-4 text-center text-sm text-gray-900">
                    {item.not_interviewed_count}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-900">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-500">{progress}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
            
            {summary.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-500">
                  ไม่พบข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
