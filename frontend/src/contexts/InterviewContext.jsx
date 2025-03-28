// frontend/src/contexts/InterviewContext.jsx
"use client";

import { createContext, useState, useEffect } from "react";
import { questionService } from "../services/questionService";

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
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "info",
  });

  // แก้ไขส่วน useEffect ที่โหลดคำถาม
  useEffect(() => {
    // frontend/src/contexts/InterviewContext.jsx
    const loadQuestions = async () => {
      // ตรวจสอบว่าได้ล็อกอินแล้วหรือไม่
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    
      if (!isLoggedIn) {
        console.log("Not logged in, skipping question loading");
        // อาจจะต้องกำหนดค่าเริ่มต้นบางอย่างที่นี่
        return;
      }
    
      try {
        setLoading(true);
        const response = await questionService.getAllQuestions();
        
        // เพิ่มการตรวจสอบว่า response เป็น undefined หรือไม่
        if (!response) {
          console.error("ไม่สามารถโหลดคำถามได้: ไม่มีข้อมูลตอบกลับจาก API");
          setLoading(false);
          return;
        }
        
        if (response.success) {
          setQuestions(response.data);
        } else {
          console.error("ไม่สามารถโหลดคำถามได้:", response);
          // จัดการกับกรณีที่ไม่สามารถโหลดคำถามได้
          if (response.message === "ข้อมูลถูกจำกัดการเข้าถึงตามสิทธิ์ที่ได้รับ") {
            // อาจจะต้องนำทางกลับไปยังหน้าล็อกอิน
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
          }
        }
      } catch (error) {
        console.error("ไม่สามารถโหลดคำถามได้:", error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  // แก้ไขส่วน useEffect ที่อัปเดตคำถามที่มองเห็น
  useEffect(() => {
    if (questions.length === 0) return;

    // กรองคำถามตามเงื่อนไข
    const evaluateConditions = () => {
      const visible = questions.filter((question) => {
        // ถ้าไม่มีเงื่อนไข ให้แสดงคำถามนั้น
        if (
          !question.condition_logic ||
          question.condition_logic.trim() === ""
        ) {
          return true;
        }

        try {
          // แยกเงื่อนไขเป็น [questionId, operator, value]
          const conditions = question.condition_logic
            .split(",")
            .map((c) => c.trim());

          // ตรวจสอบทุกเงื่อนไข
          return conditions.every((condition) => {
            const parts = condition.split(":");
            if (parts.length !== 3) return true;

            const [qId, operator, expectedValue] = parts;
            const questionId = parseFloat(qId);
            const actualValue = answers[questionId] || "";

            switch (operator) {
              case "eq":
                return actualValue === expectedValue;
              case "neq":
                return actualValue !== expectedValue;
              case "contains":
                return actualValue.includes(expectedValue);
              case "gt":
                return parseFloat(actualValue) > parseFloat(expectedValue);
              case "lt":
                return parseFloat(actualValue) < parseFloat(expectedValue);
              default:
                return true;
            }
          });
        } catch (error) {
          console.error(
            `Error evaluating condition for question ${question.question_id}:`,
            error
          );
          return true; // แสดงคำถามถ้าการประเมินเงื่อนไขมีข้อผิดพลาด
        }
      });

      setVisibleQuestions(visible);
    };

    evaluateConditions();
  }, [questions, answers]); // ← ระบุ

  // บันทึกคำตอบ
  const saveAnswer = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // รีเซ็ตข้อมูลการสัมภาษณ์
  const resetInterview = () => {
    setStudent(null);
    setAnswers({});
  };

  // แสดงข้อความแจ้งเตือน
  const showNotification = (message, type = "info") => {
    setNotification({
      show: true,
      message,
      type,
    });

    // ซ่อนข้อความแจ้งเตือนหลังจาก 5 วินาที
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
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
        resetInterview,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};
