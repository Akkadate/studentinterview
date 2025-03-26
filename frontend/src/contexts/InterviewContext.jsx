// frontend/src/contexts/InterviewContext.jsx
'use client';

import { createContext, useState, useEffect } from 'react';
import { questionService } from '@/services/questionService';

// สร้าง Context สำหรับข้อมูลการสัมภาษณ์
export const InterviewContext = createContext();

// Provider Component
export const InterviewProvider = ({ children }) => {
  // สถานะสำหรับผู้สัมภาษณ์
  const [interviewer, setInterviewer] = useState(null);
  
  // สถานะสำหรับนักศึกษา
  const [student, setStudent] = useState(null);
  
  // สถานะสำหรับคำถามทั้งหมด
  const [questions, setQuestions] = useState([]);
  
  // สถานะสำหรับคำตอบ
  const [answers, setAnswers] = useState({});
  
  // สถานะสำหรับคำถามที่แสดง (ตามเงื่อนไข)
  const [visibleQuestions, setVisibleQuestions] = useState([]);
  
  // สถานะแสดงความคืบหน้า
  const [loading, setLoading] = useState(false);
  
  // สถานะข้อความแจ้งเตือน
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  
  // โหลดคำถามเมื่อ component ถูกโหลด
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const response = await questionService.getAllQuestions();
        if (response.success) {
          setQuestions(response.data);
          // เริ่มต้นให้คำถามทั้งหมดแสดง
          setVisibleQuestions(response.data);
        }
      } catch (error) {
        showNotification('ไม่สามารถโหลดคำถามได้: ' + error.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    
    loadQuestions();
  }, []);
  
  // อัปเดตคำถามที่มองเห็นตามเงื่อนไข
  useEffect(() => {
    if (questions.length === 0) return;
    
    // กรองคำถามตามเงื่อนไข
    const evaluateConditions = () => {
      const visible = questions.filter(question => {
        // ถ้าไม่มีเงื่อนไข ให้แสดงคำถามนั้น
        if (!question.condition_logic || question.condition_logic.trim() === '') {
          return true;
        }
        
        try {
          // แยกเงื่อนไขเป็น [questionId, operator, value]
          const conditions = question.condition_logic.split(',').map(c => c.trim());
          
          // ตรวจสอบทุกเงื่อนไข
          return conditions.every(condition => {
            const parts = condition.split(':');
            if (parts.length !== 3) return true;
            
            const [qId, operator, expectedValue] = parts;
            const questionId = parseInt(qId);
            const actualValue = answers[questionId] || '';
            
            switch (operator) {
              case 'eq':
                return actualValue === expectedValue;
              case 'neq':
                return actualValue !== expectedValue;
              case 'contains':
                return actualValue.includes(expectedValue);
              case 'gt':
                return parseFloat(actualValue) > parseFloat(expectedValue);
              case 'lt':
                return parseFloat(actualValue) < parseFloat(expectedValue);
              default:
                return true;
            }
          });
        } catch (error) {
          console.error(`Error evaluating condition for question ${question.question_id}:`, error);
          return true; // แสดงคำถามถ้าการประเมินเงื่อนไขมีข้อผิดพลาด
        }
      });
      
      setVisibleQuestions(visible);
    };
    
    evaluateConditions();
  }, [questions, answers]);
  
  // บันทึกคำตอบ
  const saveAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  // รีเซ็ตข้อมูลการสัมภาษณ์
  const resetInterview = () => {
    setStudent(null);
    setAnswers({});
  };
  
  // แสดงข้อความแจ้งเตือน
  const showNotification = (message, type = 'info') => {
    setNotification({
      show: true,
      message,
      type
    });
    
    // ซ่อนข้อความแจ้งเตือนหลังจาก 5 วินาที
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };
  
  return (
    <InterviewContext.Provider
      value={{
        interviewer,
        setInterviewer,
        student,
        setStudent,
        questions,
        answers,
        saveAnswer,
        visibleQuestions,
        loading,
        setLoading,
        notification,
        showNotification,
        resetInterview
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

// frontend/src/hooks/useInterview.js
'use client';

import { useContext } from 'react';
import { InterviewContext } from '@/contexts/InterviewContext';
import { interviewService } from '@/services/interviewService';

export const useInterview = () => {
  const context = useContext(InterviewContext);
  
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  
  const { 
    interviewer, 
    student, 
    answers, 
    questions,
    visibleQuestions,
    setLoading, 
    showNotification, 
    resetInterview 
  } = context;
  
  /**
   * บันทึกการสัมภาษณ์
   * @returns {Promise<boolean>} สถานะการบันทึก
   */
  const submitInterview = async () => {
    // ตรวจสอบข้อมูลจำเป็น
    if (!interviewer) {
      showNotification('กรุณาเลือกผู้สัมภาษณ์', 'error');
      return false;
    }
    
    if (!student) {
      showNotification('กรุณาเลือกนักศึกษา', 'error');
      return false;
    }
    
    // ตรวจสอบคำตอบ
    const unansweredQuestions = visibleQuestions.filter(q => !answers[q.question_id]);
    
    if (unansweredQuestions.length > 0) {
      showNotification(`กรุณาตอบคำถามทั้งหมด (ยังเหลืออีก ${unansweredQuestions.length} ข้อ)`, 'warning');
      return false;
    }
    
    try {
      setLoading(true);
      
      // แปลงคำตอบเป็นรูปแบบที่ API ต้องการ
      const answersArray = Object.keys(answers).map(questionId => ({
        question_id: parseInt(questionId),
        answer_text: answers[questionId]
      }));
      
      // สร้างข้อมูลการสัมภาษณ์
      const interviewData = {
        student_id: student.student_id,
        interviewer_id: interviewer.staff_id,
        answers: answersArray
      };
      
      // บันทึกข้อมูลการสัมภาษณ์
      const response = await interviewService.createInterview(interviewData);
      
      if (response.success) {
        showNotification('บันทึกข้อมูลการสัมภาษณ์เรียบร้อยแล้ว', 'success');
        resetInterview();
        return true;
      } else {
        showNotification(response.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
        return false;
      }
    } catch (error) {
      showNotification('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + error.message, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * ดาวน์โหลดข้อมูลการสัมภาษณ์เป็น Excel
   */
  const downloadExcelReport = async () => {
    try {
      setLoading(true);
      
      // ดึงข้อมูล Excel
      const blob = await interviewService.exportInterviewsToExcel();
      
      // สร้าง URL สำหรับดาวน์โหลด
      const url = window.URL.createObjectURL(blob);
      
      // สร้างลิงก์ดาวน์โหลด
      const a = document.createElement('a');
      a.href = url;
      a.download = `interview_data_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      
      // ลบลิงก์
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showNotification('ดาวน์โหลดรายงาน Excel เรียบร้อยแล้ว', 'success');
    } catch (error) {
      showNotification('เกิดข้อผิดพลาดในการดาวน์โหลดรายงาน: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  return {
    ...context,
    submitInterview,
    downloadExcelReport
  };
};
