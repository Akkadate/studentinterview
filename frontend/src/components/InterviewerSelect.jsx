// frontend/src/components/InterviewerSelect.jsx
'use client';

import { useState, useEffect } from 'react';
import { useInterview } from '../hooks/useInterview';
import { interviewerService } from '../services/interviewerService';

export default function InterviewerSelect() {
  const { setInterviewer, showNotification } = useInterview();
  const [interviewers, setInterviewers] = useState([]);
  const [interviewerId, setInterviewerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // โหลดข้อมูลผู้สัมภาษณ์
  useEffect(() => {
    let isMounted = true; // ป้องกันการอัปเดตหลัง unmount
    
    const loadInterviewers = async () => {
      if (loading) return; // ป้องกันการเรียกซ้ำ
      
      try {
        setLoading(true);
        console.log('กำลังโหลดข้อมูลผู้สัมภาษณ์...');
        
        const response = await interviewerService.getAllInterviewers();
        
        // ตรวจสอบว่าคอมโพเนนต์ยัง mount อยู่หรือไม่
        if (!isMounted) return;
        
        if (response.success) {
          setInterviewers(response.data);
        } else {
          showNotification('ไม่สามารถโหลดข้อมูลผู้สัมภาษณ์ได้', 'error');
        }
      } catch (error) {
        // ตรวจสอบว่าคอมโพเนนต์ยัง mount อยู่หรือไม่
        if (!isMounted) return;
        
        console.error('Error loading interviewers:', error);
        showNotification('เกิดข้อผิดพลาดในการโหลดข้อมูล: ' + error.message, 'error');
      } finally {
        // ตรวจสอบว่าคอมโพเนนต์ยัง mount อยู่หรือไม่
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadInterviewers();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [retryCount]); // ใช้ retryCount เท่านั้นเป็น dependency
  
  // ฟังก์ชันสำหรับลองโหลดข้อมูลใหม่
  const handleRetry = () => {
    setRetryCount(prevCount => prevCount + 1);
  };
  
  // ค้นหาผู้สัมภาษณ์
  const handleInterviewerSelect = async () => {
    if (!interviewerId) {
      showNotification('กรุณากรอกรหัสผู้สัมภาษณ์', 'warning');
      return;
    }
    
    try {
      setLoading(true);
      
      // ค้นหาในข้อมูลที่โหลดมาแล้ว
      const found = interviewers.find(
        interviewer => interviewer.staff_id.toString() === interviewerId.toString()
      );
      
      if (found) {
        setInterviewer(found);
        showNotification(`เลือกผู้สัมภาษณ์ ${found.staff_name} เรียบร้อยแล้ว`, 'success');
        return;
      }
      
      // ถ้าไม่พบในข้อมูลที่โหลดมาแล้ว ให้ค้นหาจาก API
      const response = await interviewerService.getInterviewerById(interviewerId);
      
      if (response.success) {
        setInterviewer(response.data);
        showNotification(`เลือกผู้สัมภาษณ์ ${response.data.staff_name} เรียบร้อยแล้ว`, 'success');
        
        // เพิ่มผู้สัมภาษณ์ที่พบเข้าไปในรายการ
        if (!interviewers.some(i => i.staff_id === response.data.staff_id)) {
          setInterviewers(prev => [...prev, response.data]);
        }
      } else {
        showNotification('ไม่พบข้อมูลผู้สัมภาษณ์', 'error');
      }
    } catch (error) {
      console.error('Error selecting interviewer:', error);
      showNotification('เกิดข้อผิดพลาดในการค้นหาผู้สัมภาษณ์: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // เลือกผู้สัมภาษณ์จาก dropdown
  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    setInterviewerId(selectedId);
    
    if (selectedId) {
      const found = interviewers.find(
        interviewer => interviewer.staff_id.toString() === selectedId.toString()
      );
      
      if (found) {
        setInterviewer(found);
        showNotification(`เลือกผู้สัมภาษณ์ ${found.staff_name} เรียบร้อยแล้ว`, 'success');
      }
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
            onChange={handleSelectChange}
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
      
      {/* แสดงปุ่มลองใหม่เมื่อไม่มีรายการผู้สัมภาษณ์ */}
      {interviewers.length === 0 && !loading && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 mb-2">ไม่สามารถโหลดข้อมูลผู้สัมภาษณ์ได้</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            ลองใหม่
          </button>
        </div>
      )}
      
      {/* แสดงข้อความโหลดข้อมูล */}
      {loading && (
        <div className="mt-4 text-center text-gray-500">
          <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
          กำลังโหลดข้อมูล...
        </div>
      )}
    </div>
  );
}